import { model, Schema } from "mongoose";
import { defaultBudget } from "../constants/app.constants";
import { IUser } from "../types/user";

const userSchema = new Schema<IUser>(
  {
    name: { type: "string", required: true, trim: true },
    email: { type: "string", required: true, trim: true, unique: true },
    password: { type: "string", required: true },
    defaultBudget: {
      type: [
        {
          title: { type: "string", required: true, trim: true },
          amount: { type: "number", required: true, default: 0 },
          color: { type: "string", required: true },
          unmanaged: { type: "boolean", required: true, default: false },
          description: { type: "string", maxlength: 120 },
        },
      ],
      required: true,
      default: defaultBudget,
      max: [12, "Cannot have more than 12 categories"],
      min: [1, "Need at least 1 cateogry"],
    },
    securityQuestion: {
      type: {
        question: { type: "string", required: true, trim: true },
        answer: { type: "string", required: true, trim: true },
      },
      required: true,
    },
    defaultBudgetModified: { type: "boolean", required: true, default: false },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;
