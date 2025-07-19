import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FaTimesCircle, FaCreditCard } from 'react-icons/fa';
import axiosInstance from '../../AuthContext/AxiosInstance';

function PaymentFailed() {
    const { orderNumber } = useParams();
    const { search } = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(search);

    const paymentIntent = params.get('payment_intent');
    const redirectStatus = params.get('redirect_status') || 'failed';

    // State to hold order details
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch order details when component mounts
    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/order/getOrderByOrderNumber', {
                    params: { orderNumber },
                });
                setOrderDetails(response.data); // Assuming response.data contains order details
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch order details. Please try again later.');
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderNumber]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p>Loading order details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
                <div className="text-center">
                    <FaTimesCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
                    <p className="text-gray-600 mb-8">
                        We couldn't process your payment for order #{orderNumber}
                    </p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <h2 className="text-xl font-semibold mb-4">Order Details</h2>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Order Number:</span>
                            <span className="font-medium">{orderNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Payment Intent:</span>
                            <span className="font-medium break-all">{paymentIntent || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Status:</span>
                            <span className="font-medium capitalize">{redirectStatus}</span>
                        </div>
                        {/* Bind additional order details from API */}
                        {orderDetails && (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Total Amount:</span>
                                    <span className="font-medium">
                                        {orderDetails.totalAmount ? `$${orderDetails.totalAmount.toFixed(2)}` : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Customer Name:</span>
                                    <span className="font-medium">{orderDetails.customerName || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Order Date:</span>
                                    <span className="font-medium">
                                        {orderDetails.orderDate
                                            ? new Date(orderDetails.orderDate).toLocaleDateString()
                                            : 'N/A'}
                                    </span>
                                </div>
                                {orderDetails.items && orderDetails.items.length > 0 && (
                                    <div>
                                        <span className="text-gray-500">Items:</span>
                                        <ul className="mt-2">
                                            {orderDetails.items.map((item, index) => (
                                                <li key={index} className="text-gray-700">
                                                    {item.name} (Qty: {item.quantity}) - ${item.price.toFixed(2)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="mt-8 space-y-4">
                        <button
                            onClick={() => navigate(`/order/${orderNumber}`)}
                            className="w-full flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                        >
                            <FaCreditCard className="mr-2" />
                            Retry Payment
                        </button>
                        <a href="/" className="block text-center text-blue-600 hover:underline">
                            Back to Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentFailed;