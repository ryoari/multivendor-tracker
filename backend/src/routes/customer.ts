import express from 'express';
import { trackOrder } from '../controllers/customer';

const router = express.Router();

// Routes
router.get('/track/:orderId', trackOrder);

export default router;