import dayjs from "dayjs";
import routeHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
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
 * @description get expenses summarized by category in the current month
 * @method GET /api/expenses/summary
 * @access protected
 */
export const getMonthSummary = routeHandler(
  async (
    req: TypedRequest<{}, {}>,
    res: TypedResponse<Array<{ category: ICategory; spent: number }>>
  ) => {
    // TODO: Should we get these values from the frontend ??
    const firstDay = dayjs().startOf("month").toDate();
    const lastDay = dayjs().endOf("month").toDate();

    console.log({ firstDay, lastDay });

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
            $gte: firstDay,
            $lte: lastDay,
          },
        },
      },
      {
        $group: {
          _id: { category: "$category" },
          total: { $sum: "$amount" },
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
