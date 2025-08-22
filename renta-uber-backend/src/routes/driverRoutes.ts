import express from 'express';
import multer from 'multer';
import { 
  getDrivers, 
  getDriverById, 
  createDriver, 
  updateDriver, 
  deleteDriver,
  uploadDriverPhoto,
  uploadDriverDocument,
  getDriverPayments,
  getDriverDebts,
  getDriverContracts,
  getDriverGuarantors,
  addDriverGuarantor,
  updateDriverGuarantor,
  deleteDriverGuarantor
} from '../controllers/driverController';
import { authenticateToken, requireRole } from '../middlewares/auth';
import { zodValidate } from '../middlewares/zodValidate';
import { 
  createDriverSchema, 
  updateDriverSchema, 
  idParamSchema,
  paginationSchema 
} from '../utils/validationSchemas';

const router = express.Router();

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'photo' || file.fieldname === 'cedulaPhoto' || file.fieldname === 'licensePhoto') {
      cb(null, 'uploads/drivers/photos')
    } else {
      cb(null, 'uploads/drivers/documents')
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo se permiten JPG, PNG y PDF.'));
    }
  }
});

// Rutas públicas
router.get('/', authenticateToken, zodValidate(paginationSchema), getDrivers);
router.get('/:id', authenticateToken, zodValidate(idParamSchema), getDriverById);
router.get('/:id/payments', authenticateToken, zodValidate(idParamSchema), getDriverPayments);
router.get('/:id/debts', authenticateToken, zodValidate(idParamSchema), getDriverDebts);
router.get('/:id/contracts', authenticateToken, zodValidate(idParamSchema), getDriverContracts);
router.get('/:id/guarantors', authenticateToken, zodValidate(idParamSchema), getDriverGuarantors);

// Rutas protegidas - requieren autenticación y rol admin
router.post('/', authenticateToken, requireRole(['admin']), zodValidate(createDriverSchema), createDriver);
router.put('/:id', authenticateToken, requireRole(['admin']), zodValidate(updateDriverSchema), updateDriver);
router.delete('/:id', authenticateToken, requireRole(['admin']), zodValidate(idParamSchema), deleteDriver);
router.post('/:id/photo', authenticateToken, requireRole(['admin']), zodValidate(idParamSchema), upload.single('photo'), uploadDriverPhoto);
router.post('/:id/document', authenticateToken, requireRole(['admin']), zodValidate(idParamSchema), upload.single('document'), uploadDriverDocument);
router.post('/:id/guarantors', authenticateToken, requireRole(['admin']), zodValidate(idParamSchema), addDriverGuarantor);
router.put('/:id/guarantors/:guarantorId', authenticateToken, requireRole(['admin']), updateDriverGuarantor);
router.delete('/:id/guarantors/:guarantorId', authenticateToken, requireRole(['admin']), deleteDriverGuarantor);

export default router;