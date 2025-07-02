import React, { useEffect, useRef } from 'react';

function NewArrive() {
    const topRef = useRef(null);

    useEffect(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
        window.scrollTo({ top: 0, behavior: 'smooth'});
    }, []);

    return (
        <div ref={topRef} className=' flex flex-col items-center justify-center bg-gray-50 p-4'>
            <div className='text-center max-w-md'>
                <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
                    New Arrivals Coming Soon!
                </h2>
                <p className='text-gray-600 mb-6'>
                    We're currently working on bringing you the latest products. 
                    Please check back later for exciting new arrivals.
                </p>
                <div className='animate-pulse text-blue-500'>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-12 w-12 mx-auto" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default NewArrive;