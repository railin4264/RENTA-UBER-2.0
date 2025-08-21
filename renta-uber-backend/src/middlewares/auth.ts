import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import logger from '../config/logging';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido',
      });
    }

    // Verificar token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default-secret'
    ) as any;

    // Verificar que el usuario existe y está activo
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        status: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    if (user.status?.name !== 'Activo') {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo',
      });
    }

    // Agregar información del usuario a la request
    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    // Log de acceso exitoso
    logger.info(`Acceso autenticado: ${user.email}`, {
      userId: user.id,
      role: user.role,
      endpoint: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      logger.warn('Token inválido', {
        endpoint: req.originalUrl,
        ip: req.ip,
      });
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
      });
    }

    if (error.name === 'TokenExpiredError') {
      logger.warn('Token expirado', {
        endpoint: req.originalUrl,
        ip: req.ip,
      });
      return res.status(401).json({
        success: false,
        message: 'Token expirado',
      });
    }

    logger.error('Error en autenticación:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Acceso denegado por rol: ${req.user.email}`, {
        userId: req.user.userId,
        role: req.user.role,
        requiredRoles: roles,
        endpoint: req.originalUrl,
        method: req.method,
        ip: req.ip,
      });

      return res.status(403).json({
        success: false,
        message: 'Acceso denegado: permisos insuficientes',
      });
    }

    next();
  };
};

export const requireAdmin = requireRole(['admin']);
export const requireManager = requireRole(['admin', 'manager']);
export const requireUser = requireRole(['admin', 'manager', 'user']);

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    // Verificar token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default-secret'
    ) as any;

    // Verificar que el usuario existe y está activo
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        status: true,
      },
    });

    if (user && user.status?.name === 'Activo') {
      req.user = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };
    }

    next();
  } catch (error) {
    // Si hay error en la autenticación, continuar sin usuario
    next();
  }
};

export const rateLimitByUser = (maxRequests: number, windowMs: number) => {
  const userRequests = new Map<string, { count: number; resetTime: number }>();

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user.userId;
    const now = Date.now();
    const userData = userRequests.get(userId);

    if (!userData || now > userData.resetTime) {
      userRequests.set(userId, {
        count: 1,
        resetTime: now + windowMs,
      });
    } else {
      userData.count++;
      if (userData.count > maxRequests) {
        logger.warn(`Rate limit excedido para usuario: ${req.user.email}`, {
          userId: req.user.userId,
          endpoint: req.originalUrl,
          method: req.method,
          ip: req.ip,
        });

        return res.status(429).json({
          success: false,
          message: 'Demasiadas solicitudes. Intenta de nuevo más tarde.',
        });
      }
    }

    next();
  };
};

export const validateOwnership = (resourceType: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
      });
    }

    // Los administradores pueden acceder a todo
    if (req.user.role === 'admin') {
      return next();
    }

    const resourceId = req.params.id || req.params.userId;
    if (!resourceId) {
      return next();
    }

    try {
      let resource;

      switch (resourceType) {
        case 'user':
          resource = await prisma.user.findUnique({
            where: { id: resourceId },
          });
          break;
        case 'driver':
          resource = await prisma.driver.findUnique({
            where: { id: resourceId },
          });
          break;
        case 'vehicle':
          resource = await prisma.vehicle.findUnique({
            where: { id: resourceId },
          });
          break;
        case 'payment':
          resource = await prisma.payment.findUnique({
            where: { id: resourceId },
          });
          break;
        case 'expense':
          resource = await prisma.expense.findUnique({
            where: { id: resourceId },
          });
          break;
        case 'contract':
          resource = await prisma.contract.findUnique({
            where: { id: resourceId },
          });
          break;
        default:
          return next();
      }

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Recurso no encontrado',
        });
      }

      // Verificar propiedad del recurso
      if (resource.userId && resource.userId !== req.user.userId) {
        logger.warn(`Acceso denegado a recurso: ${req.user.email}`, {
          userId: req.user.userId,
          resourceId,
          resourceType,
          endpoint: req.originalUrl,
          method: req.method,
          ip: req.ip,
        });

        return res.status(403).json({
          success: false,
          message: 'Acceso denegado: no tienes permisos para este recurso',
        });
      }

      next();
    } catch (error) {
      logger.error('Error en validación de propiedad:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
      });
    }
  };
}; 