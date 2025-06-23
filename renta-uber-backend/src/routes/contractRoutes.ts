import express from 'express';
import {
  createContract,
  getContracts,
  getContractById,
  updateContract,
  deleteContract
} from '../controllers/contractController';

const router = express.Router();

router.post('/', createContract);
router.get('/', getContracts);
router.get('/:id', getContractById);
router.put('/:id', updateContract);
router.delete('/:id', deleteContract);

export default router;