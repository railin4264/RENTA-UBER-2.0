import { PrismaClient, Prisma } from '@prisma/client';
import type { Report } from '@prisma/client';

const prisma = new PrismaClient();

export const createReport = async (
  reportData: Omit<Report, 'id'> & { data: Prisma.InputJsonValue }
): Promise<Report> => {
  return prisma.report.create({ data: reportData });
};

export const getReports = async (): Promise<Report[]> => {
  return prisma.report.findMany();
};

export const getReportById = async (id: string): Promise<Report | null> => {
  return prisma.report.findUnique({ where: { id } });
};

export const updateReport = async (
  id: string,
  reportData: Partial<Omit<Report, 'id'>> & { data?: Prisma.InputJsonValue }
): Promise<Report> => {
  return prisma.report.update({ where: { id }, data: reportData });
};

export const deleteReport = async (id: string): Promise<Report> => {
  return prisma.report.delete({ where: { id } });
};