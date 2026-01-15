import express from 'express';
import {
  getShopInfo,
  updateShopInfo,
  updateProfile
} from '../controllers/shopController.js';
import { protect, isMerchant } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(isMerchant);

router.route('/')
  .get(getShopInfo)
  .put(updateShopInfo);

router.put('/profile', updateProfile);

export default router;
