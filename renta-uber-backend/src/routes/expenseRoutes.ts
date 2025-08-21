import express from 'express';
import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpensesByVehicle,
  getExpensesByCategory,
  getExpensesByStatus,
  getExpensesByDateRange,
  getExpenseStats,
  getMonthlyExpenses,
  searchExpenses,
  getExpensesByVendor
} from '../controllers/expenseController';
import { authenticateToken } from '../middlewares/auth';
import { validateExpense } from '../utils/validation';
import { z } from 'zod';
import { zodValidate } from '../middlewares/zodValidate';

const router = express.Router();

const idParamSchema = z.object({ params: z.object({ id: z.string().min(1) }) });
const expenseBodySchema = z.object({
  body: z.object({
    amount: z.number().nonnegative(),
    vehicleId: z.string().min(1),
    date: z.string().min(1),
    category: z.string().optional(),
    description: z.string().optional(),
  })
});

// Rutas públicas (sin autenticación)
router.get('/', getAllExpenses);
router.get('/stats', getExpenseStats);
router.get('/search', searchExpenses);
router.get('/vehicle/:vehicleId', getExpensesByVehicle);
router.get('/category/:category', getExpensesByCategory);
router.get('/status/:status', getExpensesByStatus);
router.get('/vendor/:vendor', getExpensesByVendor);
router.get('/date-range', getExpensesByDateRange);
router.get('/monthly/:year/:month', getMonthlyExpenses);

// Rutas protegidas (requieren autenticación)
router.get('/:id', zodValidate(idParamSchema), getExpenseById);
router.post('/', authenticateToken, zodValidate(expenseBodySchema), createExpense);
router.put('/:id', authenticateToken, zodValidate(idParamSchema), zodValidate(expenseBodySchema.partial()), updateExpense);
router.delete('/:id', authenticateToken, zodValidate(idParamSchema), deleteExpense);

export default router;