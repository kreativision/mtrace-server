import routeHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import Budget from "../models/budget.model";
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
    const created = await Budget.create({
      user: userId,
      categories,
      month,
      year,
    });
    if (created) {
      res
        .status(StatusCodes.OK)
        .json({ message: "Budget created successfully" });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      throw new Error("Something went wrong while creating budget.");
    }
  }
);
