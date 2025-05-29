import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8">
          Multivendor Delivery Tracking Platform
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Vendor Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Vendor Dashboard</h2>
              <p className="text-gray-600 mb-4">
                Manage your orders and assign delivery partners to fulfill customer orders.
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                <li>View all your orders</li>
                <li>Assign delivery partners</li>
                <li>Track delivery status</li>
              </ul>
              <Link 
                href="/auth/login" 
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
              >
                Login as Vendor
              </Link>
            </div>
          </div>
          
          {/* Delivery Partner Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Delivery Partner</h2>
              <p className="text-gray-600 mb-4">
                Manage your deliveries and share your real-time location with customers.
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                <li>View assigned orders</li>
                <li>Share your location</li>
                <li>Update delivery status</li>
              </ul>
              <Link 
                href="/auth/login" 
                className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
              >
                Login as Delivery Partner
              </Link>
            </div>
          </div>
          
          {/* Customer Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Customer Tracking</h2>
              <p className="text-gray-600 mb-4">
                Track your order in real-time and see where your delivery partner is.
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                <li>Real-time location tracking</li>
                <li>Delivery status updates</li>
                <li>Estimated arrival time</li>
              </ul>
              <Link 
                href="/customer-tracking" 
                className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded"
              >
                Track Your Order
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex-1 p-4">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-medium mb-2">Vendor Assigns Delivery</h3>
              <p className="text-gray-600">Vendors assign available delivery partners to customer orders</p>
            </div>
            
            <div className="flex-1 p-4">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-medium mb-2">Delivery Partner Updates</h3>
              <p className="text-gray-600">Delivery partners share their real-time location during delivery</p>
            </div>
            
            <div className="flex-1 p-4">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-medium mb-2">Customer Tracks Order</h3>
              <p className="text-gray-600">Customers can track their order's progress in real-time on a map</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}