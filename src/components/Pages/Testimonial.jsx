import React, { useState, useEffect, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import im1 from "../../assets/img1.png";
import im2 from "../../assets/img2.png";
import im3 from "../../assets/img3.png";
import im4 from "../../assets/img4.png";

function Testimonial() {
    const testimonials = [
        { id: 1, image: im1, quote: "Discover how our intimate wellness solutions have transformed lives", cta: "Shop Supplement", ctaLink: "#" },
        { id: 2, image: im2, quote: "Discover how our intimate wellness solutions have transformed lives", cta: "Shop Supplement", ctaLink: "#" },
        { id: 3, image: im3, quote: "Discover how our intimate wellness solutions have transformed lives", cta: "Shop Supplement", ctaLink: "#" },
        { id: 4, image: im4, quote: "Discover how our intimate wellness solutions have transformed lives", cta: "Shop Supplement", ctaLink: "#" },
        { id: 5, image: im2, quote: "Discover how our intimate wellness solutions have transformed lives", cta: "Shop Supplement", ctaLink: "#" },
        { id: 6, image: im3, quote: "Discover how our intimate wellness solutions have transformed lives", cta: "Shop Supplement", ctaLink: "#" },
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
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative overflow-hidden'>
            <h1 className='text-xl md:text-4xl font-semibold text-center mt-10'>1,00,000+ Happy Customers Trust Mens Vitamins!</h1>
            <p className='text-center py-6'>Discover how our intimate wellness solutions have transformed lives</p>

            <div className="relative w-full overflow-hidden py-8 bg-[#e7e7e7]">
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
                        className="flex transition-transform duration-500 ease-in-out py-5"
                        style={{
                            transform: `translateX(-${currentIndex * (cardWidth + gap)}px)`,
                            gap: `${gap}px`
                        }}
                    >
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className="flex-shrink-0 bg-[#F2FAF4] rounded-lg shadow-lg p-6"
                                style={{ width: `${cardWidth}px` }}
                            >
                                <div className='items-center flex justify-center'>
                                    <img src={testimonial.image} alt="" className='w-36' />
                                </div>
                                <div className="text-lg text-center text-gray-700 mb-6">
                                    "{testimonial.quote}"
                                </div>
                                <div className="text-center">
                                    <a
                                        href={testimonial.ctaLink}
                                        className="inline-block px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition font-medium"
                                    >
                                        {testimonial.cta}
                                    </a>
                                </div>
                            </div>
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
    );
}

export default Testimonial;
