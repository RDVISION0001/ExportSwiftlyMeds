import React, { useEffect, useRef, useState } from 'react';
import img from '../../assets/image.png';
import { FaSearch, FaUser, FaShoppingCart, FaHeart, FaUpload } from "react-icons/fa";
import Wolrd from '../../assets/world.png';
import Money from '../../assets/moneyBack.jpg';
import Product from '../../assets/product.jpg';
import Customer from '../../assets/support_icon.png';
import Price from '../../assets/bestPrise.jpg';

import Upload from '../Upload';
import ShopByCategory from '../catagory/ShopByCategory';
function Home1() {

  const [uploadModal, setUploadModal] = useState(false);
  const features = [
    { name: 'Worldwide Shipping', image: Wolrd },
    { name: 'Money Back Guarantee', image: Money, tag: '100% MONEY BACK!' },
    { name: 'Product Quality', image: Product },
    { name: '24/7 Customer Support', image: Customer },
    { name: 'Best Price Guarantee', image: Price, tag: 'BEST PRICE' }
  ];

  const floatingFeatures = [
    { icon: <FaUser className="text-2xl" />, title: "Expert Consultation" },
    { icon: <FaShoppingCart className="text-2xl" />, title: "Easy Ordering" },
    { icon: <FaHeart className="text-2xl" />, title: "Trusted Quality" },
    { icon: <FaSearch className="text-2xl" />, title: "Wide Selection" }
  ];

  return (
    <>
      {/* Hero Section */}
      <div className='w-full relative'>
        <div
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
          className='min-h-[400px]  w-full flex items-center justify-center px-4 py-16'
        >
          <div className='max-w-8xl mx-auto text-center px-4 sm:px-6'>
            {/* Main Heading */}
            <h1 className='text-white text-3xl sm:text-4xl md:text-4xl font-bold mb-4 sm:mb-6 leading-tight'>
              Find Your Medicine at <span className='text-blue-300'>Affordable Prices</span>
            </h1>

            {/* Subheading */}
            <p className='text-gray-200 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto'>
              Discover a wide range of medicines with guaranteed quality and best prices
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search for medicines, brands or categories..."
                className="w-full py-2 sm:py-3 px-4 sm:px-6 pr-32 sm:pr-40 rounded-full bg-white/90 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg text-gray-800 text-sm sm:text-base"
              />

              {/* Upload Button (Left Side) */}
              <button onClick={() => setUploadModal(true)} className="absolute right-22 sm:right-34 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#4ED7F1] to-[#A8F1FF] text-gray-800 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full flex items-center hover:opacity-90 transition-opacity shadow-md text-sm sm:text-base font-medium cursor-pointer">
                <FaUpload className="mr-1 sm:mr-2" /> Upload
              </button>

              {/* Search Button (Right Side) */}
              <button className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 sm:px-6 py-1 sm:py-2 rounded-full flex items-center hover:bg-blue-700 transition-colors shadow-md text-sm sm:text-base cursor-pointer">
                <FaSearch className="mr-1 sm:mr-2" /> Search
              </button>
            </div>
          </div>
        </div>

        {/* Floating Features */}
        <div className="absolute -bottom-26 sm:-bottom-16 left-0 right-0 px-2">
          <div className="max-w-6xl mx-auto px-2 sm:px-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              {floatingFeatures.map((feature, index) => (
                <div key={index} className="bg-white p-2 sm:p-4 rounded-lg shadow-lg flex flex-col items-center text-center hover:shadow-xl transition-shadow">
                  <div className="bg-blue-100 text-blue-600 p-2 sm:p-3 rounded-full mb-2 sm:mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base">{feature.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='mt-20'>
        <ShopByCategory />
      </div>
      {/* Content Section */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-2'>
        <h2 className='text-xl sm:text-4xl md:text-5xl font-semibold text-center mt-20 md:mt-8 py-2'>
          Best Pharmaceutical Exporter and Supplier in India
        </h2>
        <p className='text-base sm:text-lg md:text-xl text-gray-700 mt-6 sm:mt-10 text-center leading-relaxed'>
          Accessible, simple, and affordable medicines—delivered swiftly! SwiftlyMeds is a trusted global supplier of high-quality prescription medications, providing cost-effective healthcare solutions worldwide. We ensure a seamless experience by delivering FDA-approved and generic medicines at prices that won’t strain your budget. Your health is our priority, which is why we maintain a well-stocked warehouse to serve patients with chronic conditions efficiently.
          <br /><br />
          SwiftlyMeds is your one-stop destination for essential treatments, including:
          <strong>Hepatitis B & C, Anti-Cancer therapies, Ayurvedic remedies, Chronic Kidney Disease medications, and Arthritis relief.</strong>
          <br /><br />
          For patients across the globe, we remain a reliable source for life-saving medications—combining affordability, speed, and trust.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 py-10 sm:py-16">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-4 sm:p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="rounded-full mb-3 sm:mb-4">
                <img
                  src={feature.image}
                  alt={feature.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 object-contain"
                />
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">
                {feature.name}
              </h3>
              {feature.tag && (
                <span className="text-xs sm:text-sm font-bold text-blue-600">
                  {feature.tag}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      {uploadModal && (
        <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 p-4">
          <Upload onClose={setUploadModal} />
        </div>
      )}
    </>
  );
}

export default Home1;