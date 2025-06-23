import { Request, Response } from 'express';
import * as driverService from '../services/driverService';

export const getAllDrivers = async (_req: Request, res: Response) => {
  try {
    const drivers = await driverService.getAllDrivers();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getDriverById = async (req: Request, res: Response) => {
  try {
    const driver = await driverService.getDriverById(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createDriver = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, license, phone } = req.body;
    if (!firstName || !lastName || !license || !phone) {
      return res.status(400).json({ message: 'All fields are required: firstName, lastName, license, phone' });
    }
    const newDriver = await driverService.createDriver(req.body);
    res.status(201).json(newDriver);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const updateDriver = async (req: Request, res: Response) => {
  try {
    const updated = await driverService.updateDriver(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Driver not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteDriver = async (req: Request, res: Response) => {
  try {
    const deleted = await driverService.deleteDriver(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Driver not found' });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  } 
};