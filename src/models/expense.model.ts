import { model, Schema } from "mongoose";
import { IExpense } from "../types/expense";

const expenseSchema = new Schema<IExpense>(
  {
    title: { type: String, required: true, trim: true, maxlength: 40 },
    description: { type: String, trim: true, maxlength: 260 },
    expenseDate: { type: Date, default: Date.now },
    category: {
      type: Schema.Types.ObjectId,
      required: [true, "Please add the category"],
      ref: "Category",
    },
    plan: { type: Schema.Types.ObjectId, ref: "ExpensePlan" },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    amount: { type: Number, required: true },
    reverted: { type: Boolean, required: true, default: false },
  },
  { timestamps: false }
);

const Expense = model("Expense", expenseSchema);
export default Expense;
