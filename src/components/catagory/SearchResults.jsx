import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useRef } from 'react';

function SearchResults({ results = [] }) {
    const scrollRef = useRef(null);

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
        hidden: { opacity: 0, x: 20 },
        show: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    };

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft -= 200;
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft += 200;
        }
    };

    // If no results, return null to hide everything
    if (!results || results.length === 0) {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex justify-between items-center mb-4">
                <motion.h6
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-2xl sm:text-3xl font-semibold text-gray-800"
                >
                    Serach Products
                </motion.h6>
                <a href="#" className="text-blue-600 hover:underline text-sm sm:text-base">See All</a>
            </div>

            <div className="relative">
                <button
                    onClick={scrollLeft}
                    aria-label="Scroll left"
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 z-10"
                >
                    <FaArrowLeft className="text-gray-600" />
                </button>
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="category-scroll flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
                    style={{ scrollBehavior: 'smooth' }}
                    ref={scrollRef}
                >
                    {results.map((item) => (
                        <motion.div
                            key={item.id}
                            variants={item}
                            whileHover={{ scale: 1.05 }}
                            className="min-w-[200px] bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center"
                        >
                            <h3 className="text-blue-600 text-lg font-semibold mb-2">{item.name}</h3>
                            <img
                                src={item.imageUrls?.[0] || 'path-to-fallback-image.jpg'}
                                alt={item.name}
                                className="w-24 h-24 mb-2 object-contain"
                            />
                            <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded mb-4">
                                ${item.prices?.[0]?.price || '0.01'} per pill
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300"
                            >
                                BUY NOW
                            </motion.button>
                        </motion.div>
                    ))}
                </motion.div>
                <button
                    onClick={scrollRight}
                    aria-label="Scroll right"
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 z-10"
                >
                    <FaArrowRight className="text-gray-600" />
                </button>
            </div>
        </div>
    );
}

export default SearchResults;