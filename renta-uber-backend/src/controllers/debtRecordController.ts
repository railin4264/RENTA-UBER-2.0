import { Request, Response } from 'express';
import * as debtRecordService from '../services/debtRecordService';

export const createDebtRecord = async (req: Request, res: Response) => {
  try {
    const newDebt = await debtRecordService.createDebtRecord(req.body);
    res.status(201).json(newDebt);
  } catch (error) {
    res.status(400).json({ message: 'Error creating debt record', error });
  }
};

export const getDebtRecords = async (_req: Request, res: Response) => {
  try {
    const debts = await debtRecordService.getDebtRecords();
    res.json(debts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching debt records', error });
  }
};

export const getDebtRecordById = async (req: Request, res: Response) => {
  try {
    const debt = await debtRecordService.getDebtRecordById(req.params.id);
    if (debt) {
      res.json(debt);
    } else {
      res.status(404).json({ message: 'Debt record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching debt record', error });
  }
};

export const updateDebtRecord = async (req: Request, res: Response) => {
  try {
    const updated = await debtRecordService.updateDebtRecord(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating debt record', error });
  }
};

export const deleteDebtRecord = async (req: Request, res: Response) => {
  try {
    await debtRecordService.deleteDebtRecord(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: 'Error deleting debt record', error });
  }
};