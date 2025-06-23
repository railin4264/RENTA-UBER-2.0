import { Router } from 'express';
import * as guarantorController from '../controllers/guarantorController';

const router = Router();

router.post('/', guarantorController.createGuarantor);
router.get('/', guarantorController.getGuarantors);
router.get('/:id', guarantorController.getGuarantorById);
router.put('/:id', guarantorController.updateGuarantor);
router.delete('/:id', guarantorController.deleteGuarantor);

export default router;