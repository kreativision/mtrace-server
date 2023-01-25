import { model, Schema } from "mongoose";
import { IUser } from "../types/user";

const userSchema = new Schema<IUser>(
  {
    name: { type: "string", required: true, trim: true },
    email: { type: "string", required: true, trim: true, unique: true },
    password: { type: "string", required: true },
    securityQuestion: {
      type: {
        question: { type: "string", required: true, trim: true },
        answer: { type: "string", required: true, trim: true },
      },
      required: true,
    },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;
