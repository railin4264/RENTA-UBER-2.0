import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// Obtener logs de la aplicación (protegido)
router.get('/app', authenticateToken, (req, res) => {
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
    
    // Obtener las últimas 100 líneas
    const recentLines = lines.slice(-100);
    
    res.json({
      success: true,
      data: recentLines,
      count: recentLines.length
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al leer los logs',
      error: error?.message || String(error)
    });
  }
});

// Obtener logs de errores (protegido)
router.get('/errors', authenticateToken, (req, res) => {
  try {
    const errorLogFile = path.join(__dirname, '../../logs/errors.log');
    
    if (!fs.existsSync(errorLogFile)) {
      return res.json({
        success: true,
        data: [],
        message: 'No hay errores registrados'
      });
    }
    
    const content = fs.readFileSync(errorLogFile, 'utf8');
    const lines = content.split('\n').filter(line => line.trim());
    
    // Obtener las últimas 50 líneas de errores
    const recentErrors = lines.slice(-50);
    
    res.json({
      success: true,
      data: recentErrors,
      count: recentErrors.length
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al leer los logs de errores',
      error: error?.message || String(error)
    });
  }
});

// Limpiar logs (protegido)
router.delete('/clear', authenticateToken, (req, res) => {
  try {
    const logFile = path.join(__dirname, '../../logs/app.log');
    const errorLogFile = path.join(__dirname, '../../logs/errors.log');
    
    if (fs.existsSync(logFile)) {
      fs.writeFileSync(logFile, '');
    }
    
    if (fs.existsSync(errorLogFile)) {
      fs.writeFileSync(errorLogFile, '');
    }
    
    res.json({
      success: true,
      message: 'Logs limpiados exitosamente'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al limpiar los logs',
      error: error?.message || String(error)
    });
  }
});

export default router; 