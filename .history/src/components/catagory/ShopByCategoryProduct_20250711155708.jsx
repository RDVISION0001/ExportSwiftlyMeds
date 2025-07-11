import React, { useEffect, useRef, useState } from 'react';
import { IoSearchOutline, IoArrowForward } from "react-icons/io5";
import { useAuth } from '../../AuthContext/AuthContext';

const ShopByCategoryProduct = () => {
    const { category, catProduct, setCatId, catId, loading,selectCountry } = useAuth();
    const [activePage, setActivePage] = useState(catId);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedManufacturer, setSelectedManufacturer] = useState('');
    const [expandedCategory, setExpandedCategory] = useState('');

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

    useEffect(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log("Produvt page",selectCountry)
    }, [selectCountry]);

    const renderProducts = () => {
        // Show loading state
        if (loading) {
            return (
                <div className="w-full flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600"></div>
                    <p className="text-gray-500 text-sm mt-4">Loading products...</p>
                </div>
            );
        }

        // Show data not found if catProduct is null or empty
        if (!catProduct || catProduct.length === 0) {
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

        // Render products if available
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4">
                {catProduct.map((product, index) => (
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
                                    className="max-h-30 w-40 object-contain group-hover:scale-105 transition-transform"
                                />
                                <div className='bg-blue-50 rounded-xl p-3 flex justify-center items-center group-hover:bg-blue-100 transition-colors'>
                                    <div className='flex flex-col items-center'>
                                        <p className="text-xl font-bold text-green-600 group-hover:text-green-700">
                                            ${product.prices?.[0]?.maxPrice / 100 ?? ''}
                                        </p>
                                        <span className='text-xs text-gray-500'>per pill</span>
                                    </div>
                                    <span>{console.log("AAA",product.)}</span>
                                    <span>{product.prices?.currency}</span>
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
                ))}
            </div>
        );
    };

    const toggleCategory = (categoryId) => {
        setExpandedCategory(expandedCategory === categoryId ? '' : categoryId);
    };

    return (
        <div ref={topRef} className='bg-white w-full py-8'>
            <div className="flex gap-6 max-w-8xl mx-auto px-4 md:10 lg:px-20">
                <div className="max-w-3xl flex-shrink-0">
                    <div className='p-4'>
                        <div className="sticky top-0 z-10 p-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
                        </div>
                        <nav className='h-[300px] overflow-y-auto'>
                            {category.map((cat) => (
                                <div key={cat.productCategoryId}>
                                    <button
                                        onClick={() => {
                                            toggleCategory(cat.productCategoryId);
                                            setActivePage(cat.productCategoryId);
                                            setCatId(cat.productCategoryId);
                                        }}
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
                    <div className='mt-6'>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-3 text-gray-800">Filters</h3>
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
                    </div>
                </div>

                <div className="flex-1">
                    <main className="mt-6">
                        {renderProducts()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ShopByCategoryProduct;