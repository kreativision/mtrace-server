import { defaultBudget } from "@constants/app.constants";
import { IUser } from "@mt-types/user";
import { model, Schema } from "mongoose";

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
      default: defaultBudget,
      max: [12, "Cannot have more than 12 categories"],
      min: [1, "Need at least 1 cateogry"],
    },
    defaultBudgetModified: { type: "boolean", required: true, default: false },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;
