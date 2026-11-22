import express from 'express';
import { getAdminOverviewStats, getAnalyticsCharts } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/overview', getAdminOverviewStats);
router.get('/charts', getAnalyticsCharts);

export default router;
