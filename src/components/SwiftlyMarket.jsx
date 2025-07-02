import React, { useEffect, useRef } from 'react';

function SwiftlyMarket() {
    const topRef = useRef(null);

    useEffect(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    return (
        <div ref={topRef} className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex flex-col items-center justify-center p-6">
            <div className="max-w-md text-center">
                <div className="flex justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Swiftly Marketplace</h1>
                <h2 className="text-xl font-semibold text-blue-600 mb-4">Coming Soon!</h2>
                
                <p className="text-gray-600 mb-6">
                    We're building an exciting marketplace experience for you. 
                    Stay tuned for a wide selection of products and services 
                    coming your way soon!
                </p>
                
                <div className="animate-pulse text-sm text-gray-500">
                    <p>We appreciate your patience as we prepare something special</p>
                </div>
            </div>
        </div>
    );
}

export default SwiftlyMarket;