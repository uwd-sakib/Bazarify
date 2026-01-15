import express from 'express';
import {
  getDashboardStats,
  getRecentOrders,
  getSalesChart,
  getTopProducts
} from '../controllers/dashboardController.js';
import { protect, isMerchant } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(isMerchant);

router.get('/stats', getDashboardStats);
router.get('/recent-orders', getRecentOrders);
router.get('/sales-chart', getSalesChart);
router.get('/top-products', getTopProducts);

export default router;
