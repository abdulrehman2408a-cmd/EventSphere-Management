import express from 'express';
import {
  getMessages,
  getMessageById,
  sendMessage,
  replyMessage
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public or authenticated message submission (e.g. Contact page, Exhibitor inquiries)
router.post('/', (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
}, sendMessage);

// Message inbox & replies
router.get('/', protect, getMessages);
router.get('/:id', protect, getMessageById);
router.post('/:id/reply', protect, replyMessage);

export default router;
