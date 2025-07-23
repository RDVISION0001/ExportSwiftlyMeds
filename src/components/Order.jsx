import React, { useEffect, useState } from 'react';
import axiosInstance from '../AuthContext/AxiosInstance';
import { useAuth } from '../AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  FiShoppingBag,
  FiArrowRight,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiPackage,
  FiChevronRight
} from 'react-icons/fi';
import { PulseLoader } from 'react-spinners';

function Order({ onClose }) {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getOrderHistory();
  }, []);

  const getOrderHistory = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/swift/cart/order/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data.slice().reverse());
      console.log("order", res.data)
    } catch (error) {
      console.error('Error fetching order history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusDetails = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'placed':
        return {
          icon: <FiClock className="text-yellow-500" />,
          color: 'bg-yellow-100 text-yellow-800',
          text: 'Order Placed'
        };
      case 'shipped':
        return {
          icon: <FiTruck className="text-blue-500" />,
          color: 'bg-blue-100 text-blue-800',
          text: 'Shipped'
        };
      case 'delivered':
        return {
          icon: <FiCheckCircle className="text-green-500" />,
          color: 'bg-green-100 text-green-800',
          text: 'Delivered'
        };
      default:
        return {
          icon: <FiPackage className="text-gray-500" />,
          color: 'bg-gray-100 text-gray-800',
          text: status
        };
    }
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const continueShopping = () => {
    onClose();
    navigate('/CatProduct');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <PulseLoader color="#3B82F6" size={12} />
        <p className="text-gray-600 mt-4">Loading your order history...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FiShoppingBag className="text-blue-600" />
          <span>Order History</span>
        </h1>
        <button
          onClick={continueShopping}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors"
        >
          Continue Shopping <FiArrowRight size={16} />
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="bg-blue-50 p-6 rounded-full mb-4">
            <FiShoppingBag className="text-blue-600 text-4xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h2>
          <p className="text-gray-600 max-w-md mb-6">
            You haven't placed any orders. Start shopping to see your orders here.
          </p>
          <button
            onClick={continueShopping}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md flex items-center gap-2 transition-colors text-sm font-medium"
          >
            Browse Products <FiArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.orderId} className="bg-white rounded-lg shadow-xs border border-gray-200 overflow-hidden">
              <div
                className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleOrderExpand(order.orderId)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getStatusDetails(order.status).icon}
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900">Order #{order.orderId}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <FiCalendar size={14} /> {formatDate(order.orderDate)}
                      </p>
                      <div className="mt-2">
                        <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${getStatusDetails(order.status).color}`}>
                          {getStatusDetails(order.status).text}
                        </span>
                      </div>

                    </div>
                  </div>
                  <div className="text-right">
                    <div className='mb-2'>
                      {order.logisticsCost > 0 && (
                        <p className='text-gray-600 text-sm flex justify-between'>
                          <span>Logistics Fee:</span>
                          <span>${order.logisticsCost.toFixed(2)}</span>
                        </p>
                      )}
                      {order.platformFee > 0 && (
                        <p className='text-gray-600 text-sm flex justify-between'>
                          <span>Platform Fee:</span>
                          <span>${order.platformFee.toFixed(2)}</span>
                        </p>
                      )}
                    </div>
                    <div className="text-lg font-bold text-gray-900 flex items-center justify-end gap-1">
                      <FiDollarSign size={16} className="text-gray-500" />
                      {(order.total + order.logisticsCost + order.platformFee).toFixed(2)}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-2">
                      <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                      <FiChevronRight
                        className={`transition-transform ${expandedOrder === order.orderId ? 'rotate-90' : ''}`}
                        size={16}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {expandedOrder === order.orderId && (
                <div className="border-t border-gray-200 px-5 py-4">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-gray-700 mb-2">
                      <FiMapPin className="text-gray-400" />
                      <span className="text-sm font-medium">Shipping address:</span>
                    </div>
                    <p className="text-sm text-gray-600 pl-6">{order.shippingTo}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Order Items</h4>
                    <ul className="divide-y divide-gray-100">
                      {order.items.map((item, index) => (
                        <li key={index} className="py-3 flex justify-between">
                          <div className="flex items-start gap-3">
                            <div className="bg-gray-100 rounded-md w-12 h-12 flex items-center justify-center">
                              <FiPackage className="text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{item.productName}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                {item.quantity} × {item.pricePerUnit.toFixed(2)} {item.unitLabel}
                              </p>
                            </div>
                          </div>
                          <div className="font-medium text-gray-900">
                            {(item.quantity * item.pricePerUnit).toFixed(2)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Order;