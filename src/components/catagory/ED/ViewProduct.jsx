import React, { useEffect, useRef, useState } from 'react';
import { FaShoppingCart, FaHeart, FaShareAlt, FaChevronRight, FaHome, FaChevronDown, FaTimes } from 'react-icons/fa';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaFlask, FaBoxOpen, FaPills, FaMedkit } from 'react-icons/fa';
import { useAuth } from '../../../AuthContext/AuthContext';

const ProductDetailPage = () => {
    const { selectCountry } = useAuth();

    // Currency exchange rates (should be fetched from API in production)
    const currencyRates = {
        USD: 1,       // US Dollar (base)
        EUR: 0.93,    // Euro
        GBP: 0.80,    // British Pound
        INR: 83.33,   // Indian Rupee
        CAD: 1.36,    // Canadian Dollar
        AUD: 1.51,    // Australian Dollar
        JPY: 151.61,  // Japanese Yen
        RUB: 92.58    // Russian Ruble
    };

    const location = useLocation();
    const { product } = location.state || {};
    const topRef = useRef(null);
    const [activeImage, setActiveImage] = useState(0);
    const [openAccordion, setOpenAccordion] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();



    useEffect(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        // Update cart items when currency changes
        if (selectCountry?.currency) {
            setCartItems(prevCart =>
                prevCart.map(item => ({
                    ...item,
                    currency: selectCountry.currency,
                    unitPrice: convertPrice(item.originalUnitPrice, item.originalCurrency, selectCountry.currency),
                    totalPrice: convertPrice(item.originalUnitPrice * item.quantity, item.originalCurrency, selectCountry.currency)
                }))
            );
        }
    }, [selectCountry]);

    const toggleAccordion = (section) => {
        setOpenAccordion(openAccordion === section ? null : section);
    };

    const convertPrice = (price, fromCurrency, toCurrency) => {
        if (fromCurrency === toCurrency) return price;
        if (!currencyRates[fromCurrency] || !currencyRates[toCurrency]) return price;

        // Convert to USD first, then to target currency
        const usdValue = price / currencyRates[fromCurrency];
        const convertedValue = usdValue * currencyRates[toCurrency];
        return parseFloat(convertedValue.toFixed(2));
    };

    const getCurrencySymbol = (currencyCode) => {
        const symbols = {
            USD: '$',
            EUR: '€',
            GBP: '£',
            INR: '₹',
            CAD: 'CA$',
            AUD: 'A$',
            JPY: '¥',
            RUB: '₽'
        };
        return symbols[currencyCode] || currencyCode;
    };

    const formatPrice = (price, currencyCode) => {
        const symbol = getCurrencySymbol(currencyCode);
        return `${symbol}${price.toFixed(2)}`;
    };

    const displayConvertedPrice = (price, originalCurrency) => {
        const targetCurrency = selectCountry?.currency || originalCurrency;
        if (targetCurrency === originalCurrency) {
            return formatPrice(price, originalCurrency);
        }
        const converted = convertPrice(price, originalCurrency, targetCurrency);
        return (
            <>
                {formatPrice(converted, targetCurrency)}
                <span className="text-xs text-gray-500 ml-1">
                    ({formatPrice(price, originalCurrency)})
                </span>
            </>
        );
    };

    const handleAddToCart = (price) => {
        const existingItemIndex = cartItems.findIndex(
            item => item.priceId === price.id && item.productId === product.id
        );

        const targetCurrency = selectCountry?.currency || price.currency;
        const originalUnitPrice = price.maxPrice / price.quantity;
        const convertedUnitPrice = convertPrice(originalUnitPrice, price.currency, targetCurrency);
        const convertedTotalPrice = convertPrice(price.maxPrice, price.currency, targetCurrency);

        if (existingItemIndex >= 0) {
            const updatedCart = [...cartItems];
            updatedCart[existingItemIndex].quantity += price.quantity;
            updatedCart[existingItemIndex].totalPrice = convertPrice(
                updatedCart[existingItemIndex].originalUnitPrice * updatedCart[existingItemIndex].quantity,
                updatedCart[existingItemIndex].originalCurrency,
                targetCurrency
            );
            setCartItems(updatedCart);
        } else {
            const newItem = {
                productId: product.id,
                productName: product.name,
                priceId: price.id,
                imageUrl: product.imageUrls?.[0] || '',
                quantity: price.quantity,
                unitPrice: convertedUnitPrice,
                originalUnitPrice: originalUnitPrice,
                totalPrice: convertedTotalPrice,
                currency: targetCurrency,
                originalCurrency: price.currency,
                packaging: product.packagingType || 'Not specified',
                strength: product.strength || 'Not specified'
            };
            setCartItems([...cartItems, newItem]);
        }
    };

    const handleRemoveFromCart = (priceId) => {
        setCartItems(cartItems.filter(item => item.priceId !== priceId));
    };

    const handleQuantityChange = (priceId, newQuantity) => {
        if (newQuantity < 1) return;

        setCartItems(cartItems.map(item => {
            if (item.priceId === priceId) {
                const originalUnitPriceInUSD = item.originalUnitPrice / currencyRates[item.originalCurrency];
                const newTotalInUSD = originalUnitPriceInUSD * newQuantity;
                const convertedTotalPrice = newTotalInUSD * currencyRates[selectCountry?.currency || item.currency];

                return {
                    ...item,
                    quantity: newQuantity,
                    totalPrice: parseFloat(convertedTotalPrice.toFixed(2)),
                    unitPrice: convertPrice(item.originalUnitPrice, item.originalCurrency, selectCountry?.currency || item.currency)
                };
            }
            return item;
        }));
    };

    const calculateSubtotal = () => {
        return parseFloat(cartItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2));
    };

    return (
        <>
            <nav className="flex  mx-auto pt-3 w-full bg-white fixed top-[138px] z-80  border border-gray-100 " aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-2 text-sm font-medium mt-2 mx-14 ">
                    <li className="flex items-center">
                        <Link
                            to="/"
                            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        >
                            <FaHome className="mr-2 h-4 w-4" />
                            Home
                        </Link>
                    </li>
                    <li className="flex items-center">
                        <FaChevronRight className="text-gray-400 mx-2 h-4 w-4" />
                        <Link
                            to="/CatProduct"
                            className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        >
                            {product.categories?.categoryName || 'Products'}
                        </Link>
                    </li>
                    <li aria-current="page" className="flex items-center">
                        <FaChevronRight className="text-gray-400 mx-2 h-4 w-4" />
                        <span className="text-gray-500">{product.name}</span>
                    </li>
                </ol>
            </nav>
            <div className="bg-gray-100 min-h-screen font-sans  mt-10">
                <div className='w-[95%] mx-auto flex flex-col md:flex-row justify-center items-start gap-2'>
                    <div className='w-full md:w-[75%] border border-gray-300 rounded-md my-2 h-screen overflow-y-auto hide-scrollbar'>
                        <div className=" mx-auto p-4 sm:px-6 lg:px-8 ">
                            {/* Product Gallery */}
                            <div className="bg-white rounded-xl shadow-lg p-6 flex w-full mb-1">
                                <div className="flex flex-col items-center w-[45%] ">
                                    <div className="w-full h-96 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                                        {product.imageUrls && product.imageUrls.length > 0 ? (
                                            <img
                                                src={product.imageUrls[activeImage]}
                                                alt={product.name}
                                                className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                                            />
                                        ) : (
                                            <div className="text-gray-400 text-lg">No Image Available</div>
                                        )}
                                    </div>

                                    {product.imageUrls && product.imageUrls.length > 1 && (
                                        <div className="flex flex-wrap justify-center gap-3">
                                            {product.imageUrls.map((img, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setActiveImage(index)}
                                                    className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-all duration-200 ${activeImage === index ? 'border-blue-600 shadow-md' : 'border-gray-200 hover:border-blue-400'
                                                        }`}
                                                >
                                                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                                </button>

                                            ))}

                                        </div>
                                    )}
                                </div>
                                {/* Product Info */}
                                <div className="rounded-xl  p-8 w-[75%] ">
                                    <div className="mb-8">
                                        <div className="flex justify-between items-center mb-6">
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Brand:</span>
                                                <span className="ml-2 font-semibold text-gray-900">{product.brand || 'Generic'}</span>
                                            </div>

                                        </div>

                                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded-r-lg shadow-sm">
                                            <div className="flex items-start">
                                                <svg className="h-6 w-6 text-yellow-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <p className="text-sm text-yellow-800 font-medium">
                                                    <span className="font-semibold">Save More</span> - Unlock significant discounts with larger quantities
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 mt-1 mr-3 text-indigo-600">
                                                    <FaFlask className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-600">Strength</h3>
                                                    <p className="mt-1 text-gray-900 text-base">{product.strength || 'Not specified'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 mt-1 mr-3 text-indigo-600">
                                                    <FaBoxOpen className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-600">Packaging</h3>
                                                    <p className="mt-1 text-gray-900 text-base">{product.packagingType || 'Not specified'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 mt-1 mr-3 text-indigo-600">
                                                    <FaPills className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-600">Composition</h3>
                                                    <p className="mt-1 text-gray-900 text-base">{product.composition || 'Not specified'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 mt-1 mr-3 text-indigo-600">
                                                    <FaMedkit className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-600">Used For</h3>
                                                    <p className="mt-1 text-gray-900 text-base">{product.usedFor || 'Not specified'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Pricing Table */}
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-1">
                                <div className="px-8 py-6 border-b border-gray-200">
                                    <h2 className="text-2xl font-semibold text-gray-900">Pricing Options</h2>
                                    {selectCountry?.currency && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Showing prices in {selectCountry.currency} {selectCountry.currency !== 'USD' && '(converted)'}
                                        </p>
                                    )}
                                </div>
                                <div className="overflow-x-auto shadow-md rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    S.No
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    QTY
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Price/Pill
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {product.prices.map((price, index) => (
                                                <tr key={price.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {price.quantity}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {price.maxPrice && price.quantity ? (
                                                            <div className="flex items-center">
                                                                {displayConvertedPrice(price.maxPrice / price.quantity, price.currency)}
                                                            </div>
                                                        ) : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            className="cursor-pointer inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                                            onClick={() => handleAddToCart(price)}
                                                        >
                                                            Add to Cart
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Product Details Accordion */}
                            <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
                                <h2 className="text-xl font-bold text-gray-900 mb-8">Product Details</h2>
                                <div className="space-y-4">
                                    {/* Treatment Accordion */}
                                    <div className="border-b border-gray-200">
                                        <button
                                            onClick={() => toggleAccordion('treatment')}
                                            className="w-full flex justify-between items-center py-4 text-md font-semibold text-blue-700 focus:outline-none"
                                        >
                                            <span>Treatment</span>
                                            <FaChevronDown
                                                className={`h-5 w-5 transition-transform duration-200 ${openAccordion === 'treatment' ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </button>
                                        {openAccordion === 'treatment' && (
                                            <div className="pb-4 text-gray-700 leading-relaxed">
                                                {product.treatment || 'Not specified'}
                                            </div>
                                        )}
                                    </div>

                                    {/* How It Works Accordion */}
                                    <div className="border-b border-gray-200">
                                        <button
                                            onClick={() => toggleAccordion('howItWorks')}
                                            className="w-full flex justify-between items-center py-4 text-md font-semibold text-blue-700 focus:outline-none"
                                        >
                                            <span>How It Works</span>
                                            <FaChevronDown
                                                className={`h-5 w-5 transition-transform duration-200 ${openAccordion === 'howItWorks' ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </button>
                                        {openAccordion === 'howItWorks' && (
                                            <div className="pb-4 text-gray-700 leading-relaxed">
                                                {product.howItWorks || 'Not specified'}
                                            </div>
                                        )}
                                    </div>

                                    {/* Precautions Accordion */}
                                    <div className="border-b border-gray-200">
                                        <button
                                            onClick={() => toggleAccordion('precautions')}
                                            className="w-full flex justify-between items-center py-4 text-md font-semibold text-blue-700 focus:outline-none"
                                        >
                                            <span>Precautions</span>
                                            <FaChevronDown
                                                className={`h-5 w-5 transition-transform duration-200 ${openAccordion === 'precautions' ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </button>
                                        {openAccordion === 'precautions' && (
                                            <div className="pb-4 text-gray-700 leading-relaxed">
                                                {product.precautions || 'Not specified'}
                                            </div>
                                        )}
                                    </div>

                                    {/* Side Effects Accordion */}
                                    <div className="border-b border-gray-200">
                                        <button
                                            onClick={() => toggleAccordion('sideEffects')}
                                            className="w-full flex justify-between items-center py-4 text-md font-semibold text-blue-700 focus:outline-none"
                                        >
                                            <span>Side Effects</span>
                                            <FaChevronDown
                                                className={`h-5 w-5 transition-transform duration-200 ${openAccordion === 'sideEffects' ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </button>
                                        {openAccordion === 'sideEffects' && (
                                            <div className="pb-4 text-gray-700 leading-relaxed">
                                                {product.sideEffects || 'Not specified'}
                                            </div>
                                        )}
                                    </div>

                                    {/* Storage Accordion */}
                                    <div className="border-b border-gray-200">
                                        <button
                                            onClick={() => toggleAccordion('storage')}
                                            className="w-full flex justify-between items-center py-4 text-md font-semibold text-blue-700 focus:outline-none"
                                        >
                                            <span>Storage</span>
                                            <FaChevronDown
                                                className={`h-5 w-5 transition-transform duration-200 ${openAccordion === 'storage' ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </button>
                                        {openAccordion === 'storage' && (
                                            <div className="pb-4 text-gray-700 leading-relaxed">
                                                {product.storage || 'Not specified'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Disclaimer Section */}
                            <div className="bg-gray-50 rounded-xl p-8 shadow-sm">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Disclaimer</h3>
                                <p className="text-gray-700 leading-relaxed">{product.description || 'No disclaimer information available.'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Cart Section */}
                    <div className="w-full md:w-[25%] border border-gray-300 rounded-md my-2 p-4 h-screen overflow-y-auto hide-scrollbar bg-white">
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <FaShoppingCart className="mr-2" /> Shopping Cart
                            <span className="ml-auto bg-blue-500 text-white text-sm rounded-full px-2 py-1">
                                {cartItems.length}

                            </span>
                        </h2>

                        {cartItems.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">🛒 Your cart is empty</p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={item.priceId} className="border-b pb-4">
                                            <div className="flex items-start">
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.productName}
                                                    className="w-16 h-16 object-contain mr-3"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex justify-between">
                                                        <h3 className="font-medium">{item.productName}</h3>
                                                        <button
                                                            onClick={() => handleRemoveFromCart(item.priceId)}
                                                            className="text-gray-400 hover:text-red-500 cursor-pointer"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </div>
                                                    <p className="text-sm text-gray-500">{item.strength}</p>
                                                    <p className="text-sm text-gray-500">{item.packaging}</p>

                                                    <div className="flex items-center mt-2">
                                                        <span className="text-sm font-semibold">
                                                            {formatPrice(item.unitPrice, item.currency)} each
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-2">
                                                        <div className="flex items-center border border-gray-300 rounded p-1">
                                                            <button
                                                                onClick={() => handleQuantityChange(item.priceId, item.quantity - 1)}
                                                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="px-2">{item.quantity}</span>
                                                            <button
                                                                onClick={() => handleQuantityChange(item.priceId, item.quantity + 1)}
                                                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <span className="font-semibold">
                                                            {formatPrice(item.totalPrice, item.currency)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 border-t pt-4">
                                    <div className="flex justify-between font-semibold text-lg">
                                        <span>Subtotal:</span>
                                        <span>
                                            {cartItems.length > 0 ? (
                                                formatPrice(calculateSubtotal(), cartItems[0].currency)
                                            ) : (
                                                formatPrice(0, selectCountry?.currency || 'USD')
                                            )}
                                        </span>
                                    </div>
                                    <button
                                        className="w-full bg-green-500 text-white py-2 rounded mt-4 hover:bg-green-600 transition cursor-pointer"
                                        onClick={() => navigate('/checkout')}
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetailPage;