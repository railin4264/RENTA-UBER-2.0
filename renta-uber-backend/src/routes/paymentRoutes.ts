import express from 'express';
import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentsByDriver,
  getPaymentsByContract,
  getPaymentsByStatus,
  getPaymentsByType,
  getPaymentStats,
  getMonthlyPayments,
  searchPayments
} from '../controllers/paymentController';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

// Rutas públicas (sin autenticación)
router.get('/', getAllPayments);
router.get('/stats', getPaymentStats);
router.get('/search', searchPayments);
router.get('/driver/:driverId', getPaymentsByDriver);
router.get('/contract/:contractId', getPaymentsByContract);
router.get('/status/:status', getPaymentsByStatus);
router.get('/type/:type', getPaymentsByType);
router.get('/monthly/:year/:month', getMonthlyPayments);

// Rutas protegidas (requieren autenticación)
router.get('/:id', getPaymentById);
router.post('/', authenticateToken, createPayment);
router.put('/:id', authenticateToken, updatePayment);
router.delete('/:id', authenticateToken, deletePayment);

export default router;