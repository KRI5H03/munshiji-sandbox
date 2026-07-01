import type { Request, Response } from "express";
import { db } from "../db/connection.js";
import { expenses, type NewExpenses } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const userExpenses = await db
      .select()
      .from(expenses)
      .where(eq(expenses.userId, userId));

    return res
      .status(200)
      .json({ message: "Expenses retrieved successfully", userExpenses });
  } catch (e) {
    console.error("Fetch expenses error", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createExpense = async (
  req: Request<any, any, NewExpenses>,
  res: Response,
) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized Access" });
    }

    const { name, category, amount } = req.body;

    const [newExpenses] = await db
      .insert(expenses)
      .values({
        name: name,
        category: category,
        amount: amount,
        userId: userId,
      })
      .returning();

    return res
      .status(200)
      .json({ message: "Expense created successfully", expense: newExpenses });
  } catch (e) {
    console.error("Error creating a new expense", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateExpense = async (
  req: AuthenticatedRequest &
    Request<{ id: string }, any, Partial<NewExpenses>>,
  res: Response,
) => {
  try {
    const userId = req.user.id;

    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorised Access" });
    }

    const [updatedExpense] = await db
      .update(expenses)
      .set(req.body)
      .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))
      .returning();

    if (!updatedExpense) {
      return res
        .status(404)
        .json({ message: "Expense not found or Unauthorised" });
    }

    return res.status(200).json({
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (e) {
    console.error("Expense update failed", e);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const deleteExpense = async (
  req: AuthenticatedRequest & Request<{ id: string }>,
  res: Response,
) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorised access" });
    }

    const [deletedExpense] = await db
      .delete(expenses)
      .where(and(eq(expenses.userId, userId), eq(expenses.id, id)))
      .returning();

    if (!deletedExpense) {
      return res
        .status(404)
        .json({ message: "Expense not found or Unauthorised" });
    }

    return res.status(200).json({
      message: "Expense was deleted successfully",
      deletedExpense: deletedExpense,
    });
  } catch (e) {
    console.error("Error is deleting expense", e);
    return res.status(500).json({ message: "Internal Server error" });
  }
};
