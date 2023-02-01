import routeHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { PipelineStage, Types } from "mongoose";
import Expense from "../models/expense.model";
import { ICategory } from "../types/category";
import { IExpense } from "../types/expense";
import { TypedRequest, TypedResponse } from "../types/requests";

/**
 * Save a new expense.
 * @description get expenses of a user
 * @method POST /api/expenses
 * @access protected
 */
export const createExpense = routeHandler(
  async (req: TypedRequest<{}, IExpense>, res: TypedResponse) => {
    const { userId } = req;
    const { title, amount, expenseDate, category }: IExpense = req.body;
    const ex: IExpense = req.body;

    if (!title || !amount || !expenseDate || !category) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error("Please provide all required fields.");
    }

    const expense = new Expense({ ...ex, user: userId });
    await expense.save();

    res.json({ message: "Expense saved successfully." });
  }
);

/**
 * Save a new expense.
 * @description get expenses of a user
 * @method PUT /api/expenses
 * @access protected
 */
export const updateExpense = routeHandler(
  async (req: TypedRequest<{}, IExpense>, res: TypedResponse) => {
    const { title, amount, expenseDate, category, _id }: IExpense = req.body;
    const ex: IExpense = req.body;

    if (!_id || !title || !amount || !expenseDate || !category) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error("Please provide all required fields.");
    }

    await Expense.findByIdAndUpdate(_id, { $set: ex });
    res.json({ message: "Expense updated successfully." });
  }
);

/**
 * Save a new expense.
 * @description get expenses summarized by category in the month time frame provided
 * @method GET /api/expenses/summary
 * @access protected
 */
export const getMonthSummary = routeHandler(
  async (
    req: TypedRequest<{ firstDay: string; lastDay: string }, {}>,
    res: TypedResponse<Array<{ category: ICategory; spent: number }>>
  ) => {
    const { firstDay, lastDay } = req.query;

    /**
     * Aggregation pipeline
     * #1 find in 'expenses' collection
     *    > unreverted expenses by the current user
     *    > which are not part of an expense plan
     *    > created between the first and last of the current month
     * #2 group by category id, and compute sum of all expenses
     * #3 lookup the 'categories' collection to get the category data
     * #4 unwing the category array to have it as an object.
     * #5 remove unwanted fields using projection
     */
    const summary = await Expense.aggregate([
      {
        $match: {
          user: new Types.ObjectId(req.userId),
          plan: null,
          reverted: false,
          expenseDate: {
            $gte: new Date(firstDay),
            $lte: new Date(lastDay),
          },
        },
      },
      {
        $group: {
          _id: { category: "$category" },
          spent: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id.category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          _id: false,
          amounts: false,
          "category._id": false,
          "category.__v": false,
        },
      },
    ]);

    res.json({
      message: "Summary for the current month retrieved successfully.",
      response: summary,
    });
  }
);

type ListingQueryParams = {
  filter: {
    startDate: string;
    endDate: string;
    categories: string[];
  };
  sort: {
    expenseDate?: 1 | -1;
    amount?: 1 | -1;
  };
  paginate: {
    page: number;
    size: number;
  };
};

/**
 * Expenses list
 * @description Get expense list with filter|sort|pagination
 * @method GET /api/expenses/list
 * @access protected
 */
export const listExpenses = routeHandler(
  async (
    req: TypedRequest<{}, ListingQueryParams>,
    res: TypedResponse<ICategory[]>
  ) => {
    const { filter, paginate, sort } = req.body;

    // Create the filtering stage for pipeline.
    const matchStage: PipelineStage = {
      $match: {
        user: new Types.ObjectId(req.userId),
        plan: null,
        expenseDate: {
          $gte: new Date(filter.startDate),
          $lte: new Date(filter.endDate),
        },
      },
    };

    // Add category list filter query if present in the request body.
    if (filter.categories.length > 0)
      matchStage.$match.category = {
        $in: filter.categories.map((c) => new Types.ObjectId(c)),
      };

    // Create the sorting stage for pipeline.
    const sortStage: PipelineStage = {
      $sort: sort ? sort : { expenseDate: -1 },
    };

    // Lookup stage segments to collect category data in the pipeline.
    const lookup1: PipelineStage = {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    };
    const lookup2: PipelineStage = { $unwind: "$category" };
    const lookup3: PipelineStage = {
      $project: {
        "category._id": false,
        "category.__v": false,
        "category.amount": false,
        "category.description": false,
        "category.managed": false,
        user: false,
        __v: false,
      },
    };

    // Create the general pipeline for the listing data
    const dataFacet: (
      | PipelineStage.Lookup
      | PipelineStage.Match
      | PipelineStage.Project
      | PipelineStage.Sort
      | PipelineStage.Unwind
      | PipelineStage.Skip
      | PipelineStage.Limit
    )[] = [matchStage, sortStage, lookup1, lookup2, lookup3];

    // Add Pagination Stage if present in the request body.
    if (paginate) {
      dataFacet.push(
        { $skip: paginate.page * paginate.size },
        { $limit: paginate.size }
      );
    }

    /**
     * Faceted aggregation pipeline.
     * Uses the same matching stage for both facets:
     *  > First facet has paginated data.
     *  > Second facet counts documents; providing metadata for the page.
     * Unwind the meta facet to have it as an object instead of default array.
     */
    const expenses = await Expense.aggregate([
      {
        $facet: {
          data: dataFacet,
          meta: [
            matchStage,
            { $count: "totalDocuments" },
            {
              $addFields: {
                ...paginate,
                totalPages: {
                  $ceil: { $divide: ["$totalDocuments", paginate.size] },
                },
              },
            },
          ],
        },
      },
      { $unwind: "$meta" },
    ]);

    res.json({
      message: "List retrieved successfully.",
      response: expenses,
    });
  }
);

/**
 * Delete expense
 * @description Delete a single expense by a user
 * @method DELETE /api/expenses
 * @access protected
 */
export const deleteExpense = routeHandler(
  async (
    req: TypedRequest<{ expenseId: "string" }, {}>,
    res: TypedResponse
  ) => {
    const deleted = await Expense.deleteOne({
      user: new Types.ObjectId(req.userId),
      _id: new Types.ObjectId(req.query.expenseId),
    });

    if (deleted.acknowledged && deleted.deletedCount === 1) {
      res.json({ message: "Expense deleted successfully." });
    } else if (deleted.deletedCount === 0) {
      res.status(StatusCodes.NOT_FOUND);
      throw new Error("The Expense you're trying to delete does not exist.");
    }
  }
);
