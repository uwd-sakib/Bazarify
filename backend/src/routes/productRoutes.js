import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
} from '../controllers/productController.js';
import { protect, isMerchant } from '../middleware/auth.js';
import { productValidation, validate } from '../middleware/validation.js';

const router = express.Router();

router.use(protect);
router.use(isMerchant);

router.route('/')
  .get(getProducts)
  .post(productValidation, validate, createProduct);

router.get('/categories/list', getCategories);

router.route('/:id')
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

export default router;
