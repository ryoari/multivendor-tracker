import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Mock auth endpoints
app.post('/api/auth/vendor/register', (req, res) => {
  const { name, email, password, phone, businessName, businessAddress } = req.body;
  
  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }
  
  // Mock successful registration
  res.status(201).json({
    _id: 'v_' + Date.now(),
    name,
    email,
    phone,
    role: 'vendor',
    token: 'mock_token_' + Date.now()
  });
});

app.post('/api/auth/delivery/register', (req, res) => {
  const { name, email, password, phone } = req.body;
  
  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }
  
  // Mock successful registration
  res.status(201).json({
    _id: 'd_' + Date.now(),
    name,
    email,
    phone,
    role: 'delivery',
    token: 'mock_token_' + Date.now()
  });
});

app.post('/api/auth/vendor/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }
  
  // Mock successful login
  res.json({
    _id: 'v_' + Date.now(),
    name: 'Vendor User',
    email,
    phone: '123-456-7890',
    role: 'vendor',
    token: 'mock_token_' + Date.now()
  });
});

app.post('/api/auth/delivery/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }
  
  // Mock successful login
  res.json({
    _id: 'd_' + Date.now(),
    name: 'Delivery Partner',
    email,
    phone: '123-456-7890',
    role: 'delivery',
    token: 'mock_token_' + Date.now()
  });
});

// Mock vendor API endpoints
app.get('/api/vendor/orders', (req, res) => {
  // Return mock orders
  res.json([
    {
      _id: 'order_' + Math.floor(Math.random() * 1000000),
      vendorId: 'v_123456',
      customerId: 'c_' + Math.floor(Math.random() * 1000000),
      deliveryPartnerId: null,
      status: 'pending',
      items: [
        { name: 'Product 1', quantity: 2, price: 19.99 }
      ],
      totalAmount: 39.98,
      deliveryAddress: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        coordinates: { lat: 37.7749, lng: -122.4194 }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'order_' + Math.floor(Math.random() * 1000000),
      vendorId: 'v_123456',
      customerId: 'c_' + Math.floor(Math.random() * 1000000),
      deliveryPartnerId: 'd_987654',
      status: 'assigned',
      items: [
        { name: 'Product 2', quantity: 1, price: 29.99 }
      ],
      totalAmount: 29.99,
      deliveryAddress: {
        street: '456 Oak St',
        city: 'Othertown',
        state: 'NY',
        zipCode: '67890',
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
});

app.get('/api/vendor/delivery-partners/available', (req, res) => {
  // Return mock delivery partners
  res.json([
    {
      _id: 'd_' + Math.floor(Math.random() * 1000000),
      name: 'Delivery Partner 1',
      email: 'delivery1@example.com',
      phone: '123-456-7890',
      isAvailable: true
    },
    {
      _id: 'd_' + Math.floor(Math.random() * 1000000),
      name: 'Delivery Partner 2',
      email: 'delivery2@example.com',
      phone: '123-456-7891',
      isAvailable: true
    }
  ]);
});

app.post('/api/vendor/orders/:orderId/assign', (req, res) => {
  const { orderId } = req.params;
  const { deliveryPartnerId } = req.body;
  
  // Return mock response
  res.json({
    message: 'Delivery partner assigned successfully',
    order: {
      _id: orderId,
      status: 'assigned',
      deliveryPartnerId
    }
  });
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle location updates
  socket.on('send_location', (data) => {
    console.log('Location received:', data);
    // Broadcast to all clients
    io.emit('location_update', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = 4001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});