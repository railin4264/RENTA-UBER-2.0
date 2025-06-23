import { Request, Response } from 'express';
import {
  createExpense as createExpenseService,
  getAllExpenses as getExpensesService,
  getExpenseById as getExpenseByIdService,
  updateExpense as updateExpenseService,
  deleteExpense as deleteExpenseService
} from '../services/expenseService';

export const createExpense = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (data.amount === undefined || data.amount === null || !data.date || !data.vehicleId) {
      return res.status(400).json({ message: 'amount, date, and vehicleId are required' });
    }
    const newExpense = await createExpenseService(data);
    res.status(201).json(newExpense);
  } catch (error: any) {
    res.status(400).json({ message: 'Error creating expense', error: error.message });
  }
};

export const getExpenses = async (_req: Request, res: Response) => {
  try {
    const expenses = await getExpensesService();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving expenses', error });
  }
};

export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const expenseId = req.params.id;
    const expense = await getExpenseByIdService(expenseId);
    if (expense) {
      res.status(200).json(expense);
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving expense', error });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const expenseId = req.params.id;
    const data = req.body;
    if (data.amount === undefined || data.amount === null || !data.date || !data.vehicleId) {
      return res.status(400).json({ message: 'amount, date, and vehicleId are required' });
    }
    const updatedExpense = await updateExpenseService(expenseId, data);
    if (updatedExpense) {
      res.status(200).json(updatedExpense);
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating expense', error });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const expenseId = req.params.id;
    const result = await deleteExpenseService(expenseId);
    if (result) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error deleting expense', error });
  }
};