import { Request, Response } from 'express';
import DeliveryPartner from '../models/delivery';
import Order from '../models/order';

// Update delivery partner location
export const updateLocation = async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.body;
    const deliveryPartnerId = req.user.id;
    
    // Update location
    const deliveryPartner = await DeliveryPartner.findByIdAndUpdate(
      deliveryPartnerId,
      { currentLocation: { lat, lng } },
      { new: true }
    );
    
    if (!deliveryPartner) {
      return res.status(404).json({ message: 'Delivery partner not found' });
    }
    
    res.json({ message: 'Location updated successfully', location: deliveryPartner.currentLocation });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get current order for delivery partner
export const getCurrentOrder = async (req: Request, res: Response) => {
  try {
    const deliveryPartnerId = req.user.id;
    
    const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId);
    if (!deliveryPartner || !deliveryPartner.currentOrder) {
      return res.status(404).json({ message: 'No current order found' });
    }
    
    const order = await Order.findById(deliveryPartner.currentOrder)
      .populate('vendorId', 'businessName businessAddress')
      .populate('customerId', 'name phone');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const deliveryPartnerId = req.user.id;
    
    // Check if order exists and is assigned to this delivery partner
    const order = await Order.findOne({ _id: orderId, deliveryPartnerId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update order status
    order.status = status;
    await order.save();
    
    // If order is delivered or cancelled, update delivery partner availability
    if (status === 'delivered' || status === 'cancelled') {
      await DeliveryPartner.findByIdAndUpdate(deliveryPartnerId, {
        isAvailable: true,
        currentOrder: null
      });
    }
    
    res.json({ message: 'Order status updated successfully', order });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};