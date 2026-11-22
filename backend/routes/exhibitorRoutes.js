import express from 'express';
import {
  getAllExhibitors,
  getExhibitorById,
  updateExhibitorProfile,
  addProduct,
  removeProduct,
  addStaff,
  removeStaff,
  uploadExhibitorAsset,
  approveExhibitor,
  rejectExhibitor
} from '../controllers/exhibitorController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllExhibitors);
router.get('/:id', getExhibitorById);

// Profile management
router.put('/:id', protect, authorize('admin', 'exhibitor'), updateExhibitorProfile);
router.post('/:id/upload', protect, authorize('admin', 'exhibitor'), upload.single('file'), uploadExhibitorAsset);

// Product showcase
router.post('/:id/products', protect, authorize('admin', 'exhibitor'), addProduct);
router.delete('/:id/products/:productId', protect, authorize('admin', 'exhibitor'), removeProduct);

// Staff management
router.post('/:id/staff', protect, authorize('admin', 'exhibitor'), addStaff);
router.delete('/:id/staff/:staffId', protect, authorize('admin', 'exhibitor'), removeStaff);

// Admin approval
router.patch('/:id/approve', protect, authorize('admin'), approveExhibitor);
router.patch('/:id/reject', protect, authorize('admin'), rejectExhibitor);

export default router;
