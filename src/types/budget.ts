import { Types } from "mongoose";
import { ICategory } from "./category";

export type IBudget = {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  month: Number;
  year: Number;
  categories?: Array<ICategory>;
};
