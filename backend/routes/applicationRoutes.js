import express from 'express';
import {
  applyForExpo,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('exhibitor', 'admin'), applyForExpo);
router.get('/my', protect, authorize('exhibitor', 'admin'), getMyApplications);
router.get('/', protect, authorize('admin'), getAllApplications);
router.patch('/:id/status', protect, authorize('admin'), updateApplicationStatus);

export default router;
