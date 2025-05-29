import { Request, Response } from 'express';
import Order from '../models/order';
import DeliveryPartner from '../models/delivery';

// Get all orders for a vendor
export const getVendorOrders = async (req: Request, res: Response) => {
  try {
    const vendorId = req.user.id;
    
    const orders = await Order.find({ vendorId })
      .populate('customerId', 'name email')
      .populate('deliveryPartnerId', 'name phone');
    
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Assign delivery partner to order
export const assignDeliveryPartner = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { deliveryPartnerId } = req.body;
    const vendorId = req.user.id;
    
    // Check if order exists and belongs to vendor
    const order = await Order.findOne({ _id: orderId, vendorId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if delivery partner exists
    const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId);
    if (!deliveryPartner) {
      return res.status(404).json({ message: 'Delivery partner not found' });
    }
    
    // Check if delivery partner is available
    if (!deliveryPartner.isAvailable) {
      return res.status(400).json({ message: 'Delivery partner is not available' });
    }
    
    // Update order
    order.deliveryPartnerId = deliveryPartnerId;
    order.status = 'assigned';
    await order.save();
    
    // Update delivery partner
    deliveryPartner.isAvailable = false;
    deliveryPartner.currentOrder = order._id;
    await deliveryPartner.save();
    
    res.json({ message: 'Delivery partner assigned successfully', order });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get available delivery partners
export const getAvailableDeliveryPartners = async (req: Request, res: Response) => {
  try {
    const deliveryPartners = await DeliveryPartner.find({ isAvailable: true })
      .populate('_id', 'name phone');
    
    res.json(deliveryPartners);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};