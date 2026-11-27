import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Allowed MIME types whitelist
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Dangerous extensions blacklist
const DANGEROUS_EXTENSIONS = ['.exe', '.sh', '.bat', '.cmd', '.ps1', '.py', '.rb', '.php', '.js', '.mjs', '.cjs', '.ts', '.jsx', '.tsx'];

// Storage configuration with sanitized filenames
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    // Sanitize fieldname for safe filenames
    const safeName = file.fieldname.replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${safeName}-${uniqueSuffix}${ext}`);
  }
});

// File filter: validate both MIME type and extension
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  // Reject dangerous extensions
  if (DANGEROUS_EXTENSIONS.includes(ext)) {
    return cb(new Error(`File type '${ext}' is not allowed for security reasons`));
  }

  // Validate MIME type against whitelist
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new Error(`File MIME type '${file.mimetype}' is not allowed. Only images (JPEG, PNG, WebP, SVG) and documents (PDF, DOC, DOCX) are permitted.`));
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit (reduced from 10MB for security)
  fileFilter
});
