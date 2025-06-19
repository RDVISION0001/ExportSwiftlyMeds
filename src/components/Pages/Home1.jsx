import React, { useEffect, useRef, useState } from 'react';
import img from '../../assets/image.png';
import { FaSearch, FaUser, FaShoppingCart, FaHeart, FaUpload } from "react-icons/fa";
import Wolrd from '../../assets/world.png';
import Money from '../../assets/moneyBack.jpg';
import Product from '../../assets/product.jpg';
import Customer from '../../assets/support_icon.png';
import Price from '../../assets/bestPrise.jpg';
import { FiChevronLeft } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";
import eye from '../../assets/testimonial/eye.avif';
import femal from '../../assets/testimonial/female.avif';
import hair from '../../assets/testimonial/hair.avif';
import nature from '../../assets/testimonial/natural.avif';
import pain from '../../assets/testimonial/pain.avif';
import erectile from '../../assets/testimonial/Erectiledysfunction.avif';
import { Link } from 'react-router-dom';
function Home1() {

  const features = [
    { name: 'Worldwide Shipping', image: Wolrd },
    { name: 'Money Back Guarantee', image: Money, tag: '100% MONEY BACK!' },
    { name: 'Product Quality', image: Product },
    { name: '24/7 Customer Support', image: Customer },
    { name: 'Best Price Guarantee', image: Price, tag: 'BEST PRICE' }
  ];

  const quickCategories = ['Pain Relief', 'Diabetes', 'Heart Care', 'Vitamins', 'Antibiotics'];

  const floatingFeatures = [
    { icon: <FaUser className="text-2xl" />, title: "Expert Consultation" },
    { icon: <FaShoppingCart className="text-2xl" />, title: "Easy Ordering" },
    { icon: <FaHeart className="text-2xl" />, title: "Trusted Quality" },
    { icon: <FaSearch className="text-2xl" />, title: "Wide Selection" }
  ];

  const testimonials = [
    {
      id: 1,
      image: eye,
      name: "Eye Care",
      path: '/eyeCare'
    },
    {
      id: 2,
      image: femal,
      name: "Female Wellness",
      path: "/femaleWellness"
    },
    {
      id: 3,
      image: hair,
      name: "Hair Care",
      path: "/hairCare"
    },
    {
      id: 4,
      image: erectile,
      name: "Erectile Dysfunction",
      path: "/ed"
    },
    {
      id: 5,
      image: pain,
      name: "Swelling Relief",
      path: "/pain"
    },
    {
      id: 6,
      image: nature,
      name: "Ayurvedic",
      path: "/nature"
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  const cardWidthDesktop = 320; // Desktop card width
  const cardWidthMobile = 280; // Mobile card width
  const gap = 16;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = isMobile ? testimonials.length - 1 : testimonials.length - 3;
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isMobile, testimonials.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    resetInterval();
  };

  const goToPrev = () => {
    const maxIndex = isMobile ? testimonials.length - 1 : testimonials.length - 3;
    setCurrentIndex(prev => (prev === 0 ? maxIndex : prev - 1));
    resetInterval();
  };

  const goToNext = () => {
    const maxIndex = isMobile ? testimonials.length - 1 : testimonials.length - 3;
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    resetInterval();
  };

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = isMobile ? testimonials.length - 1 : testimonials.length - 3;
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 5000);
  };

  const cardWidth = isMobile ? cardWidthMobile : cardWidthDesktop;
  const visibleCards = isMobile ? 1 : 3;


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
          className='min-h-[400px] md:min-h-[500px] lg:min-h-[600px] w-full flex items-center justify-center px-4 py-16'
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
              <button className="absolute right-22 sm:right-34 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#4ED7F1] to-[#A8F1FF] text-gray-800 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full flex items-center hover:opacity-90 transition-opacity shadow-md text-sm sm:text-base font-medium cursor-pointer">
                <FaUpload className="mr-1 sm:mr-2" /> Upload
              </button>

              {/* Search Button (Right Side) */}
              <button className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 sm:px-6 py-1 sm:py-2 rounded-full flex items-center hover:bg-blue-700 transition-colors shadow-md text-sm sm:text-base cursor-pointer">
                <FaSearch className="mr-1 sm:mr-2" /> Search
              </button>
            </div>
            {/* Drug Savings Section */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative overflow-hidden'>
              <h1 className='text-xl md:text-4xl font-semibold text-center py-4 text-white'>Popular Categories</h1>

              <div className="relative w-full overflow-hidden">
                {/* Left Arrow */}
                <button
                  onClick={goToPrev}
                  className="absolute hidden sm:block left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                >
                  <FiChevronLeft className="w-6 h-6 text-gray-700" />
                </button>

                {/* Slider Container */}
                <div
                  className="mx-auto overflow-hidden"
                  style={{ width: `calc(${visibleCards} * ${cardWidth}px + ${(visibleCards - 1) * gap}px)` }}
                >
                  <div
                    ref={sliderRef}
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${currentIndex * (cardWidth + gap)}px)`,
                      gap: `${gap}px`
                    }}
                  >
                    {testimonials.map((testimonial) => (
                      <Link
                        key={testimonial.id}
                        to={testimonial.path}
                        className="flex-shrink-0 bg-[#F2FAF4] rounded-lg shadow-lg p-4"
                        style={{ width: `${cardWidth}px` }}
                      >
                        <div className='items-center flex justify-center'>
                          <img src={testimonial.image} alt="" className='w-36' />
                        </div>
                        <div className="text-lg text-center text-gray-700 mt-2">
                          {testimonial.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Right Arrow */}
                <button
                  onClick={goToNext}
                  className="absolute hidden sm:block right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                >
                  <FiChevronRight className="w-6 h-6 text-gray-700" />
                </button>

                {/* Navigation Dots */}
                <div className="flex justify-center mt-6 space-x-2">
                  {Array.from({ length: testimonials.length - (isMobile ? 0 : 2) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-amber-600' : 'bg-gray-300'}`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Floating Features */}
        <div className="absolute -bottom-12 sm:-bottom-16 left-0 right-0 px-2">
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

      {/* Content Section */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16'>
        <h2 className='text-3xl sm:text-4xl md:text-5xl font-semibold text-center mt-10 sm:mt-20 py-6 sm:py-10'>
          Best Pharmaceutical Exporter and Supplier in India
        </h2>
        <p className='text-base sm:text-lg md:text-xl text-gray-700 mt-6 sm:mt-10 text-center leading-relaxed'>
          The accessible, simple and affordable medicines in no time! Chawla Medicos, one of the world's leading suppliers/ exporters, has been known for providing affordable medicines globally around the world for so long. We aim to provide prescription medicines so that our customers can have smooth and seamless healthcare experience. Your health is of paramount importance to us so we cater to provide quality medicines at the cost that won't hamper your pocket. With so many medicines in the warehouse, we strive to deliver the best in class for our patients suffering from chronic ailments. Chawla Medicos is your one-stop shop destination for medicines like Hepatitis B(HIV), Hepatitis C, AntiCancer, Ayurvedic, chronic Kidney disease, arthritis medicines. For many people around the globe, we have been one of the most trusted sources where they can find medicine they need for their ailment.
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
    </>
  );
}

export default Home1;