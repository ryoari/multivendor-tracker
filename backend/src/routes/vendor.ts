import express from 'express';
import { getVendorOrders, assignDeliveryPartner, getAvailableDeliveryPartners } from '../controllers/vendor';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Apply middleware to all routes
router.use(protect);
router.use(authorize('vendor'));

// Routes
router.get('/orders', getVendorOrders);
router.post('/orders/:orderId/assign', assignDeliveryPartner);
router.get('/delivery-partners/available', getAvailableDeliveryPartners);

export default router;