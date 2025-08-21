import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export const zodValidate = (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    if (!result.success) {
      const errors = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
      return res.status(400).json({ message: 'Errores de validación', errors });
    }
    next();
  };