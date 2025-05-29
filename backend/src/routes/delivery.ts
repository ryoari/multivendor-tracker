import express from 'express';
import { updateLocation, getCurrentOrder, updateOrderStatus } from '../controllers/delivery';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Apply middleware to all routes
router.use(protect);
router.use(authorize('delivery'));

// Routes
router.post('/location/update', updateLocation);
router.get('/order/current', getCurrentOrder);
router.put('/orders/:orderId/status', updateOrderStatus);

export default router;