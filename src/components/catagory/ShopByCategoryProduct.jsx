import React, { useEffect, useRef, useState, useMemo } from 'react';
import { IoSearchOutline, IoArrowForward, IoMenu, IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useAuth } from '../../AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../AuthContext/AxiosInstance';

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
    const [selectedBrandId, setSelectedBrandId] = useState('');
    const [selectedManufacturer, setSelectedManufacturer] = useState('');
    const [selectedManufacturerId, setSelectedManufacturerId] = useState('');
    const [expandedCategory, setExpandedCategory] = useState('');
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [brands, setBrands] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [searchBrand, setSearchBrand] = useState('');
    const [searchManufacturer, setSearchManufacturer] = useState('');
    const [searchProduct, setSearchProduct] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [productList, setProductList] = useState([]);
    const [isBrandLoading, setIsBrandLoading] = useState(false);
    const [isManufacturerLoading, setIsManufacturerLoading] = useState(false);
    const itemsPerPage = itemsPerpage || 20;
    const navigate = useNavigate();
    const topRef = useRef(null);

    // Detect forced reload and call clearAllFilters
    useEffect(() => {
        // This runs on component mount, simulating a reload
        clearAllFilters();

        // Fetch brands and manufacturers
        getAllBrands();
        getAllManufacturers();

        // Optional: Add event listener for page reload
        const handleLoad = () => {
            clearAllFilters();
        };

        window.addEventListener('load', handleLoad);

        return () => {
            window.removeEventListener('load', handleLoad);
        };
    }, []); // Empty dependency array ensures this runs only on mount

    const getAllBrands = async () => {
        try {
            const response = await axiosInstance.get(`/product/brand/getBrandsBy/status?status=y`);
            setBrands(response.data.data);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    const getAllManufacturers = async () => {
        try {
            const response = await axiosInstance.get(`/product/manufacturer/get/productManufacturer?status=y`);
            setManufacturers(response.data.data);
        } catch (error) {
            console.error('Error fetching manufacturers:', error);
        }
    };

    const getBrandByProduct = async (brandId) => {
        try {
            setIsBrandLoading(true);
            const response = await axiosInstance.get(`/product/brand/products/by-brand?brandId=${brandId}&itemPerPage=20&pageNumber=1&isActive=y`);
            setProductList(response.data.productList);
            setIsBrandLoading(false);
        } catch (error) {
            console.error("Error fetching brand by product:", error);
            setIsBrandLoading(false);
        }
    };

    const getManufacturerByProduct = async (manufacturerId) => {
        try {
            setIsManufacturerLoading(true);
            const response = await axiosInstance.get(`/product/manufacturer/products/by-manufacturer?manufacturerId=${manufacturerId}&itemPerPage=20&pageNumber=1&isActive=y`);
            setProductList(response.data.productList);
            setIsManufacturerLoading(false);
        } catch (error) {
            console.error("Error fetching manufacturer by product:", error);
            setIsManufacturerLoading(false);
        }
    };

    const callAnAPI = async (data) => {
        try {
            if (data.brandId) {
                await getBrandByProduct(data.brandId);
                setSelectedBrand(data.brandName);
                setSelectedBrandId(data.brandId);
                setSelectedManufacturer('');
                setSelectedManufacturerId('');
                setSearchProduct('');
                setCurrentPage(1);
            } else if (data.manufacturerId) {
                await getManufacturerByProduct(data.manufacturerId);
                setSelectedManufacturer(data.name);
                setSelectedManufacturerId(data.manufacturerId);
                setSelectedBrand('');
                setSelectedBrandId('');
                setSearchProduct('');
                setCurrentPage(1);
            }
        } catch (error) {
            console.error("API call failed:", error);
        }
    };

    // Filter brands based on search term
    const filteredBrands = useMemo(() => {
        if (!searchBrand) return brands;
        return brands.filter(brand =>
            brand.brandName.toLowerCase().includes(searchBrand.toLowerCase())
        );
    }, [brands, searchBrand]);

    // Filter manufacturers based on search term
    const filteredManufacturers = useMemo(() => {
        if (!searchManufacturer) return manufacturers;
        return manufacturers.filter(manufacturer =>
            manufacturer.name.toLowerCase().includes(searchManufacturer.toLowerCase())
        );
    }, [manufacturers, searchManufacturer]);

    const filteredProducts = useMemo(() => {
        // When browsing by brand or manufacturer, use the full productList with only search filter
        if (productList.length > 0) {
            return productList.filter(product => {
                const nameMatch = !searchProduct ||
                    product.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
                    (product.genericName && product.genericName.toLowerCase().includes(searchProduct.toLowerCase()));
                return nameMatch;
            });
        }
        // When browsing by category, use catProduct with all filters
        return (catProduct || []).filter(product => {
            const brandMatch = !selectedBrand || product.brand === selectedBrand;
            const manufacturerMatch = !selectedManufacturer || product.manufacturer === selectedManufacturer;
            const nameMatch = !searchProduct ||
                product.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
                (product.genericName && product.genericName.toLowerCase().includes(searchProduct.toLowerCase()));
            return brandMatch && manufacturerMatch && nameMatch;
        });
    }, [productList, catProduct, selectedBrand, selectedManufacturer, searchProduct]);

    const filteredCategories = category.filter(cat =>
        cat.categoryName.toLowerCase().includes(searchCategory.toLowerCase())
    );

    // Pagination
    const totalItems = filteredProducts?.length || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentItems = filteredProducts?.slice(startIndex, endIndex) || [];

    // Products to display - use productList for brands/manufacturers, currentItems for categories
    const productsToDisplay = productList.length > 0 ? filteredProducts : currentItems;

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
        setProductList([]);
        setSelectedBrand('');
        setSelectedBrandId('');
        setSelectedManufacturer('');
        setSelectedManufacturerId('');
        setSearchProduct('');
        setCurrentPage(1);
        if (window.innerWidth < 768) setShowMobileSidebar(false);
    };

    const handleBrandSelect = (brand) => {
        callAnAPI(brand);
    };

    const handleManufacturerSelect = (manufacturer) => {
        callAnAPI(manufacturer);
    };

    const clearAllFilters = () => {
        setSelectedBrand('');
        setSelectedBrandId('');
        setSelectedManufacturer('');
        setSelectedManufacturerId('');
        setSearchProduct('');
        setSearchCategory('');
        setProductList([]);
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
        if (loading || isBrandLoading || isManufacturerLoading) return (
            <div className="w-full flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600"></div>
                <p className="text-gray-500 text-sm mt-4">Loading products...</p>
            </div>
        );

        if (!productsToDisplay?.length) return (
            <div className="w-full flex flex-col items-center justify-center py-12">
                <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500 text-sm">Try changing your filters or check back later</p>
                {(selectedBrand || selectedManufacturer || searchProduct || productList.length > 0) && (
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
                    {productsToDisplay.map((product) => {
                        const originalPrice = product.prices?.[0]?.maxPrice / 100 || 0;
                        const perPillPrice = originalPrice ? originalPrice / 100 : 0;

                        return (
                            <article
                                key={`product-${product.id}`}
                                className="border border-gray-300 rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:border-green-200 hover:scale-[1.02] group cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
                                onClick={() => navigate('/view', { state: { product } })}
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
                {/* Only show pagination when browsing by category (productList is empty) */}
                {productList.length === 0 && renderPagination()}
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
                                <div className="relative w-full mt-2">
                                    <input
                                        type="text"
                                        placeholder="Search categories..."
                                        className="w-full py-2 pl-4 pr-10 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        value={searchCategory}
                                        onChange={(e) => setSearchCategory(e.target.value)}
                                    />
                                    <IoSearchOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                            <nav className='h-[300px] overflow-y-auto'>
                                {filteredCategories.length > 0 ? (
                                    filteredCategories.map((cat) => (
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
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 py-2">No categories found</p>
                                )}
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
                                    {filteredBrands.length > 0 ? (
                                        filteredBrands.map((brand) => (
                                            <div key={`brand-${brand.brandId}`}>
                                                <button
                                                    onClick={() => handleBrandSelect(brand)}
                                                    className={`flex items-center w-full py-2 text-left transition-colors duration-200 rounded-md hover:bg-gray-100 hover:text-teal-600 ${selectedBrandId === brand.brandId
                                                        ? "bg-gray-50 text-teal-600"
                                                        : "text-gray-600"
                                                        }`}
                                                >
                                                    <IoArrowForward
                                                        className={`mr-2 transition-transform duration-200 ${selectedBrandId === brand.brandId ? "rotate-90" : ""
                                                            }`}
                                                    />
                                                    <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                                                        {brand.brandName}
                                                    </span>
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 py-2">No brands found</p>
                                    )}
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
                                    {filteredManufacturers.length > 0 ? (
                                        filteredManufacturers.map((manu) => (
                                            <div key={`manu-${manu.manufacturerId}`}>
                                                <button
                                                    onClick={() => handleManufacturerSelect(manu)}
                                                    className={`flex items-center w-full py-2 text-left transition-colors duration-200 rounded-md hover:bg-gray-100 hover:text-teal-600 ${selectedManufacturerId === manu.manufacturerId
                                                        ? "bg-gray-50 text-teal-600"
                                                        : "text-gray-600"
                                                        }`}
                                                >
                                                    <IoArrowForward
                                                        className={`mr-2 transition-transform duration-200 ${selectedManufacturerId === manu.manufacturerId ? "rotate-90" : ""
                                                            }`}
                                                    />
                                                    <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                                                        {manu.name || "Unnamed"}
                                                    </span>
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 py-2">No manufacturers found</p>
                                    )}
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

                <div className="w-full md:w-[80%] overflow-y-auto hide-scrollbar" style={{ maxHeight: 'calc(100vh - 100px)' }}>
                    {/* Flex container for All button and search input */}
                    <div className="p-4 bg-white">
                        <div className="flex items-center gap-4 mb-4">
                            <button onClick={clearAllFilters} className='bg-[#04999b] px-4 py-2 rounded-md text-white'>
                                All
                            </button>
                            <div className="w-1/2 relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full py-2 pl-4 pr-10 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    value={searchProduct}
                                    onChange={(e) => {
                                        setSearchProduct(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                                <IoSearchOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {(selectedBrand || selectedManufacturer) && (
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold">
                                    Products for {selectedBrand ? `brand: ${selectedBrand}` : `manufacturer: ${selectedManufacturer}`}
                                </h2>
                                <button
                                    onClick={clearAllFilters}
                                    className="text-sm text-teal-600 hover:text-teal-800"
                                >
                                    Show all products
                                </button>
                            </div>
                        )}
                    </div>

                    <main>
                        {renderProducts()}
                    </main>
                </div>

            </div>
        </div>
    );
};

export default ShopByCategoryProduct;