import { Router } from "express";
import {
  createExpense,
  deleteExpense,
  getExpenseById,
  getExpenses,
  updateExpense,
} from "../controllers/ExpenseController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createExpense);
router.patch("/:id", authMiddleware, updateExpense);
router.delete("/:id", authMiddleware, deleteExpense);
router.get("/", authMiddleware, getExpenses);
router.get("/:id", authMiddleware, getExpenseById);

export default router;
