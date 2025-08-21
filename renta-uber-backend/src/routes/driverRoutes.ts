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
const driverBodySchemaBase = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  cedula: z.string().min(5),
  license: z.string().min(3),
  phone: z.string().min(5),
});
const driverCreateSchema = z.object({ body: driverBodySchemaBase });
const driverUpdateSchema = z.object({ body: driverBodySchemaBase.partial() });

// Rutas públicas (sin autenticación)
router.get('/', getAllDrivers);
router.get('/stats', getDriverStats);
router.get('/search', searchDrivers);
router.get('/status/:statusId', getDriversByStatus);

// Rutas protegidas (requieren autenticación)
router.get('/:id', zodValidate(idParamSchema), authenticateToken, getDriverById);
router.post('/', authenticateToken, zodValidate(driverCreateSchema), createDriver);
router.put('/:id', authenticateToken, zodValidate(idParamSchema), zodValidate(driverUpdateSchema), updateDriver);
router.delete('/:id', authenticateToken, zodValidate(idParamSchema), deleteDriver);
router.post('/:id/photo', authenticateToken, zodValidate(idParamSchema), upload.single('photo'), uploadDriverPhoto);

export default router;