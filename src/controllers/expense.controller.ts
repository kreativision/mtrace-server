import routeHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { IExpense } from "../types/expense";
import { TypedRequest, TypedResponse } from "../types/requests";

/**
 * This method will be fetch all the expenses of the user for a given month and year.
 * Implementation pending
 * @description get expenses of a user
 * @method GET /api/expenses
 * @access protected
 */
export const getAllExpense = routeHandler(
  async (req: TypedRequest<{}, IExpense>, res: TypedResponse) => {
    const { userId } = req;
    res
      .status(StatusCodes.OK)
      .json({ message: `All expenses for ${userId} for given month` });
  }
);
