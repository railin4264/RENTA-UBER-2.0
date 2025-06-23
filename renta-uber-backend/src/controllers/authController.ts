import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const registerUser = async (req: Request, res: Response) => {
  console.log('Body recibido:', req.body);
  const user = await authService.registerUser(req.body);
  res.status(201).json(user);
};

export const loginUser = async (req: Request, res: Response) => {
  console.log('Body recibido:', req.body);
  const result = await authService.loginUser(req.body.email, req.body.password);
  res.json(result);
};