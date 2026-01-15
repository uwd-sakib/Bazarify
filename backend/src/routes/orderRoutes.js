import express from 'express';
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  deleteOrder
} from '../controllers/orderController.js';
import { protect, isMerchant } from '../middleware/auth.js';
import { orderValidation, validate } from '../middleware/validation.js';

const router = express.Router();

router.use(protect);
router.use(isMerchant);

router.route('/')
  .get(getOrders)
  .post(orderValidation, validate, createOrder);

router.route('/:id')
  .get(getOrder)
  .delete(deleteOrder);

router.put('/:id/status', updateOrderStatus);

export default router;
