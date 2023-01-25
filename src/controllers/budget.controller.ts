import routeHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import Budget from "../models/budget.model";
import Category from "../models/category.model";
import { IBudget } from "../types/budget";
import { TypedRequest, TypedResponse } from "../types/requests";

/**
 * @description This method is used to create the budget for a given month and year for a user
 * @method POST /api/budget
 * @access protected
 */
export const createBudget = routeHandler(
  async (req: TypedRequest<{}, Partial<IBudget>>, res: TypedResponse) => {
    const { userId } = req;
    const { categories, month, year } = req.body;
    const createdCategories = await Category.insertMany(categories);
    const _ids = createdCategories?.map((cat) => cat._id);
    await Budget.create({
      user: userId,
      categories: _ids,
      month,
      year,
    });
    res.status(StatusCodes.OK).json({ message: "Budget created successfully" });
  }
);
