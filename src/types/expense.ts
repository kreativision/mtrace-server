import { Types } from "mongoose";

/**
 * TODO add reference to report as well
 * This interface is used for creating the Expense Model
 */
export type IExpense = {
  _id: Types.ObjectId;
  title: String;
  description: String;
  expenseDate: Date;
  category: String;
  user: Types.ObjectId;
  amount: Number;
  reverted: Boolean;
};
