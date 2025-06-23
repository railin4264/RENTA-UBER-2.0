import { Request, Response } from 'express';
import {
  createPayment as createPaymentService,
  getPayments as getPaymentsService,
  getPaymentById as getPaymentByIdService,
  updatePayment as updatePaymentService,
  deletePayment as deletePaymentService
} from '../services/paymentService';

export const createPayment = async (req: Request, res: Response) => {
  try {
    const paymentData = req.body;
    const newPayment = await createPaymentService(paymentData);
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment', error });
  }
};

export const getPayments = async (_req: Request, res: Response) => {
  try {
    const payments = await getPaymentsService();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error });
  }
};

export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const paymentId = req.params.id;
    const payment = await getPaymentByIdService(paymentId);
    if (payment) {
      res.status(200).json(payment);
    } else {
      res.status(404).json({ message: 'Payment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment', error });
  }
};

export const updatePayment = async (req: Request, res: Response) => {
  try {
    const paymentId = req.params.id;
    const paymentData = req.body;
    const updatedPayment = await updatePaymentService(paymentId, paymentData);
    if (updatedPayment) {
      res.status(200).json(updatedPayment);
    } else {
      res.status(404).json({ message: 'Payment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment', error });
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  try {
    const paymentId = req.params.id;
    const deletedPayment = await deletePaymentService(paymentId);
    if (deletedPayment) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Payment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting payment', error });
  }
};