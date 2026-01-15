import express from 'express';
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customerController.js';
import { protect, isMerchant } from '../middleware/auth.js';
import { customerValidation, validate } from '../middleware/validation.js';

const router = express.Router();

router.use(protect);
router.use(isMerchant);

router.route('/')
  .get(getCustomers)
  .post(customerValidation, validate, createCustomer);

router.route('/:id')
  .get(getCustomer)
  .put(updateCustomer)
  .delete(deleteCustomer);

export default router;
