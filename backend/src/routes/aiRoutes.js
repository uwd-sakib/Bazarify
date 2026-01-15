import express from 'express';
import {
  generateProductDescription,
  getBusinessInsights,
  generateCustomerMessage,
  analyzeSalesTrend,
  getInventoryAdvice,
  chatWithAI,
  generateOrderReport,
  munshiJi,
  munshiJiV1
} from '../controllers/aiController.js';
import { protect, isMerchant } from '../middleware/auth.js';

const router = express.Router();

// All AI routes require authentication and merchant role
router.use(protect);
router.use(isMerchant);

// MunshiJi V1 - Unified AI Business Advisor (Structured Response)
router.post('/v1/munshiji', munshiJiV1);

// MunshiJi - Unified AI Business Advisor (Original)
router.post('/munshiji', munshiJi);

// AI Product Description Generator
router.post('/generate-description', generateProductDescription);

// Business Insights
router.get('/business-insights', getBusinessInsights);

// Customer Message Generator
router.post('/generate-message', generateCustomerMessage);

// Sales Trend Analysis
router.get('/sales-analysis', analyzeSalesTrend);

// Inventory Recommendations
router.get('/inventory-advice', getInventoryAdvice);

// AI Chat Assistant
router.post('/chat', chatWithAI);

// Order Report Generator
router.get('/order-report', generateOrderReport);

export default router;

