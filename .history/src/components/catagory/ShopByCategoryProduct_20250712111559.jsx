import React, { useEffect, useRef, useState } from 'react';
import { IoSearchOutline, IoArrowForward, IoMenu, IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useAuth } from '../../AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';

// Currency conversion rates (example rates - in production, fetch from an API)
const currencyRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    INR: 75.0,
    CAD: 1.25,
    AUD: 1.35,
    JPY: 110.0,
    RUB: 75.0,
};

const ShopByCategoryProduct = () => {
    const { category, catProduct, setCatId, catId, loading, selectCountry, itemsPerpage, setItemsPerpage } = useAuth();
    const [activePage, setActivePage] = useState(catId);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedManufacturer, setSelectedManufacturer] = useState('');
    const [expandedCategory, setExpandedCategory] = useState('');
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
   
    const navigate = useNavigate();

    const brands = [
        { id: 'adel', name: 'Adel' },
        { id: 'adven', name: 'Adven' },
        { id: 'allen', name: 'Allen' },
        { id: 'axion', name: 'Axion' },
        { id: 'bahola', name: 'Bahola' },
        { id: 'adsfen', name: 'Advendf' },
        { id: 'fd', name: 'df' },
        { id: 'dfd', name: 'df' },
        { id: 'we', name: 'Badfdhola' },
        { id: 'balanceAyurveda', name: 'Balance Ayurveda' },
    ];

    const manufacturers = [
        { id: 'drRoshanlal', name: 'Dr. Roshanlal Aggarwal & Sons Pvt. Ltd' },
        { id: 'sblPvt', name: 'SBL Pvt. Ltd.' },
        { id: 'adelPharma', name: 'Adel Pharma GmbH' },
    ];

    const topRef = useRef(null);

    // Calculate pagination values
    const totalItems = catProduct?.length || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentItems = catProduct?.slice(startIndex, endIndex) || [];

    useEffect(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [selectCountry, currentPage]);

    const convertPrice = (price, fromCurrency = 'USD') => {
        if (!price) return price;

        const toCurrency = selectCountry?.currency || 'USD';
        if (fromCurrency === toCurrency) return price;

        const usdAmount = price / (currencyRates[fromCurrency] || 1);
        return usdAmount * (currencyRates[toCurrency] || 1);
    };

    const formatPrice = (price) => {
        if (!price) return '';

        const currency = selectCountry?.currency || 'USD';
        const convertedPrice = convertPrice(price);

        switch (currency) {
            case 'USD': return `$${convertedPrice.toFixed(2)}`;
            case 'EUR': return `€${convertedPrice.toFixed(2)}`;
            case 'GBP': return `£${convertedPrice.toFixed(2)}`;
            case 'INR': return `₹${convertedPrice.toFixed(2)}`;
            case 'CAD': return `CA$${convertedPrice.toFixed(2)}`;
            case 'AUD': return `A$${convertedPrice.toFixed(2)}`;
            case 'JPY': return `¥${Math.round(convertedPrice)}`;
            case 'RUB': return `${convertedPrice.toFixed(2)} ₽`;
            default: return `$${convertedPrice.toFixed(2)}`;
        }
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const renderPagination = () => {
        return (
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Items per page:</span>
                    <div className="relative">
                        <select
                            onChange={(e) => setItemsPerpage(Number(e.target.value))}
                            className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                            value={itemsPerpage}
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-full ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-teal-600 hover:bg-teal-50'}`}
                    >
                        <IoChevronBack className="w-5 h-5" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`w-10 h-10 rounded-full ${currentPage === page ? 'bg-teal-600 text-white' : 'bg-white text-teal-600 border border-teal-600'}`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-full ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-teal-600 hover:bg-teal-50'}`}
                    >
                        <IoChevronForward className="w-5 h-5" />
                    </button>
                </div>

                <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                    Showing {startIndex + 1}-{endIndex} of {totalItems} items
                </div>
            </div>
        );
    };

    const renderProducts = () => {
        if (loading) {
            return (
                <div className="w-full flex flex-col items-center justify-center py-12 ">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600"></div>
                    <p className="text-gray-500 text-sm mt-4">Loading products...</p>
                </div>
            );
        }

        if (!currentItems || currentItems.length === 0) {
            return (
                <div className="w-full flex flex-col items-center justify-center py-12">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                        No products found
                    </h3>
                    <p className="text-gray-500 text-sm">
                        Try changing your filters or check back later
                    </p>
                </div>
            );
        }

        return (
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 border  ">
                    {currentItems.map((product, index) => {
                        const originalPrice = product.prices?.[0]?.maxPrice / 100;
                        const originalCurrency = product.prices?.[0]?.currency || 'USD';
                        const perPillPrice = originalPrice ? originalPrice / 100 : 0;

                        return (
                            <div
                                key={index}
                                className="border border-gray-300 rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:border-green-200 hover:scale-[1.02] group cursor-pointer"
                                onClick={() => navigate('/view')}
                            >
                                <div className="flex flex-col h-full">
                                    <div className="mb-3">
                                        <h3 className="text-lg font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-green-600 mt-1 line-clamp-2">
                                            {product.genericName}
                                        </p>
                                    </div>

                                    <div className="flex justify-center items-center gap-4 my-4 flex-grow">
                                        <img
                                            src={product.imageUrls[0]}
                                            alt={product.name}
                                            className="max-h-30 w-40 object-contain group-hover:scale-105 transition-transform rounded-lg"
                                        />
                                        <div className='bg-blue-50 rounded-xl p-3 flex justify-center items-center group-hover:bg-blue-100 transition-colors'>
                                            <div className='flex flex-col items-center'>
                                                <p className="text-xl font-bold text-green-600 group-hover:text-green-700">
                                                    {formatPrice(perPillPrice)}
                                                </p>
                                                <span className='text-xs text-gray-500'>per pill</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate('/view')}
                                        className="mt-auto cursor-pointer bg-white text-green-600 border border-green-600 rounded-full px-6 py-2 hover:bg-green-600 hover:text-white transition-colors hover:shadow-md transform hover:-translate-y-1"
                                    >
                                        BUY NOW
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {renderPagination()}
            </>
        );
    };

    const toggleCategory = (categoryId) => {
        setExpandedCategory(expandedCategory === categoryId ? '' : categoryId);
        setActivePage(categoryId);
        setCatId(categoryId);
        if (window.innerWidth < 768) {
            setShowMobileSidebar(false);
        }
    };

    return (
        <div ref={topRef} className='bg-white w-full py-8'>
            <div className="flex flex-col md:flex-row gap-6 max-w-8xl mx-auto px-4 md:px-10 lg:px-20">
                {/* Mobile Sidebar Toggle Button */}
                <button
                    onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                    className="md:hidden flex items-center justify-center p-2 bg-teal-600 text-white rounded-md mb-4 mx-4"
                >
                    {showMobileSidebar ? (
                        <IoClose className="w-6 h-6" />
                    ) : (
                        <IoMenu className="w-6 h-6" />
                    )}
                    <span className="ml-2">{showMobileSidebar ? 'Close' : 'Filters'}</span>
                </button>

                {/* Sidebar - Non-scrollable */}
                <div
                    className={`${showMobileSidebar ? 'block' : 'hidden'} md:block w-full md:w-[20%] bg-white z-20 md:z-0 fixed md:sticky top-0 h-screen overflow-y-hidden`}
                >
                    <div className="p-4 md:p-0 bg-white h-full overflow-y-hidden">
                        <div className="flex justify-between items-center md:hidden p-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
                            <button
                                onClick={() => setShowMobileSidebar(false)}
                                className="p-1 rounded-full hover:bg-gray-100"
                            >
                                <IoClose className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className='p-4'>
                            <div className="sticky top-0 z-10 p-4 border-b border-gray-200 bg-white">
                                <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
                            </div>
                            <nav className='h-[300px] overflow-y-auto'>
                                {category.map((cat) => (
                                    <div key={cat.productCategoryId}>
                                        <button
                                            onClick={() => toggleCategory(cat.productCategoryId)}
                                            className={`flex items-center w-full py-2 text-left transition-colors duration-200 rounded-md hover:bg-gray-100 hover:text-teal-600 ${activePage === cat.productCategoryId ? 'bg-gray-50 text-teal-600' : 'text-gray-600'}`}
                                        >
                                            <IoArrowForward
                                                className={`mr-2 transition-transform duration-200 ${expandedCategory === cat.productCategoryId ? 'rotate-90' : ''}`}
                                            />
                                            <span className="text-sm font-medium">{cat.categoryName}</span>
                                        </button>
                                    </div>
                                ))}
                            </nav>
                        </div>

                        <div className='mt-6 p-4'>
                            <div>
                                <h4 className="text-sm font-medium mb-2 text-gray-700">Brands</h4>
                                <div className="sticky top-0 bg-white z-10 pb-4">
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            placeholder="Search brands..."
                                            className="w-full py-2 pl-4 pr-10 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-sm"
                                        />
                                        <IoSearchOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>
                                <div className="pt-2 h-[180px] overflow-y-auto custom-scroll">
                                    {brands.map((brand) => (
                                        <div key={brand.id} className="flex items-center py-1.5 px-3 hover:bg-gray-50 rounded">
                                            <input
                                                type="checkbox"
                                                id={brand.id}
                                                checked={selectedBrand === brand.name}
                                                onChange={() => setSelectedBrand(selectedBrand === brand.name ? '' : brand.name)}
                                                className="mr-3 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor={brand.id} className="text-sm text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                                                {brand.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-4">
                                <h4 className="text-sm font-medium mb-2 text-gray-700">Manufacturers</h4>
                                <div className="relative w-full mb-4">
                                    <input
                                        type="text"
                                        placeholder="Search manufacturers..."
                                        className="w-full py-2 pl-4 pr-10 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-sm"
                                    />
                                    <IoSearchOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                                <div className="space-y-2">
                                    {manufacturers.map((manu) => (
                                        <div key={manu.id} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={manu.id}
                                                checked={selectedManufacturer === manu.name}
                                                onChange={() => setSelectedManufacturer(selectedManufacturer === manu.name ? '' : manu.name)}
                                                className="mr-2 h-4 w-4 text-teal-500 focus:ring-teal-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor={manu.id} className="text-sm text-gray-600">{manu.name}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Close button for mobile */}
                        <div className="md:hidden p-4 border-t border-gray-200">
                            <button
                                onClick={() => setShowMobileSidebar(false)}
                                className="w-full py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Overlay for mobile sidebar */}
                {showMobileSidebar && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
                        onClick={() => setShowMobileSidebar(false)}
                    />
                )}

                {/* Main Content - Scrollable */}
                <div className="w-full md:w-3/4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
                    <main className="mt-6">
                        {renderProducts()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ShopByCategoryProduct;