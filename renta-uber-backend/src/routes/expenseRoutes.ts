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

const router = express.Router();

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
router.get('/:id', getExpenseById);
router.post('/', authenticateToken, validateExpense, createExpense);
router.put('/:id', authenticateToken, validateExpense, updateExpense);
router.delete('/:id', authenticateToken, deleteExpense);

export default router;