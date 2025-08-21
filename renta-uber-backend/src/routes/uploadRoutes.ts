import express from 'express';
import multer from 'multer';
import path from 'path';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) return cb(null, true);
    return cb(new Error('Solo se permiten imágenes'));
  },
});

const uploadLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 60 });

router.post('/image', uploadLimiter, upload.single('file'), (req, res) => {
  res.json({ success: true, file: req.file?.filename });
});

export default router;