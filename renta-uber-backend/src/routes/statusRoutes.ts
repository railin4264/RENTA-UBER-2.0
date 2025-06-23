import { Router } from 'express';
import { getStatusesByModule } from '../controllers/statusController';

const router = Router();

router.get('/:module', getStatusesByModule);

export default router;