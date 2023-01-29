import { Router } from "express";
import {
  createExpense,
  getMonthSummary,
  updateExpense,
} from "../controllers/expense.controller";
import authenticate from "../middlewares/auth.middleware";

const expenseRoutes = Router();

expenseRoutes.get("/summary", authenticate, getMonthSummary);

expenseRoutes
  .route("/")
  .post(authenticate, createExpense)
  .put(authenticate, updateExpense);

export default expenseRoutes;
