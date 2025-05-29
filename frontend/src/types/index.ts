// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'vendor' | 'delivery' | 'customer';
  token?: string;
}

export interface Vendor extends User {
  role: 'vendor';
  businessName: string;
  businessAddress: string;
}

export interface DeliveryPartner extends User {
  role: 'delivery';
  currentLocation?: {
    lat: number;
    lng: number;
  };
  isAvailable: boolean;
  currentOrder?: string | null;
}

// Order types
export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  vendorId: string;
  customerId: string;
  deliveryPartnerId: string | null;
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    }
  };
  createdAt: string;
  updatedAt: string;
}

// Tracking types
export interface TrackingInfo {
  orderId: string;
  status: Order['status'];
  deliveryPartner: {
    id: string;
    name: string;
    phone: string;
  } | null;
  location: {
    lat: number;
    lng: number;
  } | null;
}