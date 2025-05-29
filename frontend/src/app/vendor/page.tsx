"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { vendorApi } from '../../services/api';
import { Order } from '../../types';

export default function VendorDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deliveryPartners, setDeliveryPartners] = useState<any[]>([]);
  const [selectedDeliveryPartner, setSelectedDeliveryPartner] = useState<string>('');
  const [assigningOrder, setAssigningOrder] = useState<string | null>(null);

  useEffect(() => {
    // Fetch orders
    const fetchOrders = async () => {
      try {
        const data = await vendorApi.getOrders();
        setOrders(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleAssignClick = async (orderId: string) => {
    setAssigningOrder(orderId);
    
    try {
      // Fetch available delivery partners
      const partners = await vendorApi.getAvailableDeliveryPartners();
      setDeliveryPartners(partners);
      setSelectedDeliveryPartner(partners.length > 0 ? partners[0]._id : '');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch delivery partners');
    }
  };

  const handleAssignSubmit = async (orderId: string) => {
    if (!selectedDeliveryPartner) {
      setError('Please select a delivery partner');
      return;
    }

    try {
      await vendorApi.assignDeliveryPartner(orderId, selectedDeliveryPartner);
      
      // Update orders list
      const updatedOrders = orders.map(order => {
        if (order._id === orderId) {
          return {
            ...order,
            deliveryPartnerId: selectedDeliveryPartner,
            status: 'assigned'
          };
        }
        return order;
      });
      
      setOrders(updatedOrders);
      setAssigningOrder(null);

      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to assign delivery partner');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading orders...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vendor Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Orders</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your customer orders</p>
        </div>
        
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customerId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {order.status === 'pending' ? (
                        assigningOrder === order._id ? (
                          <div className="flex items-center space-x-2">
                            <select
                              className="border border-gray-300 rounded-md text-sm"
                              value={selectedDeliveryPartner}
                              onChange={(e) => setSelectedDeliveryPartner(e.target.value)}
                            >
                              {deliveryPartners.map((partner) => (
                                <option key={partner._id} value={partner._id}>
                                  {partner.name}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleAssignSubmit(order._id)}
                              className="text-indigo-600 hover:text-indigo-900 text-sm"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setAssigningOrder(null)}
                              className="text-gray-600 hover:text-gray-900 text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAssignClick(order._id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Assign Delivery
                          </button>
                        )
                      ) : order.deliveryPartnerId ? (
                        <Link
                          href={`/customer-tracking?orderId=${order._id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Track Order
                        </Link>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}