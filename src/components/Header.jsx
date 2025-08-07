import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    FaUser,
    FaShoppingCart,
    FaGlobe,
    FaMoneyBillWave,
    FaHome,
    FaBars,
    FaTimes,
    FaBoxes,
    FaEnvelope,
    FaBlog,
    FaChevronDown,
    FaQq,
    FaIndustry,
    FaFileInvoice
} from 'react-icons/fa';



import Logo from '../assets/Nlogo.png';
import { useAuth } from "../AuthContext/AuthContext";
import axiosInstance from "../AuthContext/AxiosInstance";
import Login from "../AuthContext/Login";
import Profile from '../components/Profile';
import { RiShutDownLine } from "react-icons/ri";
import { FiPackage } from "react-icons/fi";
import { Phone } from "lucide-react";
import Swal from "sweetalert2";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        cartCount,
        setCartCount,
        category,
        setCategory,
        catId,
        setCatId,
        setCatProduct,
        setLoading,
        setSelectCountry,
        itemsPerpage,
        token,
        user,
        refresh,
        logout,
        updatedData
    } = useAuth();

    const countryOptions = [
        { code: 'US', name: 'United States', currency: 'USD', language: 'English' },
        { code: 'IN', name: 'India', currency: 'INR', language: 'Hindi' },
        { code: 'GB', name: 'United Kingdom', currency: 'GBP', language: 'English' },
        { code: 'FR', name: 'France', currency: 'EUR', language: 'French' },
        { code: 'DE', name: 'Germany', currency: 'EUR', language: 'German' },
        { code: 'ES', name: 'Spain', currency: 'EUR', language: 'Spanish' },
        { code: 'RU', name: 'Russia', currency: 'RUB', language: 'Russian' },
        { code: 'CA', name: 'Canada', currency: 'CAD', language: 'English' },
        { code: 'AU', name: 'Australia', currency: 'AUD', language: 'English' },
        { code: 'JP', name: 'Japan', currency: 'JPY', language: 'Japanese' },
    ];

    const [selectedCountry, setSelectedCountry] = useState(countryOptions[0]);
    const [availableCurrencies] = useState(
        Array.from(new Set(countryOptions.map(country => country.currency)))
    );
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [profileModal, setProfileModal] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [showCloseButton, setShowCloseButton] = useState(true);
    const [loginAttempt, setLoginAttempt] = useState(0);
    const loginTimerRef = useRef(null);
    const [profileEditModal, setProfileEditModal] = useState(false);
    const [name, setName] = useState(user?.swiftUserName || '');
    const [phone, setPhone] = useState(user?.swiftUserPhone || '');
    const [activeMenu, setActiveMenu] = useState('');
    const [Isloading, setIsLoading] = useState(false)

    // Refs for dropdown closing functionality
    const dropdownRef = useRef(null);
    const profileButtonRef = useRef(null);

    // Set active menu based on current path
    useEffect(() => {
        const path = location.pathname;
        if (path === '/') {
            setActiveMenu('home');
        } else if (path === '/about') {
            setActiveMenu('about');
        } else if (path === '/manufacture') {
            setActiveMenu('manufacture');
        } else if (path === '/faq') {
            setActiveMenu('faq');
        } else if (path === '/contact') {
            setActiveMenu('contact');
        } else if (path === '/blog') {
            setActiveMenu('blog');
        } else if (path === '/CatProduct') {
            setActiveMenu('categories');
        } else if (path === '/orders') {
            setActiveMenu('orders');
        } else if (path === '/shipping') {
            setActiveMenu('cart');
        }
    }, [location]);

    const fetchCategory = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/product/get/productCategory');
            setCategory(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    const handleButtonClick = () => {
        if (token) {
            setDropdownOpen(!isDropdownOpen);
        } else {
            setOpenModal(true);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    const fetchCatProduct = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(
                `/product/getProductByPage?categoryId=${catId}&itemPerPage=${itemsPerpage}&currentPage=${1}`
            );
            setCatProduct(response.data.productList);
        } catch (error) {
            console.error('Error fetching category products:', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (catId) {
            fetchCatProduct();
        }
    }, [catId, itemsPerpage]);

    const getAllCartItems = async () => {
        try {
            const response = await axiosInstance.get(`/swift/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCartCount(response.data);
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };

    useEffect(() => {
        if (token) {
            getAllCartItems();
        }
    }, [refresh, token]);

    const handleCountryChange = (value) => {
        const selected = countryOptions.find(
            (c) => c.code === value || c.currency === value
        );
        if (selected) {
            setSelectedCountry(selected);
            setSelectCountry(selected);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setLoginAttempt(prev => prev + 1);

        // Clear any existing timer
        if (loginTimerRef.current) {
            clearTimeout(loginTimerRef.current);
        }

        // Set timer for next appearance based on attempt count
        if (loginAttempt === 0) {
            // First close - show again after 10 seconds
            loginTimerRef.current = setTimeout(() => {
                setOpenModal(true);
            }, 10000);
        } else if (loginAttempt === 1) {
            // Second close - show again after 30 seconds
            loginTimerRef.current = setTimeout(() => {
                setOpenModal(true);
                setShowCloseButton(false); // Disable close button after this
            }, 30000);
        }
    };

    useEffect(() => {
        // Initial timer - show after 1 second
        const initialTimer = setTimeout(() => {
            if (!token) {
                setOpenModal(true);
            }
        }, 1000);

        return () => {
            clearTimeout(initialTimer);
            if (loginTimerRef.current) {
                clearTimeout(loginTimerRef.current);
            }
        };
    }, [token]);

    const handleProfileModal = () => {
        setProfileModal(false);
    }

    const handleProfileNavigate = () => {
        navigate('/orders');
        navigate('/all_priscription')
        setDropdownOpen(false);
    }

    // Handle click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                profileButtonRef.current &&
                !profileButtonRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            const response = await axiosInstance.post(
                '/swiftlymeds/auth/update-profile',
                {
                    swiftUserName: name,
                    swiftUserPhone: phone
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            localStorage.setItem("user", JSON.stringify(response.data.updatedData));
            setIsLoading(false)
            Swal.fire({
                icon: 'success',
                text: response.data.message || 'Profile updated successfully',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.reload();
            });

            setProfileEditModal(false);
            setIsLoading(false)

        } catch (error) {
            console.error("Error updating profile:", error);
            setIsLoading(false)
            Swal.fire({
                icon: 'error',
                text: error.response?.data?.error || 'Failed to update profile',
                confirmButtonText: 'OK'
            });
        }
    };


    return (
        <>
            {/* First Header */}
            <header className="bg-gradient-to-r from-[#BBFBFF] to-[#A8F1FF] shadow-sm sticky top-0 z-50">
                <div className="max-w-8xl mx-auto px-4 md:px-20 py-3">
                    <div className="flex items-center justify-between">
                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden focus:outline-none text-start"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>

                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link to="/" className="flex items-center">
                                <img src={Logo} alt="Company Logo" className="md:w-48 w-40" />
                            </Link>
                        </div>

                        {/* Right Side - Icons and Login */}
                        <div className="flex items-center space-x-1 md:space-x-2">
                            {/* Language & Currency Selectors */}
                            <div className="flex-1 max-w-2xl mx-4 hidden md:block">
                                <div className="flex items-center space-x-4">
                                    <div className="relative flex items-center">
                                        <FaGlobe className="absolute left-3" />
                                        <select
                                            name="country"
                                            value={selectedCountry.code}
                                            onChange={(e) => handleCountryChange(e.target.value)}
                                            className="pl-10 pr-4 py-2 rounded-lg border border-black font-semibold focus:outline-none focus:ring-1 focus:ring-blue-400 appearance-none"
                                        >
                                            {countryOptions.map((country) => (
                                                <option
                                                    key={country.code}
                                                    value={country.code}
                                                >
                                                    {country.name} ({country.language})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="relative flex items-center">
                                        <FaMoneyBillWave className="absolute left-3" />
                                        <select
                                            name="currency"
                                            value={selectedCountry.currency}
                                            onChange={(e) => handleCountryChange(e.target.value)}
                                            className="pl-10 pr-4 py-2 rounded-lg border border-black cursor-pointer font-semibold focus:outline-none focus:ring-1 focus:ring-blue-400 appearance-none"
                                        >
                                            {availableCurrencies.map((currency) => (
                                                <option key={currency} value={currency}>
                                                    {currency}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Dropdown */}
                            <div className="relative hidden md:block">
                                <button
                                    ref={profileButtonRef}
                                    onClick={handleButtonClick}
                                    className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                                >
                                    <FaUser className="text-xl" />
                                    <span className="hidden md:inline font-medium">
                                        {user?.swiftUserName || "Login"}
                                    </span>
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div
                                        ref={dropdownRef}
                                        className="absolute right-0 mt-2 p-2 bg-white rounded-lg shadow-lg z-60"
                                    >
                                        <ul className=" text-gray-700 text-start">
                                            <li>
                                                <button
                                                    onClick={() => {
                                                        setProfileModal(true);
                                                        setDropdownOpen(false);
                                                    }}
                                                    className="block w-full text-center text-black cursor-pointer px-4 py-2 hover:bg-gray-100"
                                                >
                                                    <span className="flex justify-center items-center gap-2">
                                                        <FaUser /> Profile
                                                    </span>
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={handleProfileNavigate}
                                                    className={`block w-full text-center px-4 py-2 hover:bg-gray-100 cursor-pointer ${activeMenu === 'orders' ? 'bg-gray-100 text-indigo-600' : ''}`}
                                                >
                                                    <span className="flex justify-center items-center gap-2"><FiPackage className="text-yellow-700" /> Orders</span>
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={handleProfileNavigate}
                                                    className={`block w-full text-center px-4 py-2 hover:bg-gray-100 cursor-pointer ${activeMenu === 'Priscription' ? 'bg-gray-100 text-indigo-600' : ''}`}
                                                >
                                                    <span className="flex justify-center items-center gap-2 whitespace-nowrap"><FaFileInvoice className="text-yellow-700" />Priscription</span>
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={logout}
                                                    className="block w-full text-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    <span className=" flex justify-center items-center gap-2 "><RiShutDownLine className="text-red-500" /> Logout</span>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Cart Icon */}
                            <Link
                                to="/shipping"
                                className={`p-2 text-white hover:text-gray-200 relative transition-colors ${activeMenu === 'cart' ? 'text-indigo-600' : ''}`}
                            >
                                <FaShoppingCart className="text-xl text-black" />
                                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount.length || 0}
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Second Header */}
            <header className="bg-white shadow-sm sticky top-18.5 z-40 border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="justify-center items-center h-16 hidden md:flex">
                        <nav className="hidden md:flex items-center space-x-1">
                            <Link
                                to="/"
                                className={`px-3 py-2 rounded-md text-sm font-medium hover:text-indigo-600 hover:bg-gray-50 transition-colors duration-200 flex items-center ${activeMenu === 'home' ? 'text-indigo-600 bg-gray-100' : 'text-gray-700'}`}
                            >
                                <FaHome className="mr-2 text-indigo-500" />
                                Home
                            </Link>

                            <div className="relative">
                                <button
                                    className={`px-3 py-2 rounded-md cursor-pointer text-sm font-medium hover:text-indigo-600 hover:bg-gray-50 transition-colors duration-200 flex items-center ${activeMenu === 'categories' ? 'text-indigo-600 bg-gray-100' : 'text-gray-700'}`}
                                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                                >
                                    <FaBoxes className="mr-2 text-indigo-500" />
                                    Categories
                                    <FaChevronDown className={`ml-1 text-xs text-gray-500 transition-transform duration-200 ${categoriesOpen ? 'transform rotate-180' : ''}`} />
                                </button>

                                {categoriesOpen && (
                                    <div
                                        className="absolute left-0 mt-1 w-64 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-2 z-20 max-h-96 overflow-y-auto"
                                        onMouseLeave={() => setCategoriesOpen(false)}
                                    >
                                        {category.map((category) => (
                                            <button
                                                key={category.productCategoryId}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 flex items-center"
                                                onClick={() => {
                                                    navigate('/CatProduct');
                                                    setCatId(category.productCategoryId);
                                                    setCategoriesOpen(false);
                                                    setActiveMenu('categories');
                                                }}
                                            >
                                                <span className="truncate">{category.categoryName}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {[
                                { path: "/about", icon: <FaUser className="mr-2 text-indigo-500" />, label: "About", menuKey: "about" },
                                { path: "/manufacture", icon: <FaIndustry className="mr-2 text-indigo-500" />, label: "Manufacturers", menuKey: "manufacture" },
                                { path: "/faq", icon: <FaQq className="mr-2 text-indigo-500" />, label: "FAQ", menuKey: "faq" },
                                { path: "/contact", icon: <FaEnvelope className="mr-2 text-indigo-500" />, label: "Contact", menuKey: "contact" },
                                { path: "/blog", icon: <FaBlog className="mr-2 text-indigo-500" />, label: "Blog", menuKey: "blog" }
                            ].map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-3 py-2 rounded-md text-sm font-medium hover:text-indigo-600 hover:bg-gray-50 transition-colors duration-200 flex items-center ${activeMenu === item.menuKey ? 'text-indigo-600 bg-gray-100' : 'text-gray-700'}`}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden pb-4 border-t border-gray-200">
                            <div className="pt-2 space-y-1">
                                <Link
                                    to="/"
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        setActiveMenu('home');
                                    }}
                                    className={`px-4 py-3 text-base font-medium hover:text-indigo-600 hover:bg-gray-50 transition-colors flex items-center ${activeMenu === 'home' ? 'text-indigo-600 bg-gray-50' : 'text-gray-700'}`}
                                >
                                    <FaHome className="mr-3 text-indigo-500" />
                                    Home
                                </Link>

                                <div className="border-t border-gray-200"></div>

                                <button
                                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                                    className={`w-full text-left px-4 py-3 text-base font-medium hover:text-indigo-600 hover:bg-gray-50 transition-colors flex items-center justify-between ${activeMenu === 'categories' ? 'text-indigo-600 bg-gray-50' : 'text-gray-700'}`}
                                >
                                    <div className="flex items-center">
                                        <FaBoxes className="mr-3 text-indigo-500" />
                                        Categories
                                    </div>
                                    <FaChevronDown className={`transition-transform ${categoriesOpen ? 'transform rotate-180' : ''}`} />
                                </button>

                                {categoriesOpen && (
                                    <div className="ml-8 space-y-1 max-h-60 overflow-y-auto">
                                        {category.map((category) => (
                                            <button
                                                key={category.productCategoryId}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
                                                onClick={() => {
                                                    navigate('/CatProduct');
                                                    setCatId(category.productCategoryId);
                                                    setMobileMenuOpen(false);
                                                    setCategoriesOpen(false);
                                                    setActiveMenu('categories');
                                                }}
                                            >
                                                {category.categoryName}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="border-t border-gray-200"></div>

                                {[
                                    { path: "/about", icon: <FaUser className="mr-3 text-indigo-500" />, label: "About", menuKey: "about" },
                                    { path: "/manufacture", icon: <FaIndustry className="mr-3 text-indigo-500" />, label: "Manufacturers", menuKey: "manufacture" },
                                    { path: "/faq", icon: <FaQq className="mr-3 text-indigo-500" />, label: "FAQ", menuKey: "faq" },
                                    { path: "/contact", icon: <FaEnvelope className="mr-3 text-indigo-500" />, label: "Contact", menuKey: "contact" },
                                    { path: "/blog", icon: <FaBlog className="mr-3 text-indigo-500" />, label: "Blog", menuKey: "blog" }
                                ].map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            setActiveMenu(item.menuKey);
                                        }}
                                        className={`px-4 py-3 text-base font-medium hover:text-indigo-600 hover:bg-gray-50 transition-colors flex items-center ${activeMenu === item.menuKey ? 'text-indigo-600 bg-gray-50' : 'text-gray-700'}`}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </Link>
                                ))}

                                <div className="border-t border-gray-200"></div>

                                <Link
                                    to="/account"
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        setActiveMenu('account');
                                    }}
                                    className={`px-4 py-3 text-base font-medium hover:text-indigo-600 hover:bg-gray-50 transition-colors flex items-center ${activeMenu === 'account' ? 'text-indigo-600 bg-gray-50' : 'text-gray-700'}`}
                                >
                                    <FaUser className="mr-3 text-indigo-500" />
                                    <span>Login</span>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Modals */}
            {openModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50">
                    <Login
                        onClose={loginAttempt >= 2 ? undefined : handleCloseModal}
                        showCloseButton={showCloseButton && loginAttempt < 2}
                    />
                </div>
            )}

            {profileModal && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-brightness-50 z-[60]">
                    <div className=" bg-white rounded-md">
                        <div className="relative p-1">
                            <button
                                onClick={handleProfileModal}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 bg-white hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200"
                                aria-label="Close modal"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <Profile onClose={handleProfileModal} editeOpen={setProfileEditModal} />
                    </div>
                </div>
            )}

            {
                profileEditModal && (
                    <div className="fixed inset-0 flex items-center justify-center backdrop-brightness-50 z-[60]">
                        <div className=" bg-white rounded-md">
                            <div className="relative p-1">
                                <button
                                    onClick={() => setProfileEditModal(false)}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 bg-white hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200"
                                    aria-label="Close modal"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>

                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={phone}
                                            onChange={(e) => {
                                                // Remove all non-numeric characters
                                                const numericValue = e.target.value.replace(/\D/g, '');
                                                setPhone(numericValue);
                                            }}
                                            maxLength={15}
                                            inputMode="numeric" // Shows numeric keyboard on mobile devices
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter your phone number"
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            disabled={Isloading}
                                            type="submit"
                                            className={` 
                                                ${Isloading ? "cursor-not-allowed bg-blue-400" : "cursor-pointer bg-blue-600"} 
                                                w-full  hover:bg-blue-700 text-white font-medium 
                                                py-2 px-4 rounded-md transition duration-200 
                                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                                `}
                                        >
                                            {Isloading ? "Updating.." : "Update Profile"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default Header;