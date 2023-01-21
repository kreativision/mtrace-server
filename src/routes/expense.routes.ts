import { Router } from "express";
import { getAllExpense } from "../controllers/expense.controller";
import authenticate from "../middlewares/auth.middleware";

const expenseRoutes = Router();

expenseRoutes.get("/", authenticate, getAllExpense);
// TODO add other endpoints for expense CRUD operations

export default expenseRoutes;
