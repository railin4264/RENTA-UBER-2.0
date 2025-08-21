import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as guarantorService from '../services/guarantorService';

const prisma = new PrismaClient();

export const createGuarantor = async (req: Request, res: Response) => {
  try {
    const { driverId, firstName, lastName, cedula, address, workplace, phone } = req.body;
    if (!driverId || !firstName || !lastName || !cedula || !address || !workplace || !phone) {
      return res.status(400).json({ message: 'driverId, firstName, lastName, cedula, address, workplace, and phone are required' });
    }
    
    // Verificar que el driver exista
    const driver = await prisma.driver.findUnique({ where: { id: driverId } });
    if (!driver) {
      return res.status(400).json({ message: 'Invalid driverId' });
    }
    
    const newGuarantor = await guarantorService.createGuarantor(req.body);
    res.status(201).json(newGuarantor);
  } catch (error) {
    res.status(400).json({ message: 'Error creating guarantor', error });
  }
};

export const getGuarantors = async (_req: Request, res: Response) => {
  try {
    const guarantors = await guarantorService.getGuarantors();
    res.json(guarantors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching guarantors', error });
  }
};

export const getGuarantorById = async (req: Request, res: Response) => {
  try {
    const guarantor = await guarantorService.getGuarantorById(req.params.id);
    if (guarantor) {
      res.json(guarantor);
    } else {
      res.status(404).json({ message: 'Guarantor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching guarantor', error });
  }
};

export const updateGuarantor = async (req: Request, res: Response) => {
  try {
    console.log('Body recibido:', req.body);
    const updated = await guarantorService.updateGuarantor(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating guarantor', error });
  }
};

export const deleteGuarantor = async (req: Request, res: Response) => {
  try {
    await guarantorService.deleteGuarantor(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: 'Error deleting guarantor', error });
  }
};