import { Router } from "express";
import { createBudget } from "../controllers/budget.controller";
import authenticate from "../middlewares/auth.middleware";

const budgetRoutes = Router();
budgetRoutes.post("/", authenticate, createBudget);

export default budgetRoutes;
