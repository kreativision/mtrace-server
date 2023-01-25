import { model, Schema, Types } from "mongoose";
import { IBudget } from "../types/budget";

const budgetSchema = new Schema<IBudget>({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  categories: {
    type: [{ type: Schema.Types.ObjectId, ref: "Category", required: true }],
    validate: [
      (val: Array<Types.ObjectId>) => val.length > 0 && val.length <= 12,
      "Only 1 to 12 categories are allowed",
    ],
  },
  month: {
    type: Number,
    required: [true, "Please add month"],
    min: 0,
    max: 11,
  },
  year: { type: Number, required: [true, "Please add the year"] },
});

const Budget = model("Budget", budgetSchema);

export default Budget;
