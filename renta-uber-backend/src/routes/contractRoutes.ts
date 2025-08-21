import express from 'express';
import {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
  calculatePenalty,
  downloadContract
} from '../controllers/contractController';
import { authenticateToken } from '../middlewares/auth';
import { validateContract } from '../utils/validation';
import { z } from 'zod';
import { zodValidate } from '../middlewares/zodValidate';

const router = express.Router();

const idParamSchema = z.object({ params: z.object({ id: z.string().min(1) }) });
const contractBodyBase = z.object({
  driverId: z.string().min(1),
  vehicleId: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  type: z.enum(['DAILY','MONTHLY','CUSTOM']).optional(),
  basePrice: z.number().optional(),
  dailyPrice: z.number().optional(),
  monthlyPrice: z.number().optional(),
  deposit: z.number().optional(),
  penaltyRate: z.number().optional(),
  allowedDelayDays: z.number().int().optional(),
  automaticRenewal: z.boolean().optional(),
  terms: z.string().optional(),
  notes: z.string().optional(),
});
const contractCreateSchema = z.object({ body: contractBodyBase });
const contractUpdateSchema = z.object({ body: contractBodyBase.partial() });

router.get('/', getAllContracts);
router.get('/:id', zodValidate(idParamSchema), getContractById);
router.post('/', authenticateToken, zodValidate(contractCreateSchema), createContract);
router.put('/:id', authenticateToken, zodValidate(idParamSchema), zodValidate(contractUpdateSchema), updateContract);
router.delete('/:id', authenticateToken, zodValidate(idParamSchema), deleteContract);
router.post('/:id/calculate-penalty', (req, res, next) => next(), calculatePenalty);
router.get('/:id/download', downloadContract);

export default router;