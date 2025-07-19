import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { FaBox, FaPhoneAlt, FaEnvelope, FaHome, FaShoppingBag, FaShippingFast, FaUser, FaMapMarkerAlt, FaReceipt, FaCheckCircle } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import Confetti from 'react-confetti';
import axiosInstance from '../../AuthContext/AxiosInstance';

function PaymentSuccess() {
    const { orderNumber } = useParams();
    const { search } = useLocation();
    const params = new URLSearchParams(search);

    const paymentIntent = params.get('payment_intent');
    const redirectStatus = params.get('redirect_status') || 'succeeded';

    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfetti, setShowConfetti] = useState(true);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/order/getOrderByOrderNumber', {
                    params: { orderNumber },
                });
                // Map the API response to the orderDetails state
                setOrderDetails({
                    ...response.data.dto, // Main order details
                    payment: response.data.payment // Payment details
                });
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch order details. Please try again later.');
                setLoading(false);
            }
        };

        fetchOrderDetails();

        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [orderNumber]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your order details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                <div className="max-w-md bg-white rounded-xl shadow-lg p-6 text-center">
                    <div className="text-red-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <a
                        href="/"
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <FaHome className="mr-2" /> Return Home
                    </a>
                </div>
            </div>
        );
    }

    const formatDateTime = (dateString, timeString) => {
        const date = new Date(`${dateString}T${timeString}`);
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPaymentStatusBadge = (status) => {
        const baseClass = "inline-block px-3 py-1 text-sm font-semibold rounded-full capitalize";
        switch (status) {
            case "CHECKOUT_SUCCEEDED":
                return <span className={`${baseClass} bg-green-100 text-green-700`}>Succeeded</span>;
            case "FAILED":
                return <span className={`${baseClass} bg-red-100 text-red-700`}>Failed</span>;
            default:
                return <span className={`${baseClass} bg-gray-200 text-gray-700`}>{status || "Unknown"}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 relative overflow-hidden">
            {showConfetti && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    numberOfPieces={200}
                    recycle={false}
                    gravity={0.2}
                    colors={['#10B981', '#059669', '#047857', '#065F46']}
                />
            )}

            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-green-200 opacity-10"
                        style={{
                            width: `${Math.random() * 200 + 100}px`,
                            height: `${Math.random() * 200 + 100}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            transform: `translate(-50%, -50%)`,
                        }}
                    ></div>
                ))}
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8 transform transition-all hover:shadow-2xl">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center text-white">
                        <div className="inline-flex items-center justify-center w-18 h-18 bg-green-500 rounded-full">
                            <FaCheckCircle className="text-white w-12 h-12" />
                        </div>

                        <h1 className="text-3xl font-bold mb-2">Payment Successful! </h1>
                        <p className="text-white text-opacity-90">
                            Thank you for your order #{orderDetails?.orderNumber}. A confirmation email has been sent to {orderDetails?.createdBy?.email}.
                        </p>
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-green-50 rounded-lg p-4 flex items-center border border-green-100">
                                <div className="bg-green-100 p-3 rounded-full mr-4">
                                    <FaShoppingBag className="text-green-600 text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Order Number</h3>
                                    <p className="text-gray-600">{orderDetails?.orderNumber}</p>
                                </div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 flex items-center border border-green-100">
                                <div className="bg-green-100 p-3 rounded-full mr-4">
                                    <IoMdTime className="text-green-600 text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Order Date & Time</h3>
                                    <p className="text-gray-600">
                                        {orderDetails?.createdAt && orderDetails?.createTime
                                            ? formatDateTime(orderDetails.createdAt, orderDetails.createTime)
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 flex items-center border border-green-100">
                                <div className="bg-green-100 p-3 rounded-full mr-4">
                                    <FaReceipt className="text-green-600 text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Payment Status</h3>
                                    {getPaymentStatusBadge(orderDetails?.payment?.status)}
                                </div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 flex items-center border border-green-100">
                                <div className="bg-green-100 p-3 rounded-full mr-4">
                                    <FaShippingFast className="text-green-600 text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Tracking Number</h3>
                                    <p className="text-gray-600">{orderDetails?.trackingNumber || 'Not available yet'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Order Summary</h2>
                            <div className="space-y-4">
                                {orderDetails?.orderItems?.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 hover:bg-green-50 rounded-lg transition-colors border border-green-100">
                                        <div className="flex items-center">
                                            <div className="w-16 h-16 bg-green-100 rounded-md mr-4 overflow-hidden flex items-center justify-center">
                                                {item.product?.imageUrls?.[0] ? (
                                                    <img
                                                        src={item.product.imageUrls[0]}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <FaBox className="text-green-600 text-xl" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">{item.product?.name || 'Product'}</h4>
                                                <p className="text-sm text-gray-500">
                                                    {item.product?.packagingType && `${item.product.packagingType} • `}
                                                    Qty: {item.quantity}
                                                </p>
                                                {item.product?.brand && (
                                                    <p className="text-xs text-gray-400 mt-1">Brand: {item.product.brand}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-800">
                                                {orderDetails.currency} {(item.price * item.quantity).toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-500">{orderDetails.currency} {item.price.toFixed(2)} each</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-6 mb-8 border border-green-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Total</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">
                                        {orderDetails?.currency} {orderDetails?.totalAmount ? (orderDetails.totalAmount - orderDetails.discount - orderDetails.logisticsCost - orderDetails.otherCharges).toFixed(2) : '0.00'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Discount</span>
                                    <span className="font-medium text-green-600">
                                        -{orderDetails?.currency} {orderDetails?.discount?.toFixed(2) || '0.00'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">{orderDetails?.currency} {orderDetails?.logisticsCost?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Other Charges</span>
                                    <span className="font-medium">{orderDetails?.currency} {orderDetails?.otherCharges?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-green-200">
                                    <span className="text-lg font-semibold">Total</span>
                                    <span className="text-lg font-bold text-green-600">
                                        {orderDetails?.currency} {orderDetails?.totalAmount?.toFixed(2) || '0.00'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <FaUser className="text-green-500 mr-2" /> Customer Information
                                </h3>
                                <div className="space-y-2">
                                    <p className="text-gray-800">
                                        <span className="font-medium">{orderDetails?.createdBy?.firstName} {orderDetails?.createdBy?.lastName}</span>
                                    </p>
                                    <p className="text-gray-800">
                                        <span className="inline-flex items-center">
                                            <FaEnvelope className="mr-2 text-green-500" />
                                            {orderDetails?.createdBy?.email || 'customer@example.com'}
                                        </span>
                                    </p>
                                    {orderDetails?.createdBy?.phoneNumber && (
                                        <p className="text-gray-800">
                                            <span className="inline-flex items-center">
                                                <FaPhoneAlt className="mr-2 text-green-500" />
                                                {orderDetails.createdBy.phoneNumber}
                                            </span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <FaMapMarkerAlt className="text-green-500 mr-2" /> Shipping Address
                                </h3>
                                {orderDetails?.deliveryAddress ? (
                                    <div className="text-gray-800 space-y-2">
                                        <p>{orderDetails.deliveryAddress.street}</p>
                                        <p>{orderDetails.deliveryAddress.city}, {orderDetails.deliveryAddress.state}</p>
                                        <p>{orderDetails.deliveryAddress.postalCode}</p>
                                        <p>{orderDetails.deliveryAddress.country}</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Address Type: <span className="capitalize">{orderDetails.deliveryAddress.addressType?.toLowerCase()}</span>
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-gray-600">No shipping address provided</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-600">Payment Method</p>
                                    <p className="font-medium text-gray-800">{orderDetails?.payment?.paymentThrough || 'Credit Card (Stripe)'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Payment Intent ID</p>
                                    <p className="font-medium text-gray-800 break-all">{orderDetails?.payment?.paymentIntentId || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Amount Paid</p>
                                    <p className="font-medium text-gray-800">
                                        {orderDetails?.payment?.currency?.toUpperCase()} {orderDetails?.payment?.amount?.toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Payment Date</p>
                                    <p className="font-medium text-gray-800">
                                        {orderDetails?.payment?.createdAt
                                            ? new Date(orderDetails.payment.createdAt).toLocaleString()
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentSuccess;