import express from 'express';
import {
  getAllReports,
  getReportById,
  createReport,
  deleteReport,
  generateFinancialReport,
  generateDriverReport,
  generateVehicleReport,
  generateMaintenanceReport,
  generatePaymentReport,
  generateDashboardReport
} from '../controllers/reportController';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

// Rutas públicas (sin autenticación)
router.get('/', getAllReports);
router.get('/dashboard', generateDashboardReport);
router.get('/financial', generateFinancialReport);
router.get('/maintenance', generateMaintenanceReport);
router.get('/payment', generatePaymentReport);

// Rutas protegidas (requieren autenticación)
router.get('/:id', getReportById);
router.post('/', authenticateToken, createReport);
router.delete('/:id', authenticateToken, deleteReport);
router.get('/driver/:driverId', authenticateToken, generateDriverReport);
router.get('/vehicle/:vehicleId', authenticateToken, generateVehicleReport);

export default router;