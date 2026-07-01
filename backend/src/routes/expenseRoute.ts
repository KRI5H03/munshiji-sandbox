import { Router, type Request } from "express";
import {
  protectRoute,
  type AuthenticatedRequest,
} from "../middleware/authMiddleware.js";
import {
  getExpenses,
  updateExpense,
  createExpense,
  deleteExpense,
} from "../controllers/expenseController.js";

const router = Router();

router.get("/", protectRoute, getExpenses);

router.post("/", protectRoute, createExpense);

router.put("/:id", protectRoute, (req, res) =>
  updateExpense(req as AuthenticatedRequest & Request<{ id: string }>, res),
);

router.delete("/:id", protectRoute, (req, res) =>
  deleteExpense(req as AuthenticatedRequest & Request<{ id: string }>, res),
);

export default router;
