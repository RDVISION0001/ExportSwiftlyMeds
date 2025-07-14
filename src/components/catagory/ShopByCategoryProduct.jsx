import React, { useEffect, useRef, useState } from 'react';
import { IoSearchOutline, IoArrowForward, IoMenu, IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useAuth } from '../../AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';

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
    const [brands, setBrands] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [searchBrand, setSearchBrand] = useState('');
    const [searchManufacturer, setSearchManufacturer] = useState('');
    const itemsPerPage = itemsPerpage || 20;
    const navigate = useNavigate();
    const topRef = useRef(null);

    // Extract unique brands and manufacturers
    useEffect(() => {
        if (catProduct?.length > 0) {
            const uniqueBrands = [...new Set(catProduct
                .filter(product => product.brand)
                .map(product => product.brand))];

            const uniqueManufacturers = [...new Set(catProduct
                .filter(product => product.manufacturer)
                .map(product => product.manufacturer))];

            setBrands(uniqueBrands.map((brand, index) => ({
                id: `${brand.toLowerCase().replace(/\s+/g, '-')}-${index}`,
                name: brand
            })));

            setManufacturers(uniqueManufacturers.map((manu, index) => ({
                id: `${manu.toLowerCase().replace(/\s+/g, '-')}-${index}`,
                name: manu
            })));
        }
    }, [catProduct]);

    // Filter products based on selected brand and manufacturer
    const filteredProducts = React.useMemo(() => {
        if (!catProduct) return [];

        return catProduct.filter(product => {
            const brandMatch = !selectedBrand || product.brand === selectedBrand;
            const manufacturerMatch = !selectedManufacturer || product.manufacturer === selectedManufacturer;
            return brandMatch && manufacturerMatch;
        });
    }, [catProduct, selectedBrand, selectedManufacturer]);

    // Filter brands and manufacturers based on search
    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchBrand.toLowerCase())
    );

    const filteredManufacturers = manufacturers.filter(manu =>
        manu.name.toLowerCase().includes(searchManufacturer.toLowerCase())
    );

    // Pagination
    const totalItems = filteredProducts?.length || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentItems = filteredProducts?.slice(startIndex, endIndex) || [];

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage, selectCountry]);

    const convertPrice = (price, fromCurrency = 'USD') => {
        if (!price) return 0;
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

    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

    const toggleCategory = (categoryId) => {
        setExpandedCategory(expandedCategory === categoryId ? '' : categoryId);
        setActivePage(categoryId);
        setCatId(categoryId);
        // Reset filters when category changes
        setSelectedBrand('');
        setSelectedManufacturer('');
        setCurrentPage(1);
        if (window.innerWidth < 768) setShowMobileSidebar(false);
    };

    const handleBrandSelect = (brandName) => {
        setSelectedBrand(selectedBrand === brandName ? '' : brandName);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const handleManufacturerSelect = (manufacturerName) => {
        setSelectedManufacturer(selectedManufacturer === manufacturerName ? '' : manufacturerName);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const clearAllFilters = () => {
        setSelectedBrand('');
        setSelectedManufacturer('');
        setCurrentPage(1);
    };

    const renderPagination = () => (
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Items per page:</span>
                <select
                    onChange={(e) => setItemsPerpage(Number(e.target.value))}
                    className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={itemsPerpage}
                >
                    {[10, 20, 50, 100].map(num => (
                        <option key={`items-${num}`} value={num}>{num}</option>
                    ))}
                </select>
            </div>

            <div className="flex items-center gap-2 my-4 sm:my-0">
                <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md py-1 cursor-pointer border ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-teal-600 hover:bg-teal-50'}`}
                >
                    <span className='flex justify-center items-center'><IoChevronBack className="w-4 h-4" />Prev</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={`page-${page}`}
                        onClick={() => goToPage(page)}
                        className={`w-10 h-10 rounded-full ${currentPage === page ? 'bg-teal-600 text-white' : 'bg-white text-teal-600 border border-teal-600'}`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md py-1 cursor-pointer border ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-teal-600 hover:bg-teal-50'}`}
                >
                    <span className='flex justify-center items-center'>Next<IoChevronForward className="w-4 h-4" /></span>
                </button>
            </div>

            <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{endIndex} of {totalItems} items
            </div>
        </div>
    );

    const renderProducts = () => {
        if (loading) return (
            <div className="w-full flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600"></div>
                <p className="text-gray-500 text-sm mt-4">Loading products...</p>
            </div>
        );

        if (!currentItems?.length) return (
            <div className="w-full flex flex-col items-center justify-center py-12">
                <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500 text-sm">Try changing your filters or check back later</p>
                {(selectedBrand || selectedManufacturer) && (
                    <button
                        onClick={clearAllFilters}
                        className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                    >
                        Clear all filters
                    </button>
                )}
            </div>
        );

        return (
            <>
                {/* Filter indicators */}
                {(selectedBrand || selectedManufacturer) && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mx-4 mb-4">
                        <div className="flex items-center flex-wrap gap-2">
                            {selectedBrand && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                                    Brand: {selectedBrand}
                                    <button
                                        onClick={() => setSelectedBrand('')}
                                        className="ml-2 p-0.5 rounded-full hover:bg-teal-200"
                                    >
                                        <IoClose className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {selectedManufacturer && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    Manufacturer: {selectedManufacturer}
                                    <button
                                        onClick={() => setSelectedManufacturer('')}
                                        className="ml-2 p-0.5 rounded-full hover:bg-blue-200"
                                    >
                                        <IoClose className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                        </div>
                        <button
                            onClick={clearAllFilters}
                            className="text-sm text-teal-600 hover:text-teal-800 font-medium"
                        >
                            Clear all
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
                    {currentItems.map((product) => {
                        const originalPrice = product.prices?.[0]?.maxPrice / 100 || 0;
                        const perPillPrice = originalPrice ? originalPrice / 100 : 0;

                        return (
                            <article
                                key={`product-${product.id}`}
                                className="border border-gray-300 rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:border-green-200 hover:scale-[1.02] group cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
                                onClick={() => navigate('/view')}
                                onKeyDown={(e) => e.key === 'Enter' && navigate('/view')}
                                tabIndex={0}
                                aria-label={`View details for ${product.name}`}
                            >
                                <div className="flex flex-col h-full">
                                    <header className="mb-3">
                                        <h3 className="text-lg font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
                                            {product.name || 'Product Name'}
                                        </h3>
                                        {product.genericName && (
                                            <p className="text-sm text-green-600 mt-1 line-clamp-2">
                                                {product.genericName}
                                            </p>
                                        )}
                                    </header>

                                    <div className="flex justify-center items-center gap-4 my-4 flex-grow">
                                        <figure className="flex justify-center items-center">
                                            <img
                                                src={product.imageUrls?.[0] || ''}
                                                alt={product.name}
                                                className="max-h-30 w-40 object-contain group-hover:scale-105 transition-transform rounded-lg"
                                                onError={(e) => {
                                                    e.target.src = '';
                                                    e.target.alt = 'Product image not available';
                                                }}
                                                loading="lazy"
                                            />
                                        </figure>
                                        <div className="bg-blue-50 rounded-xl p-3 flex justify-center items-center group-hover:bg-blue-100 transition-colors">
                                            <div className="flex flex-col items-center">
                                                <p className="text-xl font-bold text-green-600 group-hover:text-green-700">
                                                    {formatPrice(perPillPrice)}
                                                </p>
                                                <span className="text-xs text-gray-500">per pill</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        className="mt-auto bg-white text-green-600 border border-green-600 rounded-full px-6 py-2 hover:bg-green-600 hover:text-white transition-colors hover:shadow-md transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                        aria-label={`Buy ${product.name} now`}
                                    >
                                        BUY NOW
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
                {renderPagination()}
            </>
        );
    };

    return (
        <div ref={topRef} className='bg-white w-full py-8'>
            <div className="flex flex-col md:flex-row gap-6 max-w-8xl mx-auto px-4 md:px-10 lg:px-20">
                {/* Mobile Sidebar Toggle */}
                <button
                    onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                    className="md:hidden flex items-center justify-center p-2 bg-teal-600 text-white rounded-md mb-4 mx-4"
                >
                    {showMobileSidebar ? <IoClose className="w-6 h-6" /> : <IoMenu className="w-6 h-6" />}
                    <span className="ml-2">{showMobileSidebar ? 'Close' : 'Filters'}</span>
                </button>

                {/* Sidebar */}
                <div className={`${showMobileSidebar ? 'block' : 'hidden'} md:block w-full md:w-[20%] bg-white z-20 md:z-0 fixed md:sticky top-0 h-screen overflow-y-auto hide-scrollbar border border-gray-100 rounded-lg`}>
                    <div className="p-4 md:p-0 bg-white h-full overflow-y-auto hide-scrollbar">
                        <div className="flex justify-between items-center md:hidden p-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
                            <button onClick={() => setShowMobileSidebar(false)} className="p-1 rounded-full hover:bg-gray-100">
                                <IoClose className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className='p-4'>
                            <div className="sticky top-0 z-10 p-4 border-b border-gray-200 bg-white">
                                <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
                            </div>
                            <nav className='h-[300px] overflow-y-auto'>
                                {category.map((cat) => (
                                    <div key={`cat-${cat.productCategoryId}`}>
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
                                            className="w-full py-2 pl-4 pr-10 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            value={searchBrand}
                                            onChange={(e) => setSearchBrand(e.target.value)}
                                        />
                                        <IoSearchOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>
                                <div className="pt-2 h-[180px] overflow-y-auto">
                                    {filteredBrands.map((brand) => (
                                        <div key={`brand-${brand.id}`} className="flex items-center py-1.5 px-3 hover:bg-gray-50 rounded">
                                            <input
                                                type="checkbox"
                                                id={`brand-${brand.id}`}
                                                checked={selectedBrand === brand.name}
                                                onChange={() => handleBrandSelect(brand.name)}
                                                className="mr-3 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor={`brand-${brand.id}`} className="text-sm text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
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
                                        className="w-full py-2 pl-4 pr-10 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        value={searchManufacturer}
                                        onChange={(e) => setSearchManufacturer(e.target.value)}
                                    />
                                    <IoSearchOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                                <div className="h-[180px] overflow-y-auto">
                                    {filteredManufacturers.map((manu) => (
                                        <div key={`manu-${manu.id}`} className="flex items-center py-1.5 px-3 hover:bg-gray-50 rounded">
                                            <input
                                                type="checkbox"
                                                id={`manu-${manu.id}`}
                                                checked={selectedManufacturer === manu.name}
                                                onChange={() => handleManufacturerSelect(manu.name)}
                                                className="mr-2 h-4 w-4 text-teal-500 focus:ring-teal-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor={`manu-${manu.id}`} className="text-sm text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                                                {manu.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

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

                {showMobileSidebar && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
                        onClick={() => setShowMobileSidebar(false)}
                    />
                )}

                <div className="w-full  md:w-[80%] overflow-y-auto hide-scrollbar" style={{ maxHeight: 'calc(100vh - 100px)' }}>
                    <main className="">
                        {renderProducts()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ShopByCategoryProduct;