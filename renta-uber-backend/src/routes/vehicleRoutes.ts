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
import { z } from 'zod';
import { zodValidate } from '../middlewares/zodValidate';

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

const idParamSchema = z.object({ params: z.object({ id: z.string().min(1) }) });
const vehicleBodyBase = z.object({
  model: z.string().min(2),
  plate: z.string().min(5),
  year: z.number().int().gte(1900).lte(new Date().getFullYear() + 1),
  color: z.string().min(2),
});
const vehicleCreateSchema = z.object({ body: vehicleBodyBase });
const vehicleUpdateSchema = z.object({ body: vehicleBodyBase.partial() });

// Rutas públicas (sin autenticación)
router.get('/', getAllVehicles);
router.get('/stats', getVehicleStats);
router.get('/search', searchVehicles);
router.get('/status/:statusId', getVehiclesByStatus);
router.get('/maintenance', getVehiclesInMaintenance);

// Rutas protegidas (requieren autenticación)
router.get('/:id', zodValidate(idParamSchema), getVehicleById);
router.post('/', authenticateToken, zodValidate(vehicleCreateSchema), createVehicle);
router.put('/:id', authenticateToken, zodValidate(idParamSchema), zodValidate(vehicleUpdateSchema), updateVehicle);
router.delete('/:id', authenticateToken, zodValidate(idParamSchema), deleteVehicle);
router.post('/:id/photo', authenticateToken, zodValidate(idParamSchema), upload.single('photo'), uploadVehiclePhoto);

export default router;