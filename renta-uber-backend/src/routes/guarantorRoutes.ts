import { Router } from 'express';
import * as guarantorController from '../controllers/guarantorController';
import { authenticateToken } from '../middlewares/auth';
import { z } from 'zod';
import { zodValidate } from '../middlewares/zodValidate';

const router = Router();

const idParamSchema = z.object({ params: z.object({ id: z.string().min(1) }) });
const guarantorBodyBase = z.object({
  driverId: z.string().min(1),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  cedula: z.string().min(5),
  address: z.string().min(3),
  phone: z.string().min(5),
});
const guarantorCreateSchema = z.object({ body: guarantorBodyBase });
const guarantorUpdateSchema = z.object({ body: guarantorBodyBase.partial() });

router.post('/', authenticateToken, zodValidate(guarantorCreateSchema), guarantorController.createGuarantor);
router.get('/', authenticateToken, guarantorController.getGuarantors);
router.get('/:id', authenticateToken, zodValidate(idParamSchema), guarantorController.getGuarantorById);
router.put('/:id', authenticateToken, zodValidate(idParamSchema), zodValidate(guarantorUpdateSchema), guarantorController.updateGuarantor);
router.delete('/:id', authenticateToken, zodValidate(idParamSchema), guarantorController.deleteGuarantor);

export default router;