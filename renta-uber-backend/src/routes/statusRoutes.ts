import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { zodValidate } from '../middlewares/zodValidate';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();
const prisma = new PrismaClient();

const idParamSchema = z.object({ params: z.object({ id: z.string().min(1) }) });
const moduleParamSchema = z.object({ params: z.object({ module: z.string().min(1) }) });
const statusBodyBase = z.object({ name: z.string().min(1), module: z.string().min(1), color: z.string().optional() });
const statusCreateSchema = z.object({ body: statusBodyBase });
const statusUpdateSchema = z.object({ body: statusBodyBase.partial() });

// GET /api/statuses - Obtener todos los estados
router.get('/', async (req, res) => {
  try {
    const statuses = await prisma.status.findMany({
      orderBy: { module: 'asc', name: 'asc' }
    });

    res.json(statuses);
  } catch (error) {
    console.error('Error fetching statuses:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/statuses/:module - Obtener estados por módulo
router.get('/:module', zodValidate(moduleParamSchema), async (req, res) => {
  try {
    const { module } = req.params as any;
    const statuses = await prisma.status.findMany({ where: { module }, orderBy: { name: 'asc' } });
    res.json(statuses);
  } catch (error) {
    console.error('Error fetching statuses by module:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/statuses - Crear nuevo estado
router.post('/', authenticateToken, zodValidate(statusCreateSchema), async (req, res) => {
  try {
    const statusData = req.body;
    
    const existingStatus = await prisma.status.findFirst({ where: { name: statusData.name, module: statusData.module } });

    if (existingStatus) {
      return res.status(400).json({ error: 'Ya existe un estado con este nombre en el módulo' });
    }

    const status = await prisma.status.create({ data: { ...statusData, createdAt: new Date() } });
    res.status(201).json(status);
  } catch (error) {
    console.error('Error creating status:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/statuses/:id - Actualizar estado
router.put('/:id', authenticateToken, zodValidate(idParamSchema), zodValidate(statusUpdateSchema), async (req, res) => {
  try {
    const { id } = req.params as any;
    const statusData = req.body;

    const existingStatus = await prisma.status.findUnique({ where: { id } });

    if (!existingStatus) {
      return res.status(404).json({ error: 'Estado no encontrado' });
    }

    if (statusData.name && statusData.name !== existingStatus.name) {
      const duplicateStatus = await prisma.status.findFirst({
        where: { name: statusData.name, module: statusData.module, id: { not: id } }
      });

      if (duplicateStatus) {
        return res.status(400).json({ error: 'Ya existe un estado con este nombre en el módulo' });
      }
    }

    const updatedStatus = await prisma.status.update({ where: { id }, data: { ...statusData, updatedAt: new Date() } });
    res.json(updatedStatus);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/statuses/:id - Eliminar estado
router.delete('/:id', authenticateToken, zodValidate(idParamSchema), async (req, res) => {
  try {
    const { id } = req.params as any;

    const status = await prisma.status.findUnique({ where: { id } });

    if (!status) {
      return res.status(404).json({ error: 'Estado no encontrado' });
    }

    const isInUse = await checkStatusUsage(status.module, id);
    
    if (isInUse) {
      return res.status(400).json({ error: 'No se puede eliminar un estado que está en uso' });
    }

    await prisma.status.delete({ where: { id } });

    res.json({ message: 'Estado eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting status:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Función auxiliar para verificar si un estado está en uso
async function checkStatusUsage(module: string, statusId: string): Promise<boolean> {
  switch (module) {
    case 'driver':
      const driverCount = await prisma.driver.count({ where: { statusId } });
      return driverCount > 0;
    case 'vehicle':
      const vehicleCount = await prisma.vehicle.count({ where: { statusId } });
      return vehicleCount > 0;
    case 'contract':
      const contractCount = await prisma.contract.count({ where: { statusId } });
      return contractCount > 0;
    default:
      return false;
  }
}

export default router;