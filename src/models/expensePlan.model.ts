import mongoose, { model, Schema } from "mongoose";
import { IExpensePlan } from "../types/expensePlan";
import User from "./user.model";

const expensePlanSchema = new Schema<IExpensePlan>(
  {
    name: {
      type: String,
      required: [true, "Plan name is required"],
      trim: true,
      maxlength: 40,
    },
    description: {
      type: String,
      required: [true, "Plan description is required"],
      maxlength: 180,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: User,
    },
    open: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const ExpensePlan = model("ExpensePlan", expensePlanSchema);
export default ExpensePlan;
