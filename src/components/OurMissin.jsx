import React, { useEffect, useRef } from 'react';

function OurMission() {
  const topRef = useRef(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div ref={topRef} className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-2">Our Mission Page</h1>
        <p className="text-gray-700">This page is working perfectly! ✅</p>
        <p className="text-sm text-gray-500 mt-1">More content will be added soon.</p>
      </div>
    </div>
  );
}

export default OurMission;
