import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStatusesByModule = async (req: Request, res: Response) => {
  try {
    const { module } = req.params;
    if (!module) {
      return res.status(400).json({ message: 'Module is required' });
    }
    const statuses = await prisma.status.findMany({
      where: { module },
      orderBy: { name: 'asc' }
    });
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statuses', error });
  }
};