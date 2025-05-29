import express from 'express';
import { registerVendor, loginVendor, registerDelivery, loginDelivery } from '../controllers/auth';

const router = express.Router();

// Vendor routes
router.post('/vendor/register', registerVendor);
router.post('/vendor/login', loginVendor);

// Delivery partner routes
router.post('/delivery/register', registerDelivery);
router.post('/delivery/login', loginDelivery);

export default router;