import winston from 'winston';
import path from 'path';

// Configuración de colores para consola
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Formato personalizado para logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Formato para archivos (sin colores)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// Configuración del logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: fileFormat,
  transports: [
    // Logs de error
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // Logs combinados
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Agregar transporte de consola en desarrollo
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: logFormat,
  }));
}

// Logger específico para HTTP requests
export const httpLogger = winston.createLogger({
  level: 'http',
  format: fileFormat,
  transports: [
    new winston.transports.File({
      filename: path.join('logs', 'http.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Logger específico para base de datos
export const dbLogger = winston.createLogger({
  level: 'info',
  format: fileFormat,
  transports: [
    new winston.transports.File({
      filename: path.join('logs', 'database.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Logger específico para autenticación
export const authLogger = winston.createLogger({
  level: 'info',
  format: fileFormat,
  transports: [
    new winston.transports.File({
      filename: path.join('logs', 'auth.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Logger específico para archivos
export const fileLogger = winston.createLogger({
  level: 'info',
  format: fileFormat,
  transports: [
    new winston.transports.File({
      filename: path.join('logs', 'files.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Función para crear logs estructurados
export const createLogEntry = (level: string, message: string, meta?: any) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };

  logger.log(level, message, meta);
  return logEntry;
};

// Función para log de errores con stack trace
export const logError = (error: Error, context?: string) => {
  const errorLog = {
    message: error.message,
    stack: error.stack,
    context: context || 'Unknown',
    timestamp: new Date().toISOString(),
  };

  logger.error('Error occurred', errorLog);
  return errorLog;
};

// Función para log de requests HTTP
export const logHttpRequest = (req: any, res: any, responseTime: number) => {
  const httpLog = {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    timestamp: new Date().toISOString(),
  };

  httpLogger.http('HTTP Request', httpLog);
  return httpLog;
};

// Función para log de operaciones de base de datos
export const logDatabaseOperation = (operation: string, table: string, duration: number, success: boolean) => {
  const dbLog = {
    operation,
    table,
    duration: `${duration}ms`,
    success,
    timestamp: new Date().toISOString(),
  };

  dbLogger.info('Database operation', dbLog);
  return dbLog;
};

// Función para log de autenticación
export const logAuthEvent = (event: string, userId?: string, success: boolean, details?: any) => {
  const authLog = {
    event,
    userId,
    success,
    details,
    timestamp: new Date().toISOString(),
  };

  authLogger.info('Authentication event', authLog);
  return authLog;
};

// Función para log de operaciones de archivos
export const logFileOperation = (operation: string, filename: string, size: number, success: boolean) => {
  const fileLog = {
    operation,
    filename,
    size: `${size} bytes`,
    success,
    timestamp: new Date().toISOString(),
  };

  fileLogger.info('File operation', fileLog);
  return fileLog;
};

// Middleware para logging de requests
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logHttpRequest(req, res, duration);
  });

  next();
};

// Middleware para logging de errores
export const errorLogger = (err: any, req: any, res: any, next: any) => {
  logError(err, `${req.method} ${req.url}`);
  next(err);
};

export default logger;