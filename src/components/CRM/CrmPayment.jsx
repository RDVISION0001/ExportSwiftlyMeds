import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../AuthContext/AxiosInstance';
import { FaLock, FaCheckCircle, FaCertificate, FaShieldAlt, FaEnvelope, FaClock, FaRegHeart, FaFileAlt, FaArrowLeft, FaArrowRight, FaEdit, FaStar, FaQuestionCircle, FaPhoneAlt } from 'react-icons/fa';
import CheckoutButton from './CheckoutButton';
import Swal from 'sweetalert2';

function CrmPayment() {
    const { orderNumber } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImages, setSelectedImages] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showPaymentMessage, setShowPaymentMessage] = useState(false);
    const [activeTab, setActiveTab] = useState('Cart');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [orderStatus, setOrderStatus] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        ticketId: '',
        statusId: 1,
        orderId: ''
    });
    const [isEdit, setIsEdit] = useState(false);

    const tabs = ['Cart', 'Details', 'Confirmation'];

    const fetchOrder = async (retryCount = 0) => {
        try {
            console.log('Fetching order with orderNumber:', orderNumber);
            const response = await axiosInstance.get('/order/getOrderByOrderNumber', {
                params: { orderNumber },
            });
            if (!response.data || !response.data.dto) {
                throw new Error('Invalid response structure: Missing order data');
            }
            setOrder({
                ...response.data,
                dto: {
                    ...response.data.dto,
                    payment: response.data.dto.payment
                }
            });
            setDeliveryAddress(prev => ({
                ...prev,
                ticketId: response.data.dto.ticket?.id || '',
                orderId: response.data.dto.id || ''
            }));
                // Safely set order and payment status
            setOrderStatus(response.data.dto.status || 'UNKNOWN');
            setPaymentStatus(response.data.payment?.status || 'UNKNOWN');
        } catch (err) {
            if (err.response?.status === 404) {
                setError('Order not found. Please check the order number and try again.');
            } else if (retryCount < 2 && err.message.includes('Network Error')) {
                console.warn(`Retrying fetchOrder (attempt ${retryCount + 1})...`);
                return new Promise(resolve => setTimeout(resolve, 1000)).then(() => fetchOrder(retryCount + 1));
            } else if (err.response?.status === 500) {
                setError('Server error. Please try again later or contact support.');
            } else {
                setError('Failed to fetch order details. Please try again.');
            }
            console.error('Error response:', err.response);
            throw err;
        }
    };

    useEffect(() => {
        if (!orderNumber || !/^[a-zA-Z0-9-]+$/.test(orderNumber)) {
            setError('Invalid order number format. Please provide a valid order number.');
            setLoading(false);
            return;
        }

        const queryParams = new URLSearchParams(window.location.search);
        const redirectStatus = queryParams.get('redirect_status');

        if (redirectStatus === 'succeeded') {
            navigate(`/success/${orderNumber}${window.location.search}`, { replace: true });
            return;
        } else if (redirectStatus === 'failed') {
            navigate(`/failed/${orderNumber}${window.location.search}`, { replace: true });
            return;
        }

        setLoading(true);
        fetchOrder().finally(() => setLoading(false));
    }, [orderNumber, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDeliveryAddress(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await axiosInstance.put("/address/updateAddress", deliveryAddress);
            } else {
                await axiosInstance.post("/order/addDeliveryAddressToOrder", deliveryAddress);
            }
            setIsEdit(false);
            setLoading(true);
            await fetchOrder();
            setLoading(false);
        } catch (err) {
            console.error('Error saving address:', err);
            Swal.fire({
                title: 'Error',
                text: 'Failed to save delivery address. Please try again.',
                icon: 'error',
            });
        }
    };

    const openImageModal = (images) => {
        setSelectedImages(images);
        setCurrentImageIndex(0);
    };

    const closeImageModal = () => {
        setSelectedImages(null);
        setCurrentImageIndex(0);
    };

    const nextImage = () => {
        if (selectedImages && currentImageIndex < selectedImages.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    const prevImage = () => {
        if (selectedImages && currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const handleProceedToPayment = () => {
        setShowPaymentMessage(true);
        setShowPaymentModal(true);
        setTimeout(() => setShowPaymentMessage(false), 3000);
    };

    const closePaymentModal = () => {
        setShowPaymentModal(false);
    };

    const handleNext = () => {
        if (!order?.dto?.deliveryAddress) {
            Swal.fire({
                title: "Delivery Address?",
                text: "Please add a delivery address first then you will be able to checkout",
                icon: "info"
            });
            return;
        }
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex < tabs.length - 1) {
            if (activeTab === 'Details') {
                handleProceedToPayment();
            } else {
                setActiveTab(tabs[currentIndex + 1]);
            }
        }
    };

    const handlePrevious = () => {
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex > 0) {
            setActiveTab(tabs[currentIndex - 1]);
        }
    };

    const getCheckoutButton = () => {
        const successUrl = `${window.location.origin}/success/${orderNumber}`;
        const failureUrl = `${window.location.origin}/failed/${orderNumber}`;

        return (
            <CheckoutButton
                orderNumber={orderNumber}
                remark={order.dto.remark}
                successUrl={successUrl}
                failureUrl={failureUrl}
            />
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-lg text-gray-700">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-600 text-lg font-semibold">
                <div className="text-center">
                    <p>{error}</p>
                    <p className="mt-4">
                        <a href="/" className="text-blue-600 hover:underline">Return to Homepage</a>
                        {' or '}
                        <a href="mailto:support@swiftymeds.com" className="text-blue-600 hover:underline">Contact Support</a>
                    </p>
                </div>
            </div>
        );
    }

    if (!order || !order.dto) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center text-lg text-gray-700">
                No order found for this order number.
            </div>
        );
    }

    const products = order.dto.orderItems.map((item) => ({
        id: item.id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        strength: item.product.strength || 'Unknown',
        image: item.product.imageUrls?.[0] || 'https://placehold.co/100x100/E0E0E0/333333?text=No+Image',
        imageUrls: item.product.imageUrls || ['https://placehold.co/100x100/E0E0E0/333333?text=No+Image'],
    }));

    const subtotal = order.dto.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = order.dto.discount || 0;
    const logisticsCost = order.dto.logisticsCost || 0;
    const otherCharges = order.dto.otherCharges || 0;
    const total = order.dto.totalAmount - discount;

    return (
        <div className="container mx-auto p-8 bg-white rounded-lg shadow-xl max-w-7xl my-8">
            <div className="flex flex-wrap justify-around items-center pb-5 border-b border-gray-200 mb-8 gap-4 text-center">
                <div className="flex items-center text-green-600 font-semibold text-sm sm:text-base border border-green-600 px-3 py-2 rounded-md">
                    <FaLock className="mr-2 text-lg" /> SSL Secured
                </div>
                <div className="flex items-center text-green-600 font-semibold text-sm sm:text-base border border-green-600 px-3 py-2 rounded-md">
                    <FaCheckCircle className="mr-2 text-lg" /> HIPAA Compliant
                </div>
                <div className="flex items-center text-green-600 font-semibold text-sm sm:text-base border border-green-600 px-3 py-2 rounded-md">
                    <FaCertificate className="mr-2 text-lg" /> LegitScript Verified
                </div>
                <div className="flex items-center text-green-600 font-semibold text-sm sm:text-base border border-green-600 px-3 py-2 rounded-md">
                    <FaShieldAlt className="mr-2 text-lg" /> PCI DSS Compliant
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3">
                    {activeTab === 'Cart' && (
                        <>
                            <h2 className="text-gray-800 mb-5 text-2xl font-semibold flex items-center">
                                <FaRegHeart className="text-red-500 mr-2" /> Your Medications
                            </h2>
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <div key={product.id} className="flex items-center border border-gray-300 rounded-lg p-4 mb-5 bg-gray-50 shadow-sm">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-20 h-20 object-cover rounded-md mr-4 cursor-pointer"
                                            onClick={() => openImageModal(product.imageUrls)}
                                        />
                                        <div className="flex-grow">
                                            <h3 className="m-0 text-gray-800 text-lg font-semibold">{product.name}</h3>
                                            <p className="m-0 text-gray-600 text-sm">Strength: {product.strength}</p>
                                            <p className="m-0 text-gray-600 text-sm">Quantity: {product.quantity} tablets</p>
                                            <p className="text-red-600 font-bold text-xs mt-2 flex items-center">
                                                <FaFileAlt className="mr-1" /> Prescription Required
                                            </p>
                                        </div>
                                        <div className="text-right whitespace-nowrap">
                                            <span className="block text-purple-700 font-bold text-2xl">{order.dto.currency} {product.price.toFixed(2)}</span>
                                            <small className="text-gray-500 text-xs">per unit</small>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-600 text-center py-8 border border-gray-300 rounded-lg bg-gray-50">
                                    No medication details available.
                                </div>
                            )}
                            {orderStatus === "PENDING" && (
                                <div className="mb-8">
                                    <label htmlFor="coupon-code" className="block mb-2 font-semibold text-gray-700">Coupon Code</label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            id="coupon-code"
                                            placeholder="Enter coupon code"
                                            className="flex-grow p-3 border border-gray-300 rounded-l-md text-base outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                                        />
                                        <button className="bg-purple-700 text-white px-6 py-3 rounded-r-md cursor-pointer text-base font-medium transition-colors duration-300 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2">
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {(!order.dto.deliveryAddress || isEdit) ? (
                        <form onSubmit={handleSubmit} className="mx-auto bg-white shadow-md rounded-lg p-6 space-y-4">
                            <h2 className="text-xl font-semibold text-gray-700">
                                {isEdit ? "Edit Delivery Address" : "Add Delivery Address"}
                            </h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Street</label>
                                <input
                                    type="text"
                                    name="street"
                                    value={deliveryAddress.street}
                                    onChange={handleChange}
                                    className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={deliveryAddress.city}
                                        onChange={handleChange}
                                        className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={deliveryAddress.state}
                                        onChange={handleChange}
                                        className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={deliveryAddress.postalCode}
                                        onChange={handleChange}
                                        className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={deliveryAddress.country}
                                        onChange={handleChange}
                                        className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 cursor-pointer"
                            >
                                {isEdit ? "Update Address" : "Submit Address"}
                            </button>
                        </form>
                    ) : (
                        <div className="flex flex-wrap gap-4 mt-6">
                            <div className="border-2 border-orange-400 p-4 max-w-sm bg-white rounded-md shadow-sm relative">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-gray-800">Delivery Address</h3>
                                    {orderStatus === "PENDING" && (
                                        <button
                                            onClick={() => {
                                                setDeliveryAddress(order.dto.deliveryAddress);
                                                setIsEdit(true);
                                            }}
                                            className="text-blue-600 hover:text-blue-800 focus:outline-none"
                                            aria-label="Edit delivery address"
                                        >
                                            <FaEdit className="text-lg" />
                                        </button>
                                    )}
                                </div>
                                <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                                    {order.dto.deliveryAddress.street}
                                    <br />
                                    {order.dto.deliveryAddress.city}, {order.dto.deliveryAddress.state}
                                    <br />
                                    {order.dto.deliveryAddress.postalCode}
                                    <br />
                                    {order.dto.deliveryAddress.country}
                                </div>
                            </div>
                            <div className="border-2 border-orange-400 p-4 max-w-sm bg-white rounded-md shadow-sm relative">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-gray-800">Customer Details</h3>
                                </div>
                                <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                                    <p><strong>Name:</strong> {order.dto.ticket.senderName}</p>
                                    <p><strong>Email:</strong> {order.dto.ticket.senderEmail}</p>
                                    <p><strong>Mobile:</strong> {order.dto.ticket.senderMobile}</p>
                                    <p><strong>Company:</strong> {order.dto.ticket.senderCompany}</p>
                                    <p><strong>Address:</strong> {order.dto.ticket.senderAddress}, {order.dto.ticket.senderCity}, {order.dto.ticket.senderState}, {order.dto.ticket.senderPincode}, {order.dto.ticket.senderCountryIso}</p>
                                    <p><strong>Payment Status:</strong> <span className={paymentStatus === 'FAILED' ? 'text-red-600' : 'text-green-600'}>{paymentStatus}</span></p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Details' && (
                        <>
                            <h2 className="text-gray-800 mb-5 text-2xl font-semibold">Order Details</h2>
                            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                                <p className="text-gray-700"><strong>Order Number:</strong> {order.dto.orderNumber}</p>
                                <p className="text-gray-700"><strong>Created At:</strong> {order.dto.createdAt} {order.dto.createTime}</p>
                                <p className="text-gray-700"><strong>Created By:</strong> {order.dto.createdBy.firstName} {order.dto.createdBy.lastName}</p>
                                <p className="text-gray-700"><strong>Status:</strong> {order.dto.status}</p>
                                <p className="text-gray-700"><strong>Total Amount:</strong> {order.dto.currency} {total.toFixed(2)}</p>
                            </div>
                        </>
                    )}

                    {activeTab === 'Confirmation' && (
                        <>
                            <h2 className="text-gray-800 mb-5 text-2xl font-semibold">Order Confirmation</h2>
                            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                                <p className="text-gray-700 mb-4">Your order has been successfully placed!</p>
                                <p className="text-gray-700"><strong>Order Number:</strong> {order.dto.orderNumber}</p>
                                <p className="text-gray-700"><strong>Total Amount:</strong> {order.dto.currency} {total.toFixed(2)}</p>
                                <p className="text-gray-700">You will receive a confirmation email soon.</p>
                            </div>
                        </>
                    )}

                    <div className="bg-purple-700 rounded-lg p-6 text-white mt-8 shadow-md">
                        <h3 className="text-center text-xl font-semibold mb-5">Order Summary</h3>
                        <div className="flex justify-between mb-3 text-base">
                            <span>Subtotal</span>
                            <span>{order.dto.currency} {subtotal.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between mb-3 text-base">
                                <span>Discount</span>
                                <span className="text-green-300">-{order.dto.currency} {discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between mb-3 text-base">
                            <span>Logistics Cost</span>
                            <span>{order.dto.currency} {logisticsCost.toFixed(2)} (Inc)</span>
                        </div>
                        <div className="flex justify-between mb-3 text-base">
                            <span>Taxes</span>
                            <span>{order.dto.currency} {otherCharges.toFixed(2)} (Inc)</span>
                        </div>
                        <div className="flex justify-between mt-5 pt-4 border-t border-dashed border-purple-400 text-2xl font-bold">
                            <span>Total</span>
                            <span>{order.dto.currency} {total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="lg:w-1/3">
                    <div className="bg-purple-700 rounded-lg p-6 text-white shadow-md">
                        <h3 className="text-center text-xl font-semibold mb-5">Order Summary</h3>
                        {order.dto.orderItems.map((item) => (
                            <div key={item.id} className="flex justify-between mb-3 text-base">
                                <span>{item.product.name}</span>
                                <span>{order.dto.currency} {item.price.toFixed(2)}</span>
                            </div>
                        ))}
                        {discount > 0 && (
                            <div className="flex justify-between mb-3 text-base">
                                <span>Discount</span>
                                <span className="text-green-300">-{order.dto.currency} {discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between mb-3 text-base">
                            <span>Logistics Cost</span>
                            <span>{order.dto.currency} {logisticsCost.toFixed(2)} (Inc)</span>
                        </div>
                        <div className="flex justify-between mb-3 text-base">
                            <span>Taxes</span>
                            <span>{order.dto.currency} {otherCharges.toFixed(2)} (Inc)</span>
                        </div>
                        <div className="flex justify-between mt-5 pt-4 border-t border-dashed border-purple-400 text-2xl font-bold">
                            <span>Total</span>
                            <span>{order.dto.currency} {total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                        <h3 className="text-gray-800 text-xl font-semibold mb-5 text-center">Customer Reviews</h3>
                        <div className="mb-5 border-b border-gray-100 pb-5 last:mb-0 last:border-b-0 last:pb-0">
                            <div className="text-yellow-400 mb-1">
                                <FaStar className="inline-block" /><FaStar className="inline-block" /><FaStar className="inline-block" /><FaStar className="inline-block" /><FaStar className="inline-block" />
                            </div>
                            <p className="m-0 text-gray-700 italic text-sm">"Fast delivery and great service!"</p>
                            <small className="text-gray-600 font-bold text-xs">- Sarah M.</small>
                        </div>
                        <div>
                            <div className="text-yellow-400 mb-1">
                                <FaStar className="inline-block" /><FaStar className="inline-block" /><FaStar className="inline-block" /><FaStar className="inline-block" /><FaStar className="inline-block" />
                            </div>
                            <p className="m-0 text-gray-700 italic text-sm">"Trusted pharmacy with excellent support."</p>
                            <small className="text-gray-600 font-bold text-xs">- Mike R.</small>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                        <h3 className="text-gray-800 text-xl font-semibold mb-5 text-center flex items-center justify-center">
                            <FaQuestionCircle className="text-purple-700 mr-2" /> Need Help?
                        </h3>
                        <p className="m-0 mb-3 text-gray-700 flex items-center text-sm">
                            <FaPhoneAlt className="text-purple-700 mr-2" /> (555) 123-4567
                        </p>
                        <p className="m-0 mb-3 text-gray-700 flex items-center text-sm">
                            <FaEnvelope className="text-purple-700 mr-2" /> <a href="mailto:support@swiftymeds.com" className="text-purple-700 hover:underline">support@swiftymeds.com</a>
                        </p>
                        <p className="m-0 text-gray-700 flex items-center text-sm">
                            <FaClock className="text-purple-700 mr-2" /> 24/7 Support Available
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-10 pt-5 border-t border-gray-200">
                <button
                    className={`px-6 py-3 rounded-md cursor-pointer text-base font-medium flex items-center gap-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${activeTab === 'Cart' ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-300'
                        }`}
                    onClick={handlePrevious}
                    disabled={activeTab === 'Cart'}
                >
                    <FaArrowLeft className="text-sm" /> Previous
                </button>
                {orderStatus === "PENDING" && (
                    <button
                        className={`px-6 py-3 rounded-md cursor-pointer text-base font-medium flex items-center gap-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${activeTab === 'Confirmation' ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                            }`}
                        onClick={handleNext}
                        disabled={activeTab === 'Confirmation'}
                    >
                        {activeTab === 'Details' ? 'Proceed to Payment' : 'Next'} <FaArrowRight className="text-sm" />
                    </button>
                )}
            </div>

            {showPaymentMessage && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                    Proceeding to payment gateway...
                </div>
            )}

            {showPaymentModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-brightness-50">
                    <div className="bg-white p-6 rounded-lg flex-col items-center relative">
                        <button
                            className="absolute top-2 right-2 text-red-500 bg-red-100 rounded-3xl hover:text-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-900 focus:ring-offset-2"
                            onClick={closePaymentModal}
                            aria-label="Close payment modal"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <h2 className="text-gray-800 mb-5 text-2xl font-semibold">Payment Information</h2>
                        {getCheckoutButton()}
                    </div>
                </div>
            )}

            {selectedImages && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-4 rounded-lg max-w-3xl w-full flex flex-col items-center">
                        <img
                            src={selectedImages[currentImageIndex]}
                            alt={`Product view ${currentImageIndex + 1}`}
                            className="max-w-full max-h-[60vh] object-contain mx-auto rounded-md shadow-md"
                        />
                        <div className="flex justify-between w-full mt-4">
                            <button
                                className={`px-4 py-2 rounded-lg transition duration-200 ${currentImageIndex === 0 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                onClick={prevImage}
                                disabled={currentImageIndex === 0}
                            >
                                Previous
                            </button>
                            <button
                                className={`px-4 py-2 rounded-lg transition duration-200 ${currentImageIndex === selectedImages.length - 1 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                onClick={nextImage}
                                disabled={currentImageIndex === selectedImages.length - 1}
                            >
                                Next
                            </button>
                        </div>
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                            {selectedImages.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`w-16 h-16 object-cover rounded-md cursor-pointer shadow-sm ${index === currentImageIndex ? 'border-2 border-blue-600 ring-2 ring-blue-300' : 'border border-gray-300'
                                        }`}
                                    onClick={() => setCurrentImageIndex(index)}
                                />
                            ))}
                        </div>
                        <button
                            className="mt-6 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            onClick={closeImageModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CrmPayment;