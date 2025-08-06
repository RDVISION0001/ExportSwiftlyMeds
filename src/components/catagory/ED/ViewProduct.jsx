import React, { useEffect, useRef, useState } from 'react';
import { FaChevronRight, FaHome, FaChevronDown } from 'react-icons/fa';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaFlask, FaBoxOpen, FaPills, FaMedkit } from 'react-icons/fa';
import { useAuth } from '../../../AuthContext/AuthContext';
import axiosInstance from '../../../AuthContext/AxiosInstance';
import Swal from 'sweetalert2';

const ProductDetailPage = () => {
    const { selectCountry, setCart, token, cartCount, setRefresh, currencyRates } = useAuth();
    const location = useLocation();
    const { product } = location.state || {};
    const topRef = useRef(null);
    const [activeImage, setActiveImage] = useState(0);
    const [openAccordion, setOpenAccordion] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState({});
    const [updatingItems, setUpdatingItems] = useState({});
    const [removing, setRemoving] = useState(false);
    const [currentId, setCurrentID] = useState('');
    const [activeLoadingButton, setActiveLoadingButton] = useState(null);
    const navigate = useNavigate();
    const [rate, setRates] = useState(1);
    const [zoomStyle, setZoomStyle] = useState({
        display: 'none',
        backgroundImage: `url(${product?.imageUrls?.[0]})`,
        backgroundSize: '200%',
        backgroundPosition: '0% 0%',
        width: '450px', // Fixed size for the preview
        height: '450px',
        position: 'fixed', // Fixed position
        top: '200px', // Adjust based on your layout
        left: '600px', // Position to the right of the main image
        borderRadius: '8px',
        border: '1px solid #ddd',
        zIndex: 100,
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        pointerEvents: 'none',
    });
    const [showZoom, setShowZoom] = useState(false);
    const imageRef = useRef(null);

    useEffect(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleMouseMove = (e) => {
        if (!imageRef.current) return;

        const { left, top, width, height } = imageRef.current.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;

        setZoomStyle(prev => ({
            ...prev,
            display: showZoom ? 'block' : 'none',
            backgroundImage: `url(${product?.imageUrls?.[activeImage]})`,
            backgroundSize: '200%',
            backgroundPosition: `${x}% ${y}%`,
        }));
    };

    const handleMouseEnter = () => {
        setShowZoom(true);
    };

    const handleMouseLeave = () => {
        setShowZoom(false);
        setZoomStyle(prev => ({ ...prev, display: 'none' }));
    };

    const getCurrencyRate = (selectCountry) => {
        if (!selectCountry || !selectCountry.currency) {
            setRates(1);
            return 1;
        }
        const rate = currencyRates[selectCountry.currency] || 1;
        setRates(rate);
        return rate;
    };

    useEffect(() => {
        getCurrencyRate(selectCountry);
    }, [selectCountry]);

    const currencySymbols = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        INR: '₹',
        AUD: 'A$',
        CAD: 'C$',
        SGD: 'S$',
        JPY: '¥',
        CNY: '¥',
        CHF: 'CHF',
        KRW: '₩',
        BRL: 'R$',
        ZAR: 'R',
        RUB: '₽',
        THB: '฿',
        MXN: '$',
        NOK: 'kr',
        SEK: 'kr',
        DKK: 'kr',
        PLN: 'zł',
        HUF: 'Ft',
        IDR: 'Rp',
        PHP: '₱',
        MYR: 'RM',
        TRY: '₺',
        NZD: 'NZ$',
        BGN: 'лв',
        RON: 'lei',
        CZK: 'Kč',
        ISK: 'kr',
        HKD: 'HK$',
        ILS: '₪',
    };

    const getCurrencySymbol = (currencyCode) => {
        return currencySymbols[currencyCode?.toUpperCase()] || currencyCode || '$';
    };

    useEffect(() => {
        if (selectCountry?.currency) {
            setCartItems(prevCart =>
                prevCart.map(item => ({
                    ...item,
                    currency: selectCountry.currency,
                    unitPrice: convertPrice(item.originalUnitPrice, item.originalCurrency, selectCountry.currency),
                    totalPrice: convertPrice(item.originalUnitPrice * item.quantity, item.originalCurrency, selectCountry.currency),
                }))
            );
        }
    }, [selectCountry]);

    const toggleAccordion = (section) => {
        setOpenAccordion(openAccordion === section ? null : section);
    };

    const convertPrice = (price, fromCurrency, toCurrency) => {
        if (fromCurrency === toCurrency || !toCurrency) return price;
        const rate = currencyRates[toCurrency] || 1;
        return parseFloat((price * rate).toFixed(2));
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

    const handleAddToCart = async (product, price, id, name, brand, quantity, pid) => {
        const loadingKey = `${id}-${pid}`;
        try {
            setLoading(prev => ({ ...prev, [loadingKey]: true }));
            const res = await axiosInstance.post(
                `/swift/cart/add`,
                {
                    productId: String(id),
                    quantity: String(1),
                    priceId: String(pid),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            Swal.fire({
                icon: 'success',
                title: res.data.message,
                confirmButtonText: 'OK',
            });
            setRefresh(prev => prev + 1);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Failed to Add',
                text: 'There was a problem adding the item to your cart',
                confirmButtonText: 'OK',
            });
        } finally {
            setLoading(prev => ({ ...prev, [loadingKey]: false }));
        }
    };

    const updateQuantity = async (productId, newQuantity, priceId, action) => {
        const loadingKey = `${priceId}-${action}`;
        try {
            setActiveLoadingButton(loadingKey);
            setUpdatingItems(prev => ({ ...prev, [priceId]: true }));
            await axiosInstance.post(
                `/swift/cart/update`,
                {
                    productId: String(productId),
                    quantity: String(newQuantity),
                    priceId: String(priceId),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setRefresh(prev => prev + 1);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'There was a problem updating the quantity',
                confirmButtonText: 'OK',
            });
        } finally {
            setActiveLoadingButton(null);
            setUpdatingItems(prev => ({ ...prev, [priceId]: false }));
        }
    };

    const removeItem = async (productId, priceId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!',
            cancelButtonText: 'Cancel',
        });
        if (result.isConfirmed) {
            try {
                setCurrentID(priceId);
                setRemoving(true);
                await axiosInstance.post(
                    `/swift/cart/remove`,
                    {
                        productId: String(productId),
                        priceId: String(priceId),
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                setRefresh(prev => prev + 1);
                Swal.fire({
                    icon: 'success',
                    title: 'Item Removed',
                    text: 'Item has been removed from your cart',
                    confirmButtonText: 'OK',
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Removal Failed',
                    text: 'There was a problem removing the item',
                    confirmButtonText: 'OK',
                });
            } finally {
                setCurrentID('');
                setRemoving(false);
            }
        }
    };

    const calculateTotal = () => {
        if (!cartCount || cartCount.length === 0) return 0;
        return cartCount.reduce((total, item) => {
            const itemTotal = item.prices?.reduce((sum, price) => {
                const convertedPrice = convertPrice(price.price, price.currency, selectCountry?.currency || 'USD');
                return sum + convertedPrice * price.quantity;
            }, 0);
            return total + (itemTotal || 0);
        }, 0);
    };

    return (
        <>
            <nav className="hidden md:flex mx-auto py-3 w-full bg-white fixed top-[138px] z-10 border border-gray-100">
                <ol className="inline-flex items-center space-x-2 text-sm font-medium mt-2 mx-4 md:mx-14 overflow-x-auto whitespace-nowrap">
                    <li className="flex items-center">
                        <Link
                            to="/"
                            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        >
                            <FaHome className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Home</span>
                        </Link>
                    </li>
                    <li className="flex items-center">
                        <FaChevronRight className="text-gray-400 mx-2 h-4 w-4" />
                        <Link
                            to="/CatProduct"
                            className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        >
                            {product?.categories?.categoryName || 'Products'}
                        </Link>
                    </li>
                    <li aria-current="page" className="flex items-center">
                        <FaChevronRight className="text-gray-400 mx-2 h-4 w-4" />
                        <span className="text-gray-500">{product?.name || 'NA'}</span>
                    </li>
                </ol>
            </nav>
            <div className="bg-gray-100 min-h-screen font-sans mt-10">
                <div className="w-[95%] mx-auto flex flex-col lg:flex-row justify-center items-start gap-2">
                    {/* Main Product Content */}
                    <div className="w-full lg:w-[75%] border border-gray-300 rounded-md my-2 lg:h-screen lg:overflow-y-auto hide-scrollbar">
                        <div className="mx-auto p-4 sm:px-6 lg:px-8">
                            {/* Product Gallery */}
                            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 flex flex-col lg:flex-row w-full mb-1">
                                {product && (
                                    <div className="flex flex-col items-center w-full lg:w-[45%] mb-6 lg:mb-0 relative">
                                        <div
                                            className="w-full h-64 sm:h-80 rounded-lg flex items-center justify-center overflow-hidden relative hover:cursor-grabbing"
                                            onMouseMove={handleMouseMove}
                                            onMouseEnter={handleMouseEnter}
                                            onMouseLeave={handleMouseLeave}
                                            ref={imageRef}
                                         >
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
                                        {showZoom && (
                                            <div className="zoom-preview border" style={zoomStyle} />
                                        )}
                                        {product.imageUrls && product.imageUrls.length > 1 && (
                                            <div className="flex flex-wrap justify-center gap-2 mt-4">
                                                {product.imageUrls.map((img, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => {
                                                            setActiveImage(index);
                                                            setZoomStyle(prev => ({
                                                                ...prev,
                                                                backgroundImage: `url(${img})`,
                                                            }));
                                                        }}
                                                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                                                            activeImage === index
                                                                ? 'border-blue-600 shadow-md'
                                                                : 'border-gray-200 hover:border-blue-400'
                                                        }`}
                                                     >
                                                        <img
                                                            src={img}
                                                            alt={`Thumbnail ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/* Product Info */}
                                <div className="rounded-xl p-4 sm:p-8 w-full lg:w-[75%]">
                                    <div className="mb-6 sm:mb-8">
                                        {product && (
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
                                                <div className="mb-2 sm:mb-0">
                                                    <span className="text-sm font-medium text-gray-500">Name:</span>
                                                    <span className="ml-2 font-semibold text-gray-900">{product.name || 'Generic'}</span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded-r-lg shadow-sm">
                                            <div className="flex items-start">
                                                <svg
                                                    className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 mr-2 sm:mr-3"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <p className="text-xs sm:text-sm text-yellow-800 font-medium">
                                                    <span className="font-semibold">Save More</span> - Unlock significant discounts with larger quantities
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:justify-start sm:gap-20">
                                            <div className="mb-4 sm:mb-0">
                                                <div className="flex items-start mb-3">
                                                    <div className="flex-shrink-0 mt-1 mr-2 sm:mr-3 text-indigo-600">
                                                        <FaFlask className="h-4 w-4 sm:h-5 sm:w-5" />
                                                    </div>
                                                    {product && (
                                                        <div>
                                                            <h3 className="text-xs sm:text-sm font-semibold text-gray-600">Strength</h3>
                                                            <p className="mt-1 text-gray-900 text-sm sm:text-base">
                                                                {product.strength || 'Not specified'}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 mt-1 mr-2 sm:mr-3 text-indigo-600">
                                                        <FaBoxOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                                                    </div>
                                                    {product && (
                                                        <div>
                                                            <h3 className="text-xs sm:text-sm font-semibold text-gray-600">Packaging</h3>
                                                            <p className="mt-1 text-gray-900 text-sm sm:text-base">
                                                                {product.packagingType || 'Not specified'}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-start mb-3">
                                                    <div className="flex-shrink-0 mt-1 mr-2 sm:mr-3 text-indigo-600">
                                                        <FaPills className="h-4 w-4 sm:h-5 sm:w-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xs sm:text-sm font-semibold text-gray-600">Composition</h3>
                                                        <p className="mt-1 text-gray-900 text-sm sm:text-base">
                                                            {product?.composition || 'Not specified'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 mt-1 mr-2 sm:mr-3 text-indigo-600">
                                                        <FaMedkit className="h-4 w-4 sm:h-5 sm:w-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xs sm:text-sm font-semibold text-gray-600">Used For</h3>
                                                        <p className="mt-1 text-gray-900 text-sm sm:text-base">
                                                            {product?.usedFor || 'Not specified'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Pricing Table */}
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-1">
                                <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200">
                                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Pricing Options</h2>
                                    {selectCountry?.currency && (
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                            Showing prices in {selectCountry.currency}{' '}
                                            {selectCountry.currency !== 'USD' && '(converted)'}
                                        </p>
                                    )}
                                </div>
                                <div className="overflow-x-auto">
                                    <div className="min-w-[600px] sm:min-w-full">
                                        <table className="w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        S.No
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        QTY
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Price/Pill
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Savings
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        PerPack
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {product?.prices.map((price, index) => {
                                                    const perPillPrice = price.maxPrice && price.quantity ? price.maxPrice / price.quantity : 0;
                                                    let savings = null;
                                                    if (index > 0 && product.prices[0]?.maxPrice && product.prices[0].quantity) {
                                                        const basePerPillPrice = product.prices[0].maxPrice / product.prices[0].quantity;
                                                        savings = basePerPillPrice * price.quantity - price.maxPrice;
                                                    }
                                                    return (
                                                        <tr key={price.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {index + 1}
                                                            </td>
                                                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {price.quantity}
                                                            </td>
                                                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {price.maxPrice && price.quantity ? (
                                                                    <div className="flex items-center">{displayConvertedPrice(perPillPrice, price.currency)}</div>
                                                                ) : (
                                                                    '-'
                                                                )}
                                                            </td>
                                                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {savings !== null && savings > 0 ? (
                                                                    <div className="text-green-600">Save {displayConvertedPrice(savings, price.currency)}</div>
                                                                ) : index === 0 ? (
                                                                    '-'
                                                                ) : (
                                                                    <div className="text-red-600">No savings</div>
                                                                )}
                                                            </td>
                                                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {price.maxPrice ? displayConvertedPrice(price.maxPrice, price.currency) : '-'}
                                                            </td>
                                                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <button
                                                                    className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
                                                                        loading[`${product.id}-${price.id}`] ? 'opacity-50 cursor-not-allowed' : ''
                                                                    }`}
                                                                    onClick={() =>
                                                                        handleAddToCart(
                                                                            product,
                                                                            price,
                                                                            product.id,
                                                                            product.name,
                                                                            product.brand,
                                                                            price.quantity,
                                                                            price.id
                                                                        )
                                                                    }
                                                                    disabled={loading[`${product.id}-${price.id}`]}
                                                                >
                                                                    {loading[`${product.id}-${price.id}`] ? (
                                                                        <span className="flex items-center">
                                                                            <svg
                                                                                className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                fill="none"
                                                                                viewBox="0 0 24 24"
                                                                            >
                                                                                <circle
                                                                                    className="opacity-25"
                                                                                    cx="12"
                                                                                    cy="12"
                                                                                    r="10"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth="4"
                                                                                ></circle>
                                                                                <path
                                                                                    className="opacity-75"
                                                                                    fill="currentColor"
                                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                                ></path>
                                                                            </svg>
                                                                            Adding...
                                                                        </span>
                                                                    ) : (
                                                                        'Add to Cart'
                                                                    )}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            {/* Product Details Accordion */}
                            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 mb-6 sm:mb-12">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-8">Product Details</h2>
                                <div className="space-y-2 sm:space-y-4">
                                    <div className="border-b border-gray-200">
                                        <button
                                            onClick={() => toggleAccordion('treatment')}
                                            className="w-full flex justify-between items-center py-3 text-sm sm:text-md font-semibold text-blue-700 focus:outline-none"
                                        >
                                            <span>Treatment</span>
                                            <FaChevronDown
                                                className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 ${
                                                    openAccordion === 'treatment' ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>
                                        {openAccordion === 'treatment' && (
                                            <div className="pb-3 text-gray-700 text-sm sm:text-base leading-relaxed">
                                                {product.treatment || 'Not specified'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="border-b border-gray-200">
                                        <button
                                            onClick={() => toggleAccordion('howItWorks')}
                                            className="w-full flex justify-between items-center py-3 text-sm sm:text-md font-semibold text-blue-700 focus:outline-none"
                                        >
                                            <span>How It Works</span>
                                            <FaChevronDown
                                                className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 ${
                                                    openAccordion === 'howItWorks' ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>
                                        {openAccordion === 'howItWorks' && (
                                            <div className="pb-3 text-gray-700 text-sm sm:text-base leading-relaxed">
                                                {product.howItWorks || 'Not specified'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="border-b border-gray-200">
                                        <button
                                            onClick={() => toggleAccordion('precautions')}
                                            className="w-full flex justify-between items-center py-3 text-sm sm:text-md font-semibold text-blue-700 focus:outline-none"
                                        >
                                            <span>Precautions</span>
                                            <FaChevronDown
                                                className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 ${
                                                    openAccordion === 'precautions' ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>
                                        {openAccordion === 'precautions' && (
                                            <div className="pb-3 text-gray-700 text-sm sm:text-base leading-relaxed">
                                                {product.precautions || 'Not specified'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="border-b border-gray-200">
                                        <button
                                            onClick={() => toggleAccordion('sideEffects')}
                                            className="w-full flex justify-between items-center py-3 text-sm sm:text-md font-semibold text-blue-700 focus:outline-none"
                                        >
                                            <span>Side Effects</span>
                                            <FaChevronDown
                                                className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 ${
                                                    openAccordion === 'sideEffects' ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>
                                        {openAccordion === 'sideEffects' && (
                                            <div className="pb-3 text-gray-700 text-sm sm:text-base leading-relaxed">
                                                {product.sideEffects || 'Not specified'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="border-b border-gray-200">
                                        <button
                                            onClick={() => toggleAccordion('storage')}
                                            className="w-full flex justify-between items-center py-3 text-sm sm:text-md font-semibold text-blue-700 focus:outline-none"
                                        >
                                            <span>Storage</span>
                                            <FaChevronDown
                                                className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 ${
                                                    openAccordion === 'storage' ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>
                                        {openAccordion === 'storage' && (
                                            <div className="pb-3 text-gray-700 text-sm sm:text-base leading-relaxed">
                                                {product.storage || 'Not specified'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Disclaimer Section */}
                            <div className="bg-gray-50 rounded-xl p-4 sm:p-8 shadow-sm">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Disclaimer</h3>
                                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                                    {product?.description || 'No disclaimer information available.'}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Cart Section */}
                    <div className="w-full lg:w-[25%] border border-gray-200 rounded-lg shadow-sm my-2 p-4 lg:h-screen lg:overflow-y-auto hide-scrollbar bg-white">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-400">Your Cart</h2>
                        {cartCount?.length > 0 ? (
                            <div className="space-y-3">
                                {cartCount.map((item, index) => (
                                    <div
                                        key={index}
                                        className="relative p-3 border border-gray-300 rounded-lg hover:shadow transition-shadow bg-gray-50"
                                    >
                                        <button
                                            onClick={() => removeItem(item.productId, item.priceId)}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                            aria-label="Remove item"
                                            disabled={updatingItems[item.priceId]}
                                        >
                                            {removing && item.priceId === currentId ? (
                                                <span className="loading loading-spinner loading-sm"></span>
                                            ) : (
                                                <FiTrash2 size={18} />
                                            )}
                                        </button>
                                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">{item.name}</h3>
                                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs sm:text-sm">
                                            <p className="text-gray-600">Price:</p>
                                            <p>
                                                {getCurrencySymbol(selectCountry.currency)} {(rate * item.price).toFixed(2)}
                                            </p>
                                            <p className="text-gray-600">Quantity:</p>
                                            <div className="flex justify-center items-center gap-1 border border-gray-300 rounded-md w-fit px-2 py-1">
                                                <button
                                                    onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1), item.priceId, 'minus')}
                                                    className={`p-1 rounded-md ${
                                                        item.quantity <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                                                    } transition-colors`}
                                                    disabled={item.quantity <= 1 || activeLoadingButton === `${item.priceId}-minus`}
                                                    aria-label="Decrease quantity"
                                                >
                                                    <div className="w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center">
                                                        {activeLoadingButton === `${item.priceId}-minus` ? (
                                                            <span className="loading loading-dots loading-xs"></span>
                                                        ) : (
                                                            <FiMinus size={12} />
                                                        )}
                                                    </div>
                                                </button>
                                                <span className="w-6 text-center font-medium text-gray-800">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1, item.priceId, 'plus')}
                                                    className={`p-1 rounded-md text-gray-700 hover:bg-gray-100 transition-colors ${
                                                        activeLoadingButton === `${item.priceId}-plus` ? 'pointer-events-none' : ''
                                                    }`}
                                                    disabled={activeLoadingButton === `${item.priceId}-plus`}
                                                    aria-label="Increase quantity"
                                                >
                                                    <div className="w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center">
                                                        {activeLoadingButton === `${item.priceId}-plus` ? (
                                                            <span className="loading loading-dots loading-xs"></span>
                                                        ) : (
                                                            <FiPlus size={12} />
                                                        )}
                                                    </div>
                                                </button>
                                            </div>
                                            <p className="text-gray-600">Total:</p>
                                            <p className="font-medium">
                                                {getCurrencySymbol(selectCountry.currency)} {(rate * item.total).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div className="text-center mt-4">
                                    <button
                                        onClick={() => navigate('/shipping')}
                                        className="bg-green-400 rounded-md px-3 py-2 text-white cursor-pointer text-sm sm:text-base w-full sm:w-auto"
                                    >
                                        Go to Cart
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center py-8">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mb-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                <p className="text-gray-500 mb-2 text-sm sm:text-base">Your cart is empty</p>
                                <p className="text-xs sm:text-sm text-gray-400">Add items to get started</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetailPage;