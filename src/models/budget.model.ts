import mongoose, { model, Schema } from "mongoose";
import { IBudget } from "../types/budget";
import User from "./user.model";

const budgetSchema = new Schema<IBudget>({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: User },
  categories: {
    type: [
      {
        title: { type: "string", required: true, trim: true },
        amount: { type: "number", required: true, default: 0 },
        color: { type: "string", required: true },
        managed: { type: "boolean", required: true, default: true },
        editable: { type: "boolean", required: true, default: true },
        description: { type: "string", maxlength: 120 },
      },
    ],
    required: true,
    maxlength: [12, "Cannot have more than 12 categories"],
    minlength: [1, "Need at least 1 cateogry"],
  },
  month: {
    type: Number,
    required: [true, "Please add month"],
    min: 1,
    max: 12,
  },
  year: { type: Number, required: [true, "Please add the year"] },
});

const Budget = model("Budget", budgetSchema);

export default Budget;
