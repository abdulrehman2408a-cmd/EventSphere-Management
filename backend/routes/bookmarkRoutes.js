import express from 'express';
import { getMyBookmarks, toggleBookmark } from '../controllers/bookmarkController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getMyBookmarks);
router.post('/:sessionId', toggleBookmark);

export default router;
