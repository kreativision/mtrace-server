import { Types } from "mongoose";

export type IExpensePlan = {
  name: String;
  description: String;
  user: Types.ObjectId;
  open: Boolean;
};
