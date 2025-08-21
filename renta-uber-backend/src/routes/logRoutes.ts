import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { authenticateToken } from '../middlewares/auth';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { zodValidate } from '../middlewares/zodValidate';

const router = Router();

const logsLimiter = rateLimit({ windowMs: 60 * 1000, max: 30 });
const limitQuerySchema = z.object({ query: z.object({ limit: z.string().regex(/^\d+$/).optional() }).partial() });

// Obtener logs de la aplicación (protegido)
router.get('/app', authenticateToken, logsLimiter, zodValidate(limitQuerySchema), (req, res) => {
  try {
    const logFile = path.join(__dirname, '../../logs/app.log');
    
    if (!fs.existsSync(logFile)) {
      return res.json({
        success: true,
        data: [],
        message: 'No hay logs disponibles'
      });
    }
    
    const content = fs.readFileSync(logFile, 'utf8');
    const lines = content.split('\n').filter(line => line.trim());
    const limit = Math.min(parseInt(String(req.query.limit || '100'), 10) || 100, 500);
    const recentLines = lines.slice(-limit);
    
    res.json({ success: true, data: recentLines, count: recentLines.length });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al leer los logs', error: error?.message || String(error) });
  }
});

// Obtener logs de errores (protegido)
router.get('/errors', authenticateToken, logsLimiter, zodValidate(limitQuerySchema), (req, res) => {
  try {
    const errorLogFile = path.join(__dirname, '../../logs/errors.log');
    
    if (!fs.existsSync(errorLogFile)) {
      return res.json({ success: true, data: [], message: 'No hay errores registrados' });
    }
    
    const content = fs.readFileSync(errorLogFile, 'utf8');
    const lines = content.split('\n').filter(line => line.trim());
    const limit = Math.min(parseInt(String(req.query.limit || '50'), 10) || 50, 500);
    const recentErrors = lines.slice(-limit);
    
    res.json({ success: true, data: recentErrors, count: recentErrors.length });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al leer los logs de errores', error: error?.message || String(error) });
  }
});

// Limpiar logs (protegido)
router.delete('/clear', authenticateToken, logsLimiter, (req, res) => {
  try {
    const logFile = path.join(__dirname, '../../logs/app.log');
    const errorLogFile = path.join(__dirname, '../../logs/errors.log');
    
    if (fs.existsSync(logFile)) {
      fs.writeFileSync(logFile, '');
    }
    
    if (fs.existsSync(errorLogFile)) {
      fs.writeFileSync(errorLogFile, '');
    }
    
    res.json({ success: true, message: 'Logs limpiados exitosamente' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al limpiar los logs', error: error?.message || String(error) });
  }
});

export default router; 