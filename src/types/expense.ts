import { Types } from "mongoose";

/**
 *
 * This type is used for creating the Expense Model
 */
export type IExpense = {
  _id?: Types.ObjectId;
  title: String;
  description: String;
  expenseDate: Date;
  category: Types.ObjectId;
  user: Types.ObjectId;
  plan?: Types.ObjectId;
  amount: Number;
  reverted: Boolean;
};
