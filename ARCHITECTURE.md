# Multivendor Tracker - Architecture Document

## System Architecture

### Overview
The Multivendor Tracker is built using a modern web architecture with a clear separation between frontend and backend services, connected via RESTful APIs and WebSockets for real-time communication.

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Frontend  │◄────►│   Backend   │◄────►│  Database   │
│  (Next.js)  │      │  (Node.js)  │      │ (MongoDB)   │
└─────────────┘      └─────────────┘      └─────────────┘
       ▲                    ▲
       │                    │
       ▼                    ▼
┌─────────────┐      ┌─────────────┐
│  WebSocket  │◄────►│  WebSocket  │
│   Client    │      │   Server    │
└─────────────┘      └─────────────┘
```

### Frontend Architecture
The frontend is built with Next.js and TypeScript, following a component-based architecture:

```
frontend/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── customer-tracking/  # Customer tracking page
│   │   ├── delivery-partner/   # Delivery partner dashboard
│   │   ├── vendor/             # Vendor dashboard
│   │   └── auth/               # Authentication pages
│   ├── components/      # Reusable UI components
│   │   ├── common/      # Shared components
│   │   ├── maps/        # Map-related components
│   │   ├── vendor/      # Vendor-specific components
│   │   └── delivery/    # Delivery-specific components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API and service functions
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
└── ...
```

### Backend Architecture
The backend is built with Node.js, Express, and TypeScript, following a modular architecture:

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   │   ├── auth.ts      # Authentication controllers
│   │   ├── vendor.ts    # Vendor-related controllers
│   │   ├── delivery.ts  # Delivery-related controllers
│   │   └── customer.ts  # Customer-related controllers
│   ├── models/          # Database models
│   │   ├── user.ts      # User model (base for all user types)
│   │   ├── vendor.ts    # Vendor model
│   │   ├── delivery.ts  # Delivery partner model
│   │   └── order.ts     # Order model
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic
│   ├── middleware/      # Express middleware
│   ├── socket/          # Socket.IO handlers
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript type definitions
│   ├── config/          # Configuration files
│   └── server.ts        # Main server entry point
└── ...
```

## Data Models

### User
Base model for all user types:
```typescript
interface User {
  id: string;
  email: string;
  password: string; // Hashed
  name: string;
  phone: string;
  role: 'vendor' | 'delivery' | 'customer';
  createdAt: Date;
  updatedAt: Date;
}
```

### Vendor
```typescript
interface Vendor extends User {
  role: 'vendor';
  businessName: string;
  businessAddress: string;
  orders: Order[];
}
```

### Delivery Partner
```typescript
interface DeliveryPartner extends User {
  role: 'delivery';
  currentLocation: {
    lat: number;
    lng: number;
  };
  isAvailable: boolean;
  currentOrder: Order | null;
}
```

### Order
```typescript
interface Order {
  id: string;
  vendorId: string;
  customerId: string;
  deliveryPartnerId: string | null;
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}
```

## Authentication Flow

1. User submits login credentials
2. Backend validates credentials
3. If valid, backend generates JWT token
4. Token is returned to frontend
5. Frontend stores token in localStorage/cookies
6. Token is included in subsequent API requests
7. Backend middleware validates token for protected routes

## Real-time Communication Flow

### Location Updates
1. Delivery partner's browser gets location via Geolocation API
2. Location is sent to backend via Socket.IO
3. Backend validates and processes the location update
4. Backend broadcasts the update to relevant customers via Socket.IO
5. Customer's map component receives the update and refreshes the marker position

## API Endpoints

### Authentication
- `POST /api/auth/vendor/register`
- `POST /api/auth/vendor/login`
- `POST /api/auth/delivery/register`
- `POST /api/auth/delivery/login`
- `POST /api/auth/customer/register`
- `POST /api/auth/customer/login`

### Vendor
- `GET /api/vendor/orders` - Get all orders for a vendor
- `POST /api/vendor/orders/:orderId/assign` - Assign delivery partner to order

### Delivery Partner
- `GET /api/delivery/orders` - Get assigned orders
- `POST /api/delivery/orders/:orderId/status` - Update order status
- `POST /api/delivery/location/update` - Update current location

### Customer
- `GET /api/customer/orders` - Get customer orders
- `GET /api/customer/track/:orderId` - Get tracking information for an order

## Socket.IO Events

### Server to Client
- `location_update` - Sends updated location to customers
- `order_status_update` - Sends order status updates
- `new_order_assigned` - Notifies delivery partner of new assignment

### Client to Server
- `send_location` - Delivery partner sends current location
- `start_delivery` - Delivery partner starts the delivery process
- `complete_delivery` - Delivery partner completes the delivery

## Security Considerations

- JWT tokens for authentication
- HTTPS for all communications
- Input validation on all API endpoints
- Rate limiting to prevent abuse
- CORS configuration to restrict API access
- Environment variables for sensitive configuration
- Password hashing using bcrypt