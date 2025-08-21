import { Request, Response } from 'express';
import * as expenseService from '../services/expenseService';
import { asyncHandler } from '../utils/errorHandler';

// Obtener todos los gastos
export const getAllExpenses = asyncHandler(async (req: Request, res: Response) => {
  const expenses = await expenseService.getAllExpenses();
  
  res.json({
    success: true,
    data: expenses,
    count: expenses.length
  });
});

// Obtener gasto por ID
export const getExpenseById = asyncHandler(async (req: Request, res: Response) => {
  const expense = await expenseService.getExpenseById(req.params.id);
  
  if (!expense) {
    return res.status(404).json({
      success: false,
      message: 'Gasto no encontrado'
    });
  }
  
  res.json({
    success: true,
    data: expense
  });
});

// Crear nuevo gasto
export const createExpense = asyncHandler(async (req: Request, res: Response) => {
  const { vehicleId, category, amount, date } = req.body;
  
  if (!vehicleId || !category || !amount || !date) {
    return res.status(400).json({
      success: false,
      message: 'Vehículo, categoría, monto y fecha son requeridos'
    });
  }
  
  const newExpense = await expenseService.createExpense(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Gasto creado exitosamente',
    data: newExpense
  });
});

// Actualizar gasto
export const updateExpense = asyncHandler(async (req: Request, res: Response) => {
  const updated = await expenseService.updateExpense(req.params.id, req.body);
  
  res.json({
    success: true,
    message: 'Gasto actualizado exitosamente',
    data: updated
  });
});

// Eliminar gasto
export const deleteExpense = asyncHandler(async (req: Request, res: Response) => {
  await expenseService.deleteExpense(req.params.id);
  
  res.json({
    success: true,
    message: 'Gasto eliminado exitosamente'
  });
});

// Obtener gastos por vehículo
export const getExpensesByVehicle = asyncHandler(async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  
  const expenses = await expenseService.getExpensesByVehicle(vehicleId);
  
  res.json({
    success: true,
    data: expenses,
    count: expenses.length
  });
});

// Obtener gastos por categoría
export const getExpensesByCategory = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.params;
  
  const expenses = await expenseService.getExpensesByCategory(category);
  
  res.json({
    success: true,
    data: expenses,
    count: expenses.length
  });
});

// Obtener gastos por estado
export const getExpensesByStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.params;
  
  const expenses = await expenseService.getExpensesByStatus(status);
  
  res.json({
    success: true,
    data: expenses,
    count: expenses.length
  });
});

// Obtener gastos por rango de fechas
export const getExpensesByDateRange = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'Fecha de inicio y fin son requeridas'
    });
  }
  
  const expenses = await expenseService.getExpensesByDateRange(
    startDate as string,
    endDate as string
  );
  
  res.json({
    success: true,
    data: expenses,
    count: expenses.length
  });
});

// Obtener estadísticas de gastos
export const getExpenseStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await expenseService.getExpenseStats();
  
  res.json({
    success: true,
    data: stats
  });
});

// Obtener gastos mensuales
export const getMonthlyExpenses = asyncHandler(async (req: Request, res: Response) => {
  const { year, month } = req.params;
  
  const startDate = `${year}-${month.padStart(2, '0')}-01`;
  const endDate = `${year}-${month.padStart(2, '0')}-31`;
  
  const expenses = await expenseService.getExpensesByDateRange(startDate, endDate);
  
  res.json({
    success: true,
    data: expenses,
    count: expenses.length
  });
});

// Buscar gastos
export const searchExpenses = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.query;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Query de búsqueda requerida'
    });
  }
  
  const expenses = await expenseService.searchExpenses(query);
  
  res.json({
    success: true,
    data: expenses,
    count: expenses.length
  });
});

// Obtener gastos por proveedor
export const getExpensesByVendor = asyncHandler(async (req: Request, res: Response) => {
  const { vendor } = req.params;
  
  const expenses = await expenseService.searchExpenses(vendor);
  
  res.json({
    success: true,
    data: expenses,
    count: expenses.length
  });
});