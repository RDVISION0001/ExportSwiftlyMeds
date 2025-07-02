import React, { useEffect, useRef } from 'react';

function ProductServices() {
    const topRef = useRef(null);

    useEffect(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
        window.scrollTo({ top: 0, behavior: 'smooth'});
    }, []);

    return (
        <div ref={topRef} className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-12 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Our Product Services</h1>
                    <p className="text-lg text-gray-600">Quality solutions for your everyday needs</p>
                </div>

                {/* Products/Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Product/Service Card 1 */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 p-3 rounded-full mr-4">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">Premium Products</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                High-quality items sourced from trusted suppliers with rigorous quality checks.
                            </p>
                            <button className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                                Explore Products →
                            </button>
                        </div>
                    </div>

                    {/* Product/Service Card 2 */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-green-100 p-3 rounded-full mr-4">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">Fast Delivery</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Get your orders delivered swiftly with our optimized logistics network.
                            </p>
                            <button className="text-green-600 font-medium hover:text-green-800 transition-colors">
                                Delivery Options →
                            </button>
                        </div>
                    </div>

                    {/* Product/Service Card 3 */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-purple-100 p-3 rounded-full mr-4">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">24/7 Support</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Our customer service team is always ready to assist you with any inquiries.
                            </p>
                            <button className="text-purple-600 font-medium hover:text-purple-800 transition-colors">
                                Contact Support →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Status Message */}
                <div className="mt-16 text-center p-6 bg-blue-50 rounded-xl">
                    <div className="flex justify-center mb-3">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">System Operational</h3>
                    <p className="text-gray-600">All product services are currently available and working perfectly!</p>
                </div>
            </div>
        </div>
    );
}

export default ProductServices;