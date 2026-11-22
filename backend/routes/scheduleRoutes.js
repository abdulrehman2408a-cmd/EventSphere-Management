import express from 'express';
import {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  enrollSession
} from '../controllers/scheduleController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getSessions);
router.get('/:id', getSessionById);

// Attendee enroll
router.post('/:id/enroll', protect, enrollSession);

// Admin agenda management
router.post('/', protect, authorize('admin'), createSession);
router.put('/:id', protect, authorize('admin'), updateSession);
router.delete('/:id', protect, authorize('admin'), deleteSession);

export default router;
