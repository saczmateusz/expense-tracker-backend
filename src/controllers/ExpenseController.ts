import { Response } from "express";
import ExpenseModel, { IExpense } from "../models/expense";
import CustomRequest from "../interfaces/customRequest";

export const createExpense = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const expense: IExpense = new ExpenseModel({
      description: req.body.description,
      value: req.body.value,
      currency: req.body.currency,
      category: req.body.category, // TODO: categoryId?
      dateCreated: new Date(Date.now()),
      userId: req.user?._id,
    });

    const savedExpense = await expense.save();

    res.status(201).send({
      message: "Expense created successfully.",
      expense: savedExpense,
    });
  } catch (error: any) {
    console.error("Error creating expense:", error);
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the expense.",
    });
  }
};

export const updateExpense = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { user: currentUser } = req;
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (!id) {
      res.status(400).send({ message: "Invalid or missing expense ID." });
      return;
    }

    const expense: IExpense | null = await ExpenseModel.findById(req.params.id);
    if (!expense) {
      res.status(404).send({ message: "Expense not found." });
      return;
    }

    if (expense?.userId === currentUser?._id || currentUser?.role === "Admin") {
      const updatedExpense = await ExpenseModel.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true, // Returns the updated document
          runValidators: true, // Ensures validation rules in the schema are applied
        }
      );

      if (!updatedExpense) {
        res.status(404).send({ message: "Expense not found." });
        return;
      }

      res.status(200).send({
        message: "Expense updated successfully.",
        data: updatedExpense,
      });
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  } catch (error: any) {
    console.error("Error updating expense:", error);
    res
      .status(500)
      .send({ message: error.message || "An unexpected error occurred." });
  }
};

export const deleteExpense = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { user: currentUser } = req;
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).send({ message: "Invalid or missing expense ID." });
      return;
    }
    const expense: IExpense | null = await ExpenseModel.findById(req.params.id);

    if (!expense) {
      res.status(404).send({ message: "Expense not found." });
      return;
    }

    if (expense?.userId === currentUser?._id || currentUser?.role === "Admin") {
      await expense?.deleteOne();
      res.status(200).send({ message: "Expense deleted successfully." });
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  } catch (error: any) {
    res
      .status(500)
      .send({ message: error.message || "An unexpected error occurred." });
  }
};

export const getExpenses = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { user: currentUser } = req;
  try {
    const expenses: IExpense[] = await ExpenseModel.find({
      userId: currentUser?._id,
    });
    if (expenses.length === 0) {
      res.status(204).send();
    } else {
      res.status(200).json(expenses); // TODO: map category from id to object
    }
  } catch (error: any) {
    console.error("Error retrieving expenses:", error);
    res.status(500).json({
      message: error.message || "An error occurred while retrieving expenses.",
    });
  }
};

export const getExpenseById = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { user: currentUser } = req;
  try {
    const expense: IExpense | null = await ExpenseModel.findById(req.params.id);

    if (!expense) {
      res
        .status(404)
        .json({ message: `Expense with ID ${req.params.id} not found.` });
      return;
    }

    if (expense?.userId === currentUser?._id || currentUser?.role === "Admin") {
      res.status(200).json(expense);
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  } catch (error: any) {
    console.error("Error retrieving expense:", error);
    res.status(500).json({
      message:
        error.message || "An error occurred while retrieving the expense.",
    });
  }
};
