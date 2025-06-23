import { Router } from 'express';
import * as reportController from '../controllers/reportController';

const router = Router();

router.get('/', reportController.getReports);
router.get('/:id', reportController.getReportById);
router.post('/', reportController.createReport);
router.put('/:id', reportController.updateReport);
router.delete('/:id', reportController.deleteReport);

export default router;