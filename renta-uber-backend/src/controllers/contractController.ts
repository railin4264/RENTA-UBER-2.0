import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  createContract as createContractService,
  getContracts as getContractsService,
  getContractById as getContractByIdService,
  updateContract as updateContractService,
  deleteContract as deleteContractService
} from '../services/contractService';

const prisma = new PrismaClient();
export const createContract = async (req: Request, res: Response) => {
  try {
    const { driverId, vehicleId, startDate, statusId, type } = req.body;
    if (!driverId || !vehicleId || !startDate || !statusId || !type) {
      return res.status(400).json({ message: 'Todos los campos requeridos' });
    }
    // Validar que los IDs existan
    const driver = await prisma.driver.findUnique({ where: { id: driverId } });
    if (!driver) return res.status(400).json({ message: 'driverId inválido' });
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) return res.status(400).json({ message: 'vehicleId inválido' });
    const status = await prisma.status.findUnique({ where: { id: statusId } });
    if (!status) return res.status(400).json({ message: 'statusId inválido' });

    const contractData = req.body;
    const newContract = await createContractService(contractData);
    res.status(201).json(newContract);
  } catch (error) {
    console.error('Error creating contract:', error); // <--- Agrega este log
    res.status(500).json({ message: 'Error creating contract', error });
  }
};

export const getContracts = async (_req: Request, res: Response) => {
  try {
    const contracts = await getContractsService();
    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contracts', error });
  }
};

export const getContractById = async (req: Request, res: Response) => {
  try {
    const contractId = req.params.id;
    const contract = await getContractByIdService(contractId);
    if (contract) {
      res.status(200).json(contract);
    } else {
      res.status(404).json({ message: 'Contract not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contract', error });
  }
};

export const updateContract = async (req: Request, res: Response) => {
  try {
    const contractId = req.params.id;
    const contractData = req.body;
    const updatedContract = await updateContractService(contractId, contractData);
    res.json(updatedContract);
  } catch (error) {
    res.status(500).json({ message: 'Error updating contract', error });
  }
};

export const deleteContract = async (req: Request, res: Response) => {
  try {
    const contractId = req.params.id;
    const result = await deleteContractService(contractId);
    if (result) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Contract not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contract', error });
  }
};