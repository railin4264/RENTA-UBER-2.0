import express from 'express';
import {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  searchDrivers,
  getDriversByStatus,
  getDriverStats,
  uploadDriverPhoto
} from '../controllers/driverController';
import { authenticateToken } from '../middlewares/auth';
import { validateDriver } from '../utils/validation';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configurar multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'));
    }
  }
});

// Rutas públicas (sin autenticación)
router.get('/', getAllDrivers);
router.get('/stats', getDriverStats);
router.get('/search', searchDrivers);
router.get('/status/:statusId', getDriversByStatus);

// Rutas protegidas (requieren autenticación)
router.get('/:id', authenticateToken, getDriverById);
router.post('/', authenticateToken, validateDriver, createDriver);
router.put('/:id', authenticateToken, validateDriver, updateDriver);
router.delete('/:id', authenticateToken, deleteDriver);
router.post('/:id/photo', authenticateToken, upload.single('photo'), uploadDriverPhoto);

export default router;