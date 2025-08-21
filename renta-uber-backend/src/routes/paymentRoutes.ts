import express from 'express';
import { 
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment
} from '../controllers/paymentController';
import { authenticateToken } from '../middlewares/auth';
import { validatePayment } from '../utils/validation';
import { z } from 'zod';
import { zodValidate } from '../middlewares/zodValidate';

const router = express.Router();

const idParamSchema = z.object({ params: z.object({ id: z.string().min(1) }) });
const paymentBodySchema = z.object({
  body: z.object({
    amount: z.number().nonnegative(),
    driverId: z.string().min(1),
    date: z.string().min(1),
  })
});

// Rutas públicas
router.get('/', getAllPayments);

// Rutas protegidas
router.get('/:id', zodValidate(idParamSchema), getPaymentById);
router.post('/', authenticateToken, zodValidate(paymentBodySchema), createPayment);
router.put('/:id', authenticateToken, zodValidate(idParamSchema), zodValidate(paymentBodySchema.partial()), updatePayment);
router.delete('/:id', authenticateToken, zodValidate(idParamSchema), deletePayment);

export default router;