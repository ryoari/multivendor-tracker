import { User, Order, TrackingInfo } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api';

// Helper function for API requests
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    console.log(`Making API request to: ${API_URL}${endpoint}`);
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error: any) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Auth API
export const authApi = {
  // Vendor auth
  registerVendor: (userData: any) => 
    fetchApi<User>('/auth/vendor/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  loginVendor: (credentials: { email: string; password: string }) => 
    fetchApi<User>('/auth/vendor/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  // Delivery partner auth
  registerDelivery: (userData: any) => 
    fetchApi<User>('/auth/delivery/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  loginDelivery: (credentials: { email: string; password: string }) => 
    fetchApi<User>('/auth/delivery/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
};

// Vendor API
export const vendorApi = {
  getOrders: () => 
    fetchApi<Order[]>('/vendor/orders'),
  
  assignDeliveryPartner: (orderId: string, deliveryPartnerId: string) => 
    fetchApi<{ message: string; order: Order }>(`/vendor/orders/${orderId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ deliveryPartnerId }),
    }),
  
  getAvailableDeliveryPartners: () => 
    fetchApi<any[]>('/vendor/delivery-partners/available'),
};

// Delivery Partner API
export const deliveryApi = {
  updateLocation: (location: { lat: number; lng: number }) => 
    fetchApi<{ message: string; location: { lat: number; lng: number } }>('/delivery/location/update', {
      method: 'POST',
      body: JSON.stringify(location),
    }),
  
  getCurrentOrder: () => 
    fetchApi<Order>('/delivery/order/current'),
  
  updateOrderStatus: (orderId: string, status: Order['status']) => 
    fetchApi<{ message: string; order: Order }>(`/delivery/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// Customer API
export const customerApi = {
  trackOrder: (orderId: string) => 
    fetchApi<TrackingInfo>(`/customer/track/${orderId}`),
};