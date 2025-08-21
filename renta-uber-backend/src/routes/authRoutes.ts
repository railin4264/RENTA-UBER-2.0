import express from 'express';
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
import { validateRequest } from '../utils/validation';

const router = express.Router();

// Rutas públicas
router.post('/login', login);
router.post('/register', register);
router.post('/verify', verifyToken);
router.get('/verify', verifyToken); // Agregar ruta GET para verificar token

// Rutas protegidas
router.post('/logout', authenticateToken, logout);
router.post('/change-password', authenticateToken, changePassword);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

export default router;