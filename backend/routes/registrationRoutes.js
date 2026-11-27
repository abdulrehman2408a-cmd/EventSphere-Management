import express from 'express';
import {
  registerForExpo,
  getMyRegistrations,
  getAllRegistrations,
  toggleCheckIn,
  getRegistrationById
} from '../controllers/registrationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public / Authenticated register for expo
router.post('/', (req, res, next) => {
  // If authorization header exists, authenticate optional user
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
}, registerForExpo);

// Logged-in user's registrations
router.get('/my', protect, getMyRegistrations);

// Single pass - protected by ownership check
router.get('/:id', protect, getRegistrationById);

// Admin view all attendees & toggle checkin
router.get('/', protect, authorize('admin'), getAllRegistrations);
router.patch('/:id/checkin', protect, authorize('admin'), toggleCheckIn);

export default router;
