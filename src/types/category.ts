import { Types } from "mongoose";

export type ICategory = {
  _id?: Types.ObjectId;
  title: string;
  amount: number;
  color: string;
  managed: boolean;
  description?: string;
};
