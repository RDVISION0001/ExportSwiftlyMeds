import { useEffect, useState } from 'react';
import axiosInstance from '../AuthContext/AxiosInstance';
import { useParams } from 'react-router-dom';

const OrderTrackingPage = () => {
    const [orderData, setOrderData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { orderId } = useParams()
    // Function to format date as 'dd MMMM yyyy'
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';

        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    // Fetch order data based on orderId from URL
    useEffect(() => {
        if (orderId) {
            window.scrollTo(0, 0);
            fetchOrderData();
        }
    }, [orderId]);

    const fetchOrderData = async () => {
        try {
            const response = await axiosInstance.get(`/tracking/getTrackingByOrder/${orderId}`);
            setOrderData(response.data);
        } catch (err) {
            console.error('Error fetching order data:', err.response.data.error);
            setError(err.response.data.error)

        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg my-8">
                <div className="header bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-6 rounded-t-2xl">
                    <img
                        src="https://rdvisioncrmnew.s3.amazonaws.com/4492b299-cb0b-41ed-b590-f03764f72938_411.png"
                        alt="Company Logo"
                        className="mx-auto h-16 mb-2"
                    />
                    <h1 className="text-2xl font-semibold">Order Tracking</h1>
                </div>
                <div className="text-center p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200 my-4">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!orderData) return null;

    // Extract relevant data from API response
    const orderNumber = orderData.orderNumber || 'N/A';
    const deliveryAddress = orderData.deliveryAddress ?
        `${orderData.deliveryAddress.street}, ${orderData.deliveryAddress.city}, ${orderData.deliveryAddress.state}, ${orderData.deliveryAddress.postalCode}, ${orderData.deliveryAddress.country}` : 'N/A';
    const trackingNumber = orderData.trackingNumber || 'N/A';

    const latestTracking = Array.isArray(orderData.tracking) && orderData.tracking.length > 0 ?
        orderData.tracking.reduce((latest, current) =>
            new Date(current.updateTime) > new Date(latest.updateTime) ? current : latest
        ) : null;

    const orderStatus = latestTracking ? latestTracking.deliveryStatus : 'Unknown';
    const estimatedDelivery = latestTracking ?
        `${formatDate(latestTracking.estimatedDeliveryFrom)} - ${formatDate(latestTracking.estimateDeliveryTo)}` : 'N/A';

    return (
        <div className="bg-gray-100 font-sans text-gray-800 min-h-screen py-8">
            <div className="container max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg ">
                <div className="header bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-6 rounded-t-2xl">
                    <img
                        src="https://rdvisioncrmnew.s3.amazonaws.com/4492b299-cb0b-41ed-b590-f03764f72938_411.png"
                        alt="Company Logo"
                        className="mx-auto h-16 mb-2"
                    />
                    <h1 className="text-2xl font-semibold">Order Tracking</h1>
                </div>

                <div className="order-details grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-gray-50 rounded-lg my-4">
                    <div className="p-4 rounded-md border border-gray-200 hover:bg-gray-100 hover:scale-102 transition-all">
                        <p><strong className="font-medium">Ship To:</strong> <span>{deliveryAddress}</span></p>
                        <p><strong className="font-medium">Order ID:</strong> <span>{orderNumber}</span></p>
                    </div>
                    <div className="p-4 rounded-md border border-gray-200 col-span-1 md:col-span-2 hover:bg-gray-100 hover:scale-102 transition-all">
                        <p><strong className="font-medium">Tracking Number:</strong> <span>{trackingNumber}</span></p>
                    </div>
                </div>

                <div className="order-status text-center p-6 bg-green-50 rounded-lg my-4">
                    <div className="flex items-center justify-center mb-2">
                        <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h2 className="text-xl font-medium text-green-600">Order Status: {orderStatus}</h2>
                    </div>
                    <p className="text-gray-600">Estimated Delivery: {estimatedDelivery}</p>
                </div>

                <div className="timeline relative my-6 px-4">
                    <div className="absolute top-0 left-4 h-full w-1 bg-gradient-to-b from-orange-500 to-gray-200"></div>
                    <div className="space-y-4 pl-8">
                        {Array.isArray(orderData.tracking) && orderData.tracking.length > 0 ? (
                            orderData.tracking.map((update, index) => (
                                <div
                                    key={index}
                                    className={`timeline-item relative pl-8 mb-6 transition-all hover:translate-x-1 ${update.deliveryStatus === 'DELIVERED' ? 'active' : ''
                                        }`}
                                >
                                    <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-3 border-gray-300 bg-white transition-all ${update.deliveryStatus === 'DELIVERED' ? '!border-green-500 !bg-green-500 shadow-green' : ''
                                        }`}></div>
                                    <p className="font-semibold text-orange-500">{formatDate(update.updateTime)}</p>
                                    <p className="text-gray-700">{update.description || update.deliveryStatus || 'Unknown'}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600">
                                Tracking is not live. It will take up to 24-48 hours to get live.
                            </p>
                        )}
                    </div>
                </div>

                <div className="disclaimer text-center p-4 bg-orange-50 text-gray-600 text-sm rounded-lg border border-orange-200">
                    <p>Please note that these are accurate but not guaranteed estimates. Delivery date is subject to change without advanced notice.</p>
                </div>
            </div>
        </div>
    );
};

export default OrderTrackingPage;