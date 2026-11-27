import express from 'express';
import {
  getAllExpos,
  getExpoById,
  createExpo,
  updateExpo,
  deleteExpo
} from '../controllers/expoController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getAllExpos);
router.get('/:id', getExpoById);

// Admin-only operations
router.post('/', protect, authorize('admin'), createExpo);
router.put('/:id', protect, authorize('admin'), updateExpo);
router.delete('/:id', protect, authorize('admin'), deleteExpo);

export default router;
