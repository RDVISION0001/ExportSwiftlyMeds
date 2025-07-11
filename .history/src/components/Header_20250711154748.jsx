import React, { useEffect, useState } from "react";
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
    FaUserTie,
    FaEnvelope,
    FaBlog,
    FaChevronDown,
    FaQq,
    FaIndustry
} from 'react-icons/fa';

import Logo from '../assets/Nlogo.png';
import { useAuth } from "../AuthContext/AuthContext";
import axiosInstance from "../AuthContext/AxiosInstance";


const Header = () => {
    const navigate = useNavigate();
    const { cart, amount, category, setCategory, catId, setCatId, setCatProduct, setLoading ,selectCountry, setSelectCountry } = useAuth(); // Get cart and amount from context
    // Calculate total item count
    const cartItemCount = cart
        ? Array.isArray(cart)
            ? cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
            : 1 // If cart is a single product object
        : 0; // If cart is null/undefined

    const countryOptions = [
        { code: 'IN', name: 'India', currency: 'INR', language: 'Hindi' },
        { code: 'US', name: 'United States', currency: 'USD', language: 'English' },
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
    const [hoveredCategory, setHoveredCategory] = useState(null);

    const fetchCategory = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/product/get/productCategory');
            console.log('dfdf', response);
            setCategory(response.data.data);
        } catch (error) {
            console.log('rer', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategory();
    }, [])

    const fetchCatProduct = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/product/getProductByPage?categoryId=${catId}&itemPerPage=${10}&currentPage=${1}`);
            console.log('product', response);
            setCatProduct(response.data.productList);
        } catch (error) {
            console.log('error', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCatProduct();
    }, [catId])

    const handleCountryChange = async(countryCode) => {
        const selected = countryOptions.find(c => c.code === countryCode);
        console.log("check",selected)
        setSelectedCountry(selected);
        await setSelectCountry(stringfy() )
        console.log("auth",selectCountry)
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
                        {/* Logo - Always visible */}
                        <div className="flex-shrink-0">
                            <Link to="/" className="flex items-center">
                                <img src={Logo} alt="" className="md:w-48 w-40" />
                            </Link>
                        </div>



                        {/* Right Side - Icons and Login - Always visible */}
                        <div className="flex items-center space-x-1 md:space-x-2">

                            {/* Language & Currency Selectors - Hidden on mobile */}
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
                                            onChange={(e) => {
                                                const selected = countryOptions.find(
                                                    c => c.currency === e.target.value
                                                );
                                                setSelectedCountry(selected);
                                            }}
                                            className="pl-10 pr-4 py-2 rounded-lg border border-black cursor-pointer font-semibold focus:outline-none focus:ring-1 focus:ring-blue-400 appearance-none"
                                        >
                                            {availableCurrencies.map((currency) => (
                                                <option
                                                    key={currency}
                                                    value={currency}
                                                >
                                                    {currency}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {/* Login - visible on all screens */}
                            <div className="relative group hidden md:block">
                                <Link to="/login" className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                                    <FaUser className="text-xl" />
                                    <span className="hidden md:inline  font-medium">Login</span>
                                </Link>
                            </div>
                            <Link to="/shipping" className="p-2 text-white hover:text-gray-200 relative transition-colors">
                                <FaShoppingCart className="text-xl text-black" />
                                <span className="absolute -top-1 -right-1 bg-blue-500  text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                            </Link>
                            <span className=" text-xs md:text-xl">
                                ${parseFloat(amount).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Second Header */}
            <header className="bg-white shadow-md sticky md:top-18.5 z-60">
                <div className="max-w-7xl mx-auto md:px-4 md:py-3">
                    <div className="flex justify-center items-center">
                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex md:space-x-3 lg:space-x-10 items-center font-semibold font-serif">
                            <Link to="/" className="flex items-center hover:text-indigo-600 transition-colors text-md">
                                <FaHome className="mr-2" /> Home
                            </Link>

                            {/* Categories Dropdown */}
                            <div className="relative group">
                                <div className="flex items-center hover:text-indigo-600 transition-colors duration-200 text-md cursor-pointer">
                                    <FaBoxes className="mr-2" />
                                    Categories
                                    <FaChevronDown className="ml-1 text-xs transition-transform duration-200 group-hover:rotate-180" />
                                </div>

                                {/* Dropdown Menu */}
                                <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100 
                                origin-top transform-gpu
                                scale-y-0 group-hover:scale-y-100 
                                opacity-0 group-hover:opacity-100
                                transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] h-[400px] overflow-y-auto">
                                    {category.map((category, index) => (
                                        <p
                                            key={index}
                                            className="flex items-center px-4 py-2 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
                                            onClick={() => { navigate('/CatProduct'); setCatId(category.productCategoryId) }}
                                        >
                                            {/* {category.icon} */}
                                            {category.categoryName}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* Other navigation links */}
                            <Link to="/about" className="flex items-center hover:text-indigo-600 transition-colors text-md">
                                <FaUser className="mr-2" /> About
                            </Link>
                            <Link to="/manufacture" className="flex items-center hover:text-indigo-600 transition-colors text-md">
                                <FaIndustry className="mr-2" /> Manufacturers
                            </Link>
                            <Link to="/faq" className="flex items-center hover:text-indigo-600 transition-colors text-md">
                                <FaQq className="mr-2" /> FAQ
                            </Link>
                            <Link to="/contact" className="flex items-center hover:text-indigo-600 transition-colors text-md">
                                <FaEnvelope className="mr-2" /> Contact Us
                            </Link>
                            <Link to="/blog" className="flex items-center hover:text-indigo-600 transition-colors text-md">
                                <FaBlog className="mr-2" /> Blog
                            </Link>
                        </nav>


                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <nav className="md:hidden mt-4 pb-4 space-y-3">
                            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded transition-colors flex items-center">
                                <FaHome className="mr-2" /> Home
                            </Link>
                            <button
                                onClick={() => setCategoriesOpen(!categoriesOpen)}
                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded transition-colors flex items-center justify-between"
                            >
                                <div className="flex items-center">
                                    <FaBoxes className="mr-2" /> Categories
                                </div>
                                <FaChevronDown className={`transition-transform ${categoriesOpen ? 'transform rotate-180' : ''}`} />
                            </button>

                            {categoriesOpen && (
                                <div className="ml-8 space-y-2 h-[400px] overflow-y-auto">
                                    {category.map((category, index) => (
                                        <Link
                                            key={index}
                                            to={category.path}
                                            className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded transition-colors"
                                            onClick={() => {
                                                setMobileMenuOpen(false);
                                                setCategoriesOpen(false);
                                            }}
                                        >
                                            {category.categoryName}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Other mobile menu links */}
                            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded transition-colors flex items-center">
                                <FaUser className="mr-2" /> About
                            </Link>
                            <Link to="/manufacture" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded transition-colors flex items-center">
                                <FaIndustry className="mr-2" /> Manufacturers
                            </Link>
                            <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded transition-colors flex items-center">
                                <FaUserTie className="mr-2" /> FAQ
                            </Link>
                            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded transition-colors flex items-center">
                                <FaQq className="mr-2" /> Contact Us
                            </Link>
                            <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded transition-colors flex items-center">
                                <FaBlog className="mr-2" /> Blog
                            </Link>
                            <Link to="/account" className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded transition-colors flex items-center">
                                <FaUser className=" mr-2" />
                                <span className="font-medium">Login</span>
                            </Link>
                        </nav>
                    )}
                </div>
            </header>
        </>
    );
};

export default Header;