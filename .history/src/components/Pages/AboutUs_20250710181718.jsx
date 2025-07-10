import React, { useEffect, useRef } from 'react';
import about from "../../assets/about.jpeg";

function AboutUs() {
  const topRef = useRef(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <div ref={topRef} className='w-full'>
      {/* Hero Section */}
      <div
        style={{
          backgroundImage: `url(${about})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        className='min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] w-full flex items-center justify-center px-4 py-16'
      >
        
      </div>

      {/* About Content */}
      <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16'>
        <h2 className='text-center font-bold text-2xl sm:text-3xl md:text-4xl mb-6 md:mb-10'>About Us</h2>
        <div className='mt-4 text-center text-gray-800 space-y-4 md:space-y-6 text-sm sm:text-base md:text-lg'>
          <p>
            At SwiftlyMeds.com, we are committed to providing global access to essential wellness solutions, prioritizing affordability, quality, and compassionate care. As a trusted online pharmacy and international distributor, our mission is to ensure individuals worldwide can conveniently access the medications they need for their health and well-being—without financial barriers.
          </p>

          <p>
            Our dedicated team of licensed healthcare professionals and pharmacy experts brings deep industry knowledge to create an efficient, reliable, and cost-effective global delivery system. We've streamlined our operations to reduce costs while maintaining strict quality standards, ensuring consistent access to vital medications.
          </p>

          <p>
            We leverage cutting-edge technology and innovative solutions to make healthcare more accessible. Our platform offers discreet, FDA-approved medications with fast international shipping, supporting patients facing various health challenges.
          </p>

          <p>
            At SwiftlyMeds.com, we're more than just an online pharmacy—we're your partner in health, building trust through transparent practices, exceptional customer care, and reliable access to affordable medications worldwide.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className='w-full bg-[#EEEFE0] py-12 md:py-20 px-4 sm:px-6'>
        <div className='max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4'>
          <div className='text-center'>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF4F0F] to-[#B13BFF] text-transparent bg-clip-text">
              +27,000
            </h2>
            <span className='text-sm sm:text-base'>Customers Helped</span>
          </div>
          <div className='text-center'>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF4F0F] to-[#B13BFF] text-transparent bg-clip-text">+90</h2>
            <span className='text-sm sm:text-base'>Countries Where We Have Successfully Delivered</span>
          </div>
          <div className='text-center'>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF4F0F] to-[#B13BFF] text-transparent bg-clip-text">+4.5M</h2>
            <span className='text-sm sm:text-base'>People Reached</span>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <section className="my-12 md:my-16 max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-blue-600 text-4xl mb-4">✓</div>
            <h3 className="font-bold text-lg sm:text-xl mb-3">Transparency</h3>
            <p className="text-gray-700 text-sm sm:text-base">
              Clear pricing, genuine products, and open communication about every step of your order process.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-blue-600 text-4xl mb-4">♥</div>
            <h3 className="font-bold text-lg sm:text-xl mb-3">Compassion</h3>
            <p className="text-gray-700 text-sm sm:text-base">
              Healthcare with dignity. Our team understands your needs and treats every case with empathy.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-blue-600 text-4xl mb-4">⚡</div>
            <h3 className="font-bold text-lg sm:text-xl mb-3">Efficiency</h3>
            <p className="text-gray-700 text-sm sm:text-base">
              From order to delivery, we've optimized every processes to save your time and money.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;