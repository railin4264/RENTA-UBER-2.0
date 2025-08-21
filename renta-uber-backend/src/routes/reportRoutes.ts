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
import { z } from 'zod';
import { zodValidate } from '../middlewares/zodValidate';

const router = express.Router();

const idParamSchema = z.object({ params: z.object({ id: z.string().min(1) }) });
const driverParamSchema = z.object({ params: z.object({ driverId: z.string().min(1) }) });
const vehicleParamSchema = z.object({ params: z.object({ vehicleId: z.string().min(1) }) });
const reportBodySchema = z.object({ body: z.object({ title: z.string().min(1), description: z.string().optional(), data: z.any() }) });

// Rutas públicas (sin autenticación)
router.get('/', getAllReports);
router.get('/dashboard', generateDashboardReport);
router.get('/financial', generateFinancialReport);
router.get('/maintenance', generateMaintenanceReport);
router.get('/payment', generatePaymentReport);

// Rutas protegidas (requieren autenticación)
router.get('/:id', zodValidate(idParamSchema), getReportById);
router.post('/', authenticateToken, zodValidate(reportBodySchema), createReport);
router.delete('/:id', authenticateToken, zodValidate(idParamSchema), deleteReport);
router.get('/driver/:driverId', authenticateToken, zodValidate(driverParamSchema), generateDriverReport);
router.get('/vehicle/:vehicleId', authenticateToken, zodValidate(vehicleParamSchema), generateVehicleReport);

export default router;