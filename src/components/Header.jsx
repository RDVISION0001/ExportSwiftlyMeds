import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    FaIndustry
} from 'react-icons/fa';

import Logo from '../assets/Nlogo.png';
import { useAuth } from "../AuthContext/AuthContext";
import axiosInstance from "../AuthContext/AxiosInstance";
import Login from "../AuthContext/Login";
import Profile from '../components/Profile';
import { RiShutDownLine } from "react-icons/ri";
import { FiPackage } from "react-icons/fi";



const Header = () => {
    const navigate = useNavigate();
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
        logout
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

    // Refs for dropdown closing functionality
    const dropdownRef = useRef(null);
    const profileButtonRef = useRef(null);

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

    useEffect(() => {
        if (token) {
            setOpenModal(false);
            return;
        }

        const timeoutId = setTimeout(() => {
            setOpenModal(true);
        }, 5000);

        return () => clearTimeout(timeoutId);
    }, [token]);

    const handleProfileModal = () => {
        setProfileModal(false);
    }

    const handleProfileNavigate = () => {
        navigate('/orders');
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
                                        className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-50"
                                    >
                                        <ul className=" text-gray-700">
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
                                                    className="block w-full text-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    <span className="flex justify-center items-center gap-2"><FiPackage className="text-yellow-700" /> Orders</span>
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={logout}
                                                    className="block w-full text-center px-4 py-2 hover:bg-gray-100 cursor-pointer bg-red-300"
                                                >
                                                    <span className=" flex justify-center items-center gap-2 "><RiShutDownLine className="text-red-
                                                    " /> Logout</span>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Cart Icon */}
                            <Link
                                to="/shipping"
                                className="p-2 text-white hover:text-gray-200 relative transition-colors"
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
                                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors duration-200 flex items-center"
                            >
                                <FaHome className="mr-2 text-indigo-500" />
                                Home
                            </Link>

                            <div className="relative">
                                <button
                                    className="px-3 py-2 rounded-md cursor-pointer text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors duration-200 flex items-center"
                                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                                    onMouseEnter={() => setCategoriesOpen(true)}
                                >
                                    <FaBoxes className="mr-2 text-indigo-500" />
                                    Categories
                                    <FaChevronDown className={`ml-1 text-xs text-gray-500 transition-transform duration-200 ${categoriesOpen ? 'transform rotate-180' : ''}`} />
                                </button>

                                {categoriesOpen && (
                                    <div
                                        className="absolute left-0 mt-1 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 py-2 z-50 max-h-96 overflow-y-auto"
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
                                                }}
                                            >
                                                <span className="truncate">{category.categoryName}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {[
                                { path: "/about", icon: <FaUser className="mr-2 text-indigo-500" />, label: "About" },
                                { path: "/manufacture", icon: <FaIndustry className="mr-2 text-indigo-500" />, label: "Manufacturers" },
                                { path: "/faq", icon: <FaQq className="mr-2 text-indigo-500" />, label: "FAQ" },
                                { path: "/contact", icon: <FaEnvelope className="mr-2 text-indigo-500" />, label: "Contact" },
                                { path: "/blog", icon: <FaBlog className="mr-2 text-indigo-500" />, label: "Blog" }
                            ].map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors duration-200 flex items-center"
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
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors flex items-center"
                                >
                                    <FaHome className="mr-3 text-indigo-500" />
                                    Home
                                </Link>

                                <div className="border-t border-gray-200"></div>

                                <button
                                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                                    className="w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors flex items-center justify-between"
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
                                                }}
                                            >
                                                {category.categoryName}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="border-t border-gray-200"></div>

                                {[
                                    { path: "/about", icon: <FaUser className="mr-3 text-indigo-500" />, label: "About" },
                                    { path: "/manufacture", icon: <FaIndustry className="mr-3 text-indigo-500" />, label: "Manufacturers" },
                                    { path: "/faq", icon: <FaQq className="mr-3 text-indigo-500" />, label: "FAQ" },
                                    { path: "/contact", icon: <FaEnvelope className="mr-3 text-indigo-500" />, label: "Contact" },
                                    { path: "/blog", icon: <FaBlog className="mr-3 text-indigo-500" />, label: "Blog" }
                                ].map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-4 py-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors flex items-center"
                                    >
                                        {item.icon}
                                        {item.label}
                                    </Link>
                                ))}

                                <div className="border-t border-gray-200"></div>

                                <Link
                                    to="/account"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors flex items-center"
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
                    <Login onClose={() => setOpenModal(false)} />
                </div>
            )}

            {profileModal && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-brightness-50 z-[60]">
                    <div className="border border-gray-300 max-w-7xl w-full mx-4 bg-white rounded-lg shadow-xl overflow-auto-y h-[55vh]">
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
                        <Profile onClose={handleProfileModal} />
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;