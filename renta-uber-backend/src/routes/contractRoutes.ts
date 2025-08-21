import express from 'express';
import {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
  getContractsByDriver,
  getContractsByVehicle,
  getContractsByStatus,
  getActiveContracts,
  getExpiringContracts,
  getContractStats,
  searchContracts
  , calculatePenalty, downloadContract
} from '../controllers/contractController';
import { authenticateToken } from '../middlewares/auth';
import { validateContract } from '../utils/validation';

const router = express.Router();

// Rutas públicas (sin autenticación)
router.get('/', getAllContracts);
router.get('/stats', getContractStats);
router.get('/search', searchContracts);
router.get('/active', getActiveContracts);
router.get('/expiring', getExpiringContracts);
router.get('/driver/:driverId', getContractsByDriver);
router.get('/vehicle/:vehicleId', getContractsByVehicle);
router.get('/status/:statusId', getContractsByStatus);
router.post('/:id/calculate-penalty', calculatePenalty);
router.get('/:id/download', downloadContract);

// Rutas protegidas (requieren autenticación)
router.get('/:id', getContractById);
router.post('/', authenticateToken, validateContract, createContract);
router.put('/:id', authenticateToken, validateContract, updateContract);
router.delete('/:id', authenticateToken, deleteContract);

export default router;