import express from 'express';
import {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  searchVehicles,
  getVehiclesByStatus,
  getVehicleStats,
  getVehiclesInMaintenance,
  uploadVehiclePhoto
} from '../controllers/vehicleController';
import { authenticateToken } from '../middlewares/auth';
import { validateVehicle } from '../utils/validation';
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
router.get('/', getAllVehicles);
router.get('/stats', getVehicleStats);
router.get('/search', searchVehicles);
router.get('/status/:statusId', getVehiclesByStatus);
router.get('/maintenance', getVehiclesInMaintenance);

// Rutas protegidas (requieren autenticación)
router.get('/:id', getVehicleById);
router.post('/', authenticateToken, validateVehicle, createVehicle);
router.put('/:id', authenticateToken, validateVehicle, updateVehicle);
router.delete('/:id', authenticateToken, deleteVehicle);
router.post('/:id/photo', authenticateToken, upload.single('photo'), uploadVehiclePhoto);

export default router;