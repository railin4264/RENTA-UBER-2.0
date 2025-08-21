import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

// Crear directorio de logs si no existe
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, 'app.log');
const errorLogFile = path.join(logsDir, 'errors.log');

// Función para escribir logs
const writeLog = (message: string, file: string = logFile) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  fs.appendFileSync(file, logEntry);
  
  // También mostrar en consola en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${timestamp}] ${message}`);
  }
};

// Función para escribir errores
const writeErrorLog = (error: any, context: string = '') => {
  const timestamp = new Date().toISOString();
  const errorMessage = `[${timestamp}] ERROR in ${context}: ${error.message}\n`;
  const stackTrace = error.stack ? `Stack: ${error.stack}\n` : '';
  const fullLog = errorMessage + stackTrace + '---\n';
  
  fs.appendFileSync(errorLogFile, fullLog);
  
  // También mostrar en consola
  console.error(`[${timestamp}] ERROR in ${context}:`, error);
};

// Middleware para logging de requests
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Log del request
  writeLog(`REQUEST: ${req.method} ${req.path} - IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
  
  // Log del body si es POST/PUT
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
    writeLog(`BODY: ${JSON.stringify(req.body)}`);
  }
  
  // Interceptar la respuesta
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    const status = res.statusCode;
    
    writeLog(`RESPONSE: ${req.method} ${req.path} - Status: ${status} - Duration: ${duration}ms`);
    
    if (status >= 400) {
      writeErrorLog(new Error(`HTTP ${status}: ${req.method} ${req.path}`), 'HTTP_ERROR');
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

// Middleware para manejo de errores con logging
export const errorLogger = (error: any, req: Request, res: Response, next: NextFunction) => {
  const context = `${req.method} ${req.path}`;
  writeErrorLog(error, context);
  
  // Si es un error de Prisma, loggear detalles específicos
  if (error.code) {
    writeErrorLog({
      message: `Prisma Error Code: ${error.code}`,
      meta: error.meta,
      stack: error.stack
    }, `PRISMA_ERROR_${context}`);
  }
  
  next(error);
};

// Función para logging manual
export const logInfo = (message: string) => {
  writeLog(`INFO: ${message}`);
};

export const logError = (error: any, context: string = '') => {
  writeErrorLog(error, context);
};

export const logWarning = (message: string) => {
  writeLog(`WARNING: ${message}`);
};

// Función para logging de operaciones de base de datos
export const logDatabaseOperation = (operation: string, model: string, details: any = {}) => {
  writeLog(`DB_OPERATION: ${operation} on ${model} - Details: ${JSON.stringify(details)}`);
};

// Función para logging de validaciones
export const logValidation = (field: string, value: any, isValid: boolean, message?: string) => {
  writeLog(`VALIDATION: ${field} = ${JSON.stringify(value)} - Valid: ${isValid}${message ? ` - ${message}` : ''}`);
}; 