import { Types } from "mongoose";
import { ICategory } from "./category";

export type IUser = {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  defaultBudget?: Array<ICategory>;
  defaultBudgetModified?: boolean;
  securityQuestion: {
    question: string;
    answer: string;
  };
};
