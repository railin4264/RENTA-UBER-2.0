import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.model || !data.plate || !data.statusId) {
      return res.status(400).json({ message: 'Model, plate and statusId are required' });
    }
    // Verifica que el status exista
    const status = await prisma.status.findUnique({ where: { id: data.statusId } });
    if (!status) {
      return res.status(400).json({ message: 'Invalid statusId' });
    }
    const vehicle = await prisma.vehicle.create({ data });
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getVehicles = async (_req: Request, res: Response) => {
  try {
    const vehicles = await prisma.vehicle.findMany({ include: { status: true } });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: req.params.id },
      include: { status: true }
    });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.model || !data.plate) {
      return res.status(400).json({ message: 'Both model and plate are required' });
    }
    const vehicle = await prisma.vehicle.update({
      where: { id: req.params.id },
      data
    });
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    await prisma.vehicle.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: (error as Error).message }); 
  }
};