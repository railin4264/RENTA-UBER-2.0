import { Router } from 'express';
import * as debtRecordController from '../controllers/debtRecordController';

const router = Router();

router.post('/', debtRecordController.createDebtRecord);
router.get('/', debtRecordController.getDebtRecords);
router.get('/:id', debtRecordController.getDebtRecordById);
router.put('/:id', debtRecordController.updateDebtRecord);
router.delete('/:id', debtRecordController.deleteDebtRecord);

export default router;