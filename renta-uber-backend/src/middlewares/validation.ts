import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

// Middleware de validación genérico
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validar body, query y params
      const validatedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Asignar datos validados a la request
      req.body = validatedData.body;
      req.query = validatedData.query;
      req.params = validatedData.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors,
        });
      }

      next(error);
    }
  };
};

// Middleware de validación solo para body
export const validateBody = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedBody = await schema.parseAsync(req.body);
      req.body = validatedBody;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        return res.status(400).json({
          success: false,
          message: 'Datos del cuerpo de la petición inválidos',
          errors,
        });
      }

      next(error);
    }
  };
};

// Middleware de validación solo para query
export const validateQuery = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedQuery = await schema.parseAsync(req.query);
      req.query = validatedQuery;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        return res.status(400).json({
          success: false,
          message: 'Parámetros de consulta inválidos',
          errors,
        });
      }

      next(error);
    }
  };
};

// Middleware de validación solo para params
export const validateParams = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedParams = await schema.parseAsync(req.params);
      req.params = validatedParams;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        return res.status(400).json({
          success: false,
          message: 'Parámetros de ruta inválidos',
          errors,
        });
      }

      next(error);
    }
  };
};

// Middleware para validar archivos
export const validateFileUpload = (allowedTypes: string[], maxSize: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Archivo requerido',
      });
    }

    // Validar tipo de archivo
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`,
      });
    }

    // Validar tamaño del archivo
    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: `Archivo demasiado grande. Tamaño máximo: ${maxSize / 1024 / 1024}MB`,
      });
    }

    next();
  };
};

// Middleware para validar múltiples archivos
export const validateMultipleFiles = (allowedTypes: string[], maxSize: number, maxFiles: number = 5) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Al menos un archivo es requerido',
      });
    }

    const files = Array.isArray(req.files) ? req.files : [req.files];

    if (files.length > maxFiles) {
      return res.status(400).json({
        success: false,
        message: `Demasiados archivos. Máximo permitido: ${maxFiles}`,
      });
    }

    for (const file of files) {
      // Validar tipo de archivo
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: `Tipo de archivo no permitido: ${file.originalname}. Tipos permitidos: ${allowedTypes.join(', ')}`,
        });
      }

      // Validar tamaño del archivo
      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: `Archivo demasiado grande: ${file.originalname}. Tamaño máximo: ${maxSize / 1024 / 1024}MB`,
        });
      }
    }

    next();
  };
};