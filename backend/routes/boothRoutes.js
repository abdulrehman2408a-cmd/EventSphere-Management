import express from 'express';
import {
  getBooths,
  getBoothById,
  bookBooth,
  updateBoothStatus
} from '../controllers/boothController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getBooths);
router.get('/:id', getBoothById);

// Booking booth (Exhibitor or Admin)
router.post('/:id/book', protect, authorize('admin', 'exhibitor'), bookBooth);

// Manual status update (Admin)
router.put('/:id/status', protect, authorize('admin'), updateBoothStatus);

export default router;
