import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (token: string): Socket => {
  if (socket && socket.connected) {
    return socket;
  }

  socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000', {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Location tracking
export const startOrderTracking = (orderId: string): void => {
  if (socket) {
    socket.emit('join_order_tracking', orderId);
  }
};

export const sendLocation = (location: { lat: number; lng: number }): void => {
  if (socket) {
    socket.emit('send_location', location);
  }
};

export const startDelivery = (orderId: string): void => {
  if (socket) {
    socket.emit('start_delivery', orderId);
  }
};