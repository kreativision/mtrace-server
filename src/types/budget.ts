import { Types } from "mongoose";
import { ICategory } from "./category";

export type IBudget = {
  user: Types.ObjectId;
  month: Number;
  year: Number;
  categories?: Array<ICategory>;
};
