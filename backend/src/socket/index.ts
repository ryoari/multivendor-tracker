import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { verifyToken } from '../utils/jwt';
import DeliveryPartner from '../models/delivery';
import Order from '../models/order';

export default (httpServer: HttpServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  // Socket authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new Error('Authentication error'));
    }

    socket.data.user = decoded;
    next();
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}, role: ${socket.data.user.role}`);

    // Join room based on user role
    if (socket.data.user.role === 'delivery') {
      socket.join(`delivery:${socket.data.user.id}`);
    }

    // Handle location updates from delivery partners
    socket.on('send_location', async (data: { lat: number; lng: number }) => {
      try {
        if (socket.data.user.role !== 'delivery') {
          return;
        }

        const deliveryPartnerId = socket.data.user.id;
        
        // Update location in database
        const deliveryPartner = await DeliveryPartner.findByIdAndUpdate(
          deliveryPartnerId,
          { currentLocation: data },
          { new: true }
        );

        if (!deliveryPartner || !deliveryPartner.currentOrder) {
          return;
        }

        // Get current order
        const order = await Order.findById(deliveryPartner.currentOrder);
        if (!order) {
          return;
        }

        // Broadcast location to customer tracking the order
        io.to(`order:${order._id}`).emit('location_update', {
          orderId: order._id,
          location: data,
          status: order.status
        });
      } catch (error) {
        console.error('Socket error:', error);
      }
    });

    // Handle start delivery event
    socket.on('start_delivery', async (orderId: string) => {
      try {
        if (socket.data.user.role !== 'delivery') {
          return;
        }

        const deliveryPartnerId = socket.data.user.id;
        
        // Update order status
        const order = await Order.findOneAndUpdate(
          { _id: orderId, deliveryPartnerId },
          { status: 'in_transit' },
          { new: true }
        );

        if (!order) {
          return;
        }

        // Broadcast status update
        io.to(`order:${orderId}`).emit('order_status_update', {
          orderId,
          status: 'in_transit'
        });
      } catch (error) {
        console.error('Socket error:', error);
      }
    });

    // Handle customer joining order tracking room
    socket.on('join_order_tracking', async (orderId: string) => {
      socket.join(`order:${orderId}`);
      
      try {
        // Find order
        const order = await Order.findById(orderId);
        if (!order || !order.deliveryPartnerId) {
          return;
        }
        
        // Get delivery partner location
        const deliveryPartner = await DeliveryPartner.findById(order.deliveryPartnerId);
        if (!deliveryPartner) {
          return;
        }
        
        // Send initial location
        socket.emit('location_update', {
          orderId,
          location: deliveryPartner.currentLocation,
          status: order.status
        });
      } catch (error) {
        console.error('Socket error:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};