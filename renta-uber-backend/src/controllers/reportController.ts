import { Request, Response } from 'express';
import * as reportService from '../services/reportService';

export const getReports = async (_req: Request, res: Response) => {
  const reports = await reportService.getReports();
  res.json(reports);
};

export const getReportById = async (req: Request, res: Response) => {
  const report = await reportService.getReportById(req.params.id);
  if (!report) return res.status(404).json({ message: 'Report not found' });
  res.json(report);
};

export const createReport = async (req: Request, res: Response) => {
  console.log('Body recibido:', req.body);
  const newReport = await reportService.createReport(req.body);
  res.status(201).json(newReport);
};

export const updateReport = async (req: Request, res: Response) => {
  console.log('Body recibido:', req.body);
  const updated = await reportService.updateReport(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'Report not found' });
  res.json(updated);
};

export const deleteReport = async (req: Request, res: Response) => {
  const deleted = await reportService.deleteReport(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Report not found' });
  res.status(204).send();
};