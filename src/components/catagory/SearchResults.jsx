import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext/AuthContext';
import { FiSearch } from 'react-icons/fi';

function SearchResults({ results = [] }) {
    const scrollRef = useRef(null);
    const navigate = useNavigate();
    const { productData, setProductData } = useAuth();
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    // Animation variants for search results
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        }
    };

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
            handleScroll(); // Initialize arrow visibility
            return () => scrollContainer.removeEventListener('scroll', handleScroll);
        }
    }, [results]);

    // If no results, show a message instead of returning null
    if (!results || results.length === 0) {
        return (
            <></>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">

                <span className='text-xl font-bold'>Search Results</span>

                <p className="text-gray-600 text-sm md:text-base">
                    Showing {results.length} {results.length === 1 ? 'result' : 'results'}
                </p>
            </div>

            <div className="relative">
                {showLeftArrow && (
                    <button
                        onClick={scrollLeft}
                        aria-label="Scroll left"
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 z-10 transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <FaArrowLeft className="text-gray-700 text-lg" />
                    </button>
                )}

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="flex overflow-x-auto space-x-6 pb-6 hide-scrollbar -mx-4 px-4"
                    style={{ scrollBehavior: 'smooth' }}
                    ref={scrollRef}
                >
                    {results.map((product) => (
                        <motion.div
                            key={product.id}
                            variants={item}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-shrink-0 w-[290px] bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
                        >
                            <div
                                onClick={() => navigate('/view', { state: { product } })}
                                className="p-4 flex flex-col h-[300px]"> {/* Reduced height from h-[60%] to fixed pixel value */}
                                <div className="relative pt-[70%] mb-3 bg-gray-50 rounded-lg overflow-hidden"> {/* Reduced pt-[100%] to pt-[70%] */}
                                    <img
                                        src={product.imageUrls?.[0] || '/placeholder-product.jpg'}
                                        alt={product.name}
                                        className="absolute top-0 left-0 w-full  object-contain p-3 h-50"
                                        loading="lazy"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                    {product.name}
                                </h3>
                                <div className="mt-auto space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                                            ${product.prices?.[0]?.price || '0.01'} per pill
                                        </span>
                                        {product.discount && (
                                            <span className="bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded">
                                                {product.discount}% OFF
                                            </span>
                                        )}
                                    </div>
                                    <motion.button
                                        onClick={() => navigate('/view', { state: { product } })}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full cursor-pointer bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-300 font-medium text-sm shadow-sm"
                                    >
                                        Buy Now
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {showRightArrow && (
                    <button
                        onClick={scrollRight}
                        aria-label="Scroll right"
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 z-10 transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <FaArrowRight className="text-gray-700 text-lg" />
                    </button>
                )}
            </div>
        </div>
    );
}

export default SearchResults;