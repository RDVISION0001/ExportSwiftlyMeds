import React, { useEffect, useRef, useState } from 'react';
import { FaChevronRight, FaHome, FaChevronDown } from 'react-icons/fa';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaFlask, FaBoxOpen, FaPills, FaMedkit } from 'react-icons/fa';
import { useAuth } from '../../../AuthContext/AuthContext';
import axiosInstance from '../../../AuthContext/AxiosInstance';
import Swal from 'sweetalert2';

const ProductDetailPage = () => {
    const { selectCountry, setCart, token, cartCount, setRefresh } = useAuth();
    const currencyRates = {
        USD: 1,
        EUR: 0.93,
        GBP: 0.80,
        INR: 83.33,
        CAD: 1.36,
        AUD: 1.51,
        JPY: 151.61,
        RUB: 92.58
    };

    const location = useLocation();
    const { product } = location.state || {};
    console.log('product',product)
    const topRef = useRef(null);
    const [activeImage, setActiveImage] = useState(0);
    const [openAccordion, setOpenAccordion] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updatingItems, setUpdatingItems] = useState({}); // Track loading state for quantity updates
    const [removing, setRemoving] = useState(false)
    const [currentId, setCurrentID] = useState("")
    const [activeLoadingButton, setActiveLoadingButton] = useState(null);
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

    const handleAddToCart = async (product, price, id, name, brand, quantity, pid) => {
        const loadingKey = `${id}-${pid}`;

        try {
            setLoading(prev => ({ ...prev, [loadingKey]: true }));

            const res = await axiosInstance.post(`/swift/cart/add`,
                {
                    productId: String(id),
                    quantity: String(1),
                    priceId: String(pid)
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            Swal.fire({
                icon: 'success',
                title: res.data.message,
                text: ``,
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

        setCart(prevCart => {
            const existingIndex = prevCart.findIndex(item => item.product.id === product.id);
            if (existingIndex !== -1) {
                const updatedCart = [...prevCart];
                updatedCart[existingIndex].prices.push(price);
                return updatedCart;
            } else {
                return [
                    ...prevCart,
                    {
                        product,
                        name,
                        brand,
                        prices: [price],
                    },
                ];
            }
        });
    };

    const updateQuantity = async (productId, newQuantity, priceId, action) => {
        const loadingKey = `${priceId}-${action}`; // Create unique key for each button

        try {
            setActiveLoadingButton(loadingKey); // Set active loading button
            setUpdatingItems(prev => ({ ...prev, [priceId]: true }));

            await axiosInstance.post(`/swift/cart/update`,
                {
                    productId: String(productId),
                    quantity: String(newQuantity),
                    priceId: String(priceId)
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setRefresh(prev => prev + 1);
        } catch (error) {
            console.error("Error updating quantity:", error);
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'There was a problem updating the quantity',
                confirmButtonText: 'OK',
            });
        } finally {
            setActiveLoadingButton(null); // Reset loading state
            setUpdatingItems(prev => ({ ...prev, [priceId]: false }));
        }
    };
    const removeItem = async (productId, priceId) => {
        // Show confirmation dialog first
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!',
            cancelButtonText: 'Cancel'
        });

        // If user confirmed, proceed with deletion
        if (result.isConfirmed) {
            try {
                setCurrentID(priceId)
                setRemoving(true)
                await axiosInstance.post(`/swift/cart/remove`,
                    {
                        productId: String(productId),
                        priceId: String(priceId)
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                setRefresh(prev => prev + 1);
                Swal.fire({
                    icon: 'success',
                    title: 'Item Removed',
                    text: 'Item has been removed from your cart',
                    confirmButtonText: 'OK',
                });
                setCurrentID(null)
                setRemoving(false)
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Removal Failed',
                    text: 'There was a problem removing the item',
                    confirmButtonText: 'OK',
                });
                setCurrentID(null)
                setRemoving(false)
            }
        }
    };

    const calculateTotal = () => {
        if (!cartCount || cartCount.length === 0) return 0;

        return cartCount.reduce((total, item) => {
            const itemTotal = item.prices?.reduce((sum, price) => {
                const convertedPrice = convertPrice(price.price, price.currency, selectCountry?.currency || 'USD');
                return sum + (convertedPrice * price.quantity);
            }, 0);
            return total + (itemTotal || 0);
        }, 0);
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
                                    <div className="w-full h-80 rounded-lg flex items-center justify-center overflow-hidden">
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
                                                <span className="text-sm font-medium text-gray-500">Name:</span>
                                                <span className="ml-2 font-semibold text-gray-900">{product.name || 'Generic'}</span>
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

                                        <div className="flex justify-start gap-20">
                                            <div>
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
                                            </div>

                                            <div>
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
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Savings (only today)
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    PerPack
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {product.prices.map((price, index) => {
                                                // Calculate per pill price
                                                const perPillPrice = price.maxPrice && price.quantity
                                                    ? price.maxPrice / price.quantity
                                                    : 0;

                                                // Calculate savings
                                                let savings = null;
                                                if (index > 0 && product.prices[0] && product.prices[0].maxPrice && product.prices[0].quantity) {
                                                    const basePerPillPrice = product.prices[0].maxPrice / product.prices[0].quantity;
                                                    savings = (basePerPillPrice * price.quantity) - price.maxPrice;
                                                }

                                                return (
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
                                                                    {displayConvertedPrice(perPillPrice, price.currency)}
                                                                </div>
                                                            ) : '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {savings !== null && savings > 0 ? (
                                                                <div className="text-green-600">
                                                                    Save {displayConvertedPrice(savings, price.currency)}
                                                                </div>
                                                            ) : index === 0 ? (
                                                                '-'
                                                            ) : (
                                                                <div className="text-red-600">
                                                                    No savings
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {price.maxPrice ? displayConvertedPrice(price.maxPrice, price.currency) : '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                className={`cursor-pointer inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${loading[`${product.id}-${price.id}`] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                onClick={() => handleAddToCart(product, price, product.id, product.name, product.brand, price.quantity, price.id)}
                                                                disabled={loading[`${product.id}-${price.id}`]}
                                                            >
                                                                {loading[`${product.id}-${price.id}`] ? (
                                                                    <span className="flex items-center">
                                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
                    <div className="w-full md:w-[25%] border border-gray-200 rounded-lg shadow-sm my-2 p-4 h-screen overflow-y-auto hide-scrollbar bg-white">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-400">Your Cart</h2>

                        {cartCount?.length > 0 ? (
                            <div className="space-y-3">
                                {cartCount.map((item, index) => (
                                    <div key={index} className="relative p-3 border border-gray-300 rounded-lg hover:shadow transition-shadow bg-gray-50">
                                        <button
                                            onClick={() => removeItem(item.productId, item.priceId, item.quantity)}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                            aria-label="Remove item"
                                            disabled={updatingItems[item.priceId]}
                                        >
                                            {removing && item.priceId == currentId ? <span className="loading loading-spinner loading-sm"></span> : <FiTrash2 size={18} />}
                                        </button>

                                        <h3 className="font-medium text-gray-900">{item.name}</h3>

                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <p className="text-gray-600">Price:</p>
                                            <p>${item.price}</p>

                                            <p className="text-gray-600">Quantity:</p>
                                            <div className="flex justify-center items-center gap-1 border border-gray-300 rounded-md w-fit px-2 py-1">
                                                {/* Minus Button */}
                                                <button
                                                    onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1), item.priceId, "minus")}
                                                    className={`p-1 rounded-md ${item.quantity <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}
                                                    disabled={item.quantity <= 1 || activeLoadingButton === `${item.priceId}-minus`}
                                                    aria-label="Decrease quantity"
                                                >
                                                    <div className="w-4 h-4 flex items-center justify-center">
                                                        {activeLoadingButton === `${item.priceId}-minus` ? (
                                                            <span className="loading loading-dots loading-xs"></span>
                                                        ) : (
                                                            <FiMinus size={14} />
                                                        )}
                                                    </div>
                                                </button>

                                                {/* Quantity Display */}
                                                <span className="w-6 text-center text-sm font-medium text-gray-800">
                                                    {item.quantity}
                                                </span>

                                                {/* Plus Button */}
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1, item.priceId, "plus")}
                                                    className={`p-1 rounded-md text-gray-700 hover:bg-gray-100 transition-colors ${activeLoadingButton === `${item.priceId}-plus` ? 'pointer-events-none' : ''}`}
                                                    disabled={activeLoadingButton === `${item.priceId}-plus`}
                                                    aria-label="Increase quantity"
                                                >
                                                    <div className="w-4 h-4 flex items-center justify-center">
                                                        {activeLoadingButton === `${item.priceId}-plus` ? (
                                                            <span className="loading loading-dots loading-xs"></span>
                                                        ) : (
                                                            <FiPlus size={14} />
                                                        )}
                                                    </div>
                                                </button>
                                            </div>


                                            <p className="text-gray-600">Total:</p>
                                            <p className="font-medium">${item.total}</p>
                                        </div> 
                                         {/* <div className="mt-2 space-y-1">
                                            {item.prices?.map((priceObj, i) => (
                                                <div key={i} className="flex justify-between text-sm text-gray-600">
                                                    <span>${priceObj.price.toFixed(2)} x {priceObj.quantity}</span>
                                                    <span className="font-medium">${(priceObj.price * priceObj.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div> */}

                                    </div>
                                ))}
                                <div className='text-center mt-4'>
                                <button onClick={() => navigate('/shipping')} className='bg-green-400 rounded-md px-3 py-2 text-white cursor-pointer'>Go to Cart</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center py-8">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <p className="text-gray-500 mb-2">Your cart is empty</p>
                                <p className="text-sm text-gray-400">Add items to get started</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
};

export default ProductDetailPage;