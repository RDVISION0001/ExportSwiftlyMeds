import React, { useState } from 'react';
import { FiX, FiCheckCircle, FiClock, FiChevronDown, FiChevronUp } from 'react-icons/fi';

function Order() {
  // Sample orders data with different statuses
  const [orders, setOrders] = useState([
    {
      id: 'ORD-123456',
      date: '2023-05-15',
      status: 'Processing',
      items: [
        { id: 1, name: 'Wireless Headphones', price: 99.99, quantity: 1 },
        { id: 2, name: 'Phone Case', price: 19.99, quantity: 2 },
      ],
      total: 139.97,
      shippingAddress: '123 Main St, Cityville, CA 90210',
      estimatedDelivery: '2023-05-25'
    },
    {
      id: 'ORD-789012',
      date: '2023-05-10',
      status: 'Completed',
      items: [
        { id: 3, name: 'Smart Watch', price: 199.99, quantity: 1 },
        { id: 4, name: 'Screen Protector', price: 9.99, quantity: 1 },
      ],
      total: 209.98,
      shippingAddress: '456 Oak Ave, Townsville, NY 10001',
      deliveryDate: '2023-05-18'
    },
    {
      id: 'ORD-345678',
      date: '2023-04-28',
      status: 'Cancelled',
      items: [
        { id: 5, name: 'Bluetooth Speaker', price: 79.99, quantity: 1 },
      ],
      total: 79.99,
      shippingAddress: '789 Pine Rd, Villageton, TX 75001',
      cancellationDate: '2023-04-30'
    }
  ]);

  const [filter, setFilter] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(null);

  const filteredOrders = filter === 'All' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'Processing':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}><FiClock className="inline mr-1" /> Processing</span>;
      case 'Completed':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}><FiCheckCircle className="inline mr-1" /> Completed</span>;
      case 'Cancelled':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}><FiX className="inline mr-1" /> Cancelled</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCancelOrder = (orderId) => {
    setShowCancelModal(orderId);
  };

  const confirmCancel = () => {
    setOrders(orders.map(order => 
      order.id === showCancelModal 
        ? { ...order, status: 'Cancelled', cancellationDate: new Date().toISOString().split('T')[0] } 
        : order
    ));
    setShowCancelModal(null);
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="order-page container mx-auto p-4 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button 
            onClick={() => setFilter('All')}
            className={`px-4 cursor-pointer py-2 rounded-md text-sm font-medium ${filter === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            All Orders
          </button>
          <button 
            onClick={() => setFilter('Processing')}
            className={`px-4 cursor-pointer py-2 rounded-md text-sm font-medium ${filter === 'Processing' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Processing
          </button>
          <button 
            onClick={() => setFilter('Completed')}
            className={`px-4 cursor-pointer py-2 rounded-md text-sm font-medium ${filter === 'Completed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Completed
          </button>
          <button 
            onClick={() => setFilter('Cancelled')}
            className={`px-4 cursor-pointer py-2 rounded-md text-sm font-medium ${filter === 'Cancelled' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No {filter.toLowerCase()} orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div 
                className="p-4 border-b cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                onClick={() => toggleOrderDetails(order.id)}
              >
                <div className="flex items-center space-x-4 px-2">
                  {/* <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 overflow-hidden">
                    #{order.id.split('-')[1]}
                  </div> */}
                  <div>
                    <p className="font-medium">Order Placed: {order.date}</p>
                    <p className="text-sm text-gray-500">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''} • ${calculateTotal(order.items).toFixed(2)}
                    </p>
                    <p>{order.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div>{getStatusBadge(order.status)}</div>
                  {expandedOrder === order.id ? <FiChevronUp /> : <FiChevronDown />}
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Shipping Information</h3>
                      <p className="text-gray-800">{order.shippingAddress}</p>
                      {order.status === 'Processing' && order.estimatedDelivery && (
                        <p className="text-sm text-gray-500 mt-2">
                          Estimated delivery: {order.estimatedDelivery}
                        </p>
                      )}
                      {order.status === 'Completed' && order.deliveryDate && (
                        <p className="text-sm text-gray-500 mt-2">
                          Delivered on: {order.deliveryDate}
                        </p>
                      )}
                      {order.status === 'Cancelled' && order.cancellationDate && (
                        <p className="text-sm text-gray-500 mt-2">
                          Cancelled on: {order.cancellationDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Order Summary</h3>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {order.items.map(item => (
                              <tr key={item.id}>
                                <td className="px-4 py-3 whitespace-nowrap">{item.name}</td>
                                <td className="px-4 py-3 whitespace-nowrap">${item.price.toFixed(2)}</td>
                                <td className="px-4 py-3 whitespace-nowrap">{item.quantity}</td>
                                <td className="px-4 py-3 whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="px-4 py-3 bg-gray-50 flex justify-between font-medium">
                          <span>Order Total</span>
                          <span>${calculateTotal(order.items).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {order.status === 'Processing' && (
                    <div className="flex justify-end">
                      <button 
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-4 py-2 bg-white border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Order Cancellation</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to cancel this order? This action cannot be undone. Any payment made will be refunded according to our policy.
            </p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setShowCancelModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
              <button 
                onClick={confirmCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;