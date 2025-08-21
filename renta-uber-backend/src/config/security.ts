import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { Express } from 'express';

// Configuración de CORS
export const corsConfig = cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:3000',
    'http://localhost:3001',
    'null',
    'file://'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Content-Length', 'X-Total-Count'],
});

// Configuración de rate limiting
export const rateLimitConfig = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: {
    success: false,
    message: 'Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // No aplicar rate limiting a rutas de health check
    return req.path === '/api/health' || req.path === '/';
  },
});

// Rate limiting más estricto para autenticación
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos de login por ventana
  message: {
    success: false,
    message: 'Demasiados intentos de autenticación, intenta de nuevo en 15 minutos',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path !== '/api/auth/login',
});

// Configuración de Helmet para seguridad
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
});

// Middleware de seguridad personalizado
export const securityMiddleware = (app: Express) => {
  // Aplicar Helmet
  app.use(helmetConfig);
  
  // Aplicar CORS
  app.use(corsConfig);
  
  // Aplicar rate limiting general
  app.use('/api/', rateLimitConfig);
  
  // Aplicar rate limiting específico para autenticación
  app.use('/api/auth/', authRateLimit);
  
  // Headers de seguridad adicionales
  app.use((req, res, next) => {
    // Prevenir clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Prevenir MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Referrer policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Permissions policy
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    // XSS Protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    next();
  });
};

// Configuración de validación de JWT
export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshExpiresIn: '30d',
  issuer: 'renta-uber-api',
  audience: 'renta-uber-client',
};

// Configuración de sesiones
export const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-super-secret-session-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    sameSite: 'strict' as const,
  },
};

// Configuración de archivos
export const fileUploadConfig = {
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB por defecto
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  maxFiles: 5,
};

// Función para validar configuración de seguridad
export const validateSecurityConfig = () => {
  const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('⚠️  Variables de entorno de seguridad faltantes:', missingVars);
    console.warn('   Esto puede comprometer la seguridad de la aplicación');
  }
  
  if (process.env.NODE_ENV === 'production') {
    if (process.env.JWT_SECRET === 'your-super-secret-jwt-key-change-this-in-production') {
      console.error('❌ JWT_SECRET no ha sido configurado en producción');
      process.exit(1);
    }
    
    if (!process.env.SESSION_SECRET) {
      console.error('❌ SESSION_SECRET no ha sido configurado en producción');
      process.exit(1);
    }
  }
  
  console.log('✅ Configuración de seguridad validada');
};