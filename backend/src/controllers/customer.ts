import { Request, Response } from 'express';
import Order from '../models/order';
import DeliveryPartner from '../models/delivery';

// Get tracking information for an order
export const trackOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    
    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // If order has no delivery partner assigned
    if (!order.deliveryPartnerId) {
      return res.json({
        orderId: order._id,
        status: order.status,
        deliveryPartner: null,
        location: null
      });
    }
    
    // Get delivery partner location
    const deliveryPartner = await DeliveryPartner.findById(order.deliveryPartnerId)
      .populate('_id', 'name phone');
    
    if (!deliveryPartner) {
      return res.status(404).json({ message: 'Delivery partner not found' });
    }
    
    res.json({
      orderId: order._id,
      status: order.status,
      deliveryPartner: {
        id: deliveryPartner._id,
        name: deliveryPartner._id.name,
        phone: deliveryPartner._id.phone
      },
      location: deliveryPartner.currentLocation
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};