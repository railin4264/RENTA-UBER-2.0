import express from 'express';
import rateLimit from 'express-rate-limit';
import { 
  login, 
  register, 
  verifyToken, 
  logout, 
  changePassword, 
  getProfile,
  updateProfile
} from '../controllers/authController';
import { authenticateToken } from '../middlewares/auth';
import { zodValidate } from '../middlewares/zodValidate';
import { loginSchema, registerSchema } from '../utils/validationSchemas';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

// Rutas públicas con validación
router.post('/login', strictLimiter, zodValidate(loginSchema), login);
router.post('/register', strictLimiter, zodValidate(registerSchema), register);
router.post('/verify', authLimiter, verifyToken);
router.get('/verify', authLimiter, verifyToken); // Agregar ruta GET para verificar token

// Rutas protegidas
router.post('/logout', authenticateToken, logout);
router.post('/change-password', authenticateToken, changePassword);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

export default router;