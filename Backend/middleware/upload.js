import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_SIZE     = 5 * 1024 * 1024; // 5 MB

// Storage engine propio — sube directamente a Cloudinary sin tocar el disco
class CloudinaryStorage {
  constructor(folder) {
    this.folder = `djgd/${folder}`;
  }

  _handleFile(req, file, cb) {
    const stream = cloudinary.uploader.upload_stream(
      { folder: this.folder },
      (error, result) => {
        if (error) return cb(error);
        cb(null, {
          path:     result.secure_url,
          filename: result.public_id,
          size:     result.bytes,
        });
      }
    );
    file.stream.pipe(stream);
  }

  _removeFile(req, file, cb) {
    cloudinary.uploader.destroy(file.filename, cb);
  }
}

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME.has(file.mimetype)) return cb(null, true);
  cb(new Error('Solo se permiten imagenes JPEG, PNG o WebP'));
};

// Una sola imagen — uso: uploadSingle('blog', 'featuredImage')
export const uploadSingle = (folder, fieldName = 'image') =>
  (req, res, next) => {
    multer({
      storage:    new CloudinaryStorage(folder),
      fileFilter,
      limits:     { fileSize: MAX_SIZE },
    }).single(fieldName)(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  };

// Multiples imagenes — uso: uploadMultiple('products', 'images')
export const uploadMultiple = (folder, fieldName = 'images', maxCount = 5) =>
  (req, res, next) => {
    multer({
      storage:    new CloudinaryStorage(folder),
      fileFilter,
      limits:     { fileSize: MAX_SIZE, files: maxCount },
    }).array(fieldName, maxCount)(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  };
