import React, { useEffect, useRef, useState } from 'react';
// import Swal from 'sweetalert2';
import contact from "../../assets/contact.png";
// import con from "../../src/assets/contact1.png";


function ContactUs() {
    const topRef = useRef(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobileNumber: '',
        message: '',
        city: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Scroll to top on component mount
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            Swal.fire('Error', 'Please enter your full name', 'error');
            return false;
        }
        if (!formData.email.trim()) {
            Swal.fire('Error', 'Please enter your email', 'error');
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            Swal.fire('Error', 'Please enter a valid email address', 'error');
            return false;
        }
        if (!formData.mobileNumber.trim()) {
            Swal.fire('Error', 'Please enter your phone number', 'error');
            return false;
        }
        return true;
    };

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const response = await axiosInstance.post("/contact/addNewContact", formData);

            if (response.data) {
                Swal.fire({
                    icon: 'success',
                    title: 'Message Sent!',
                    text: 'Thank you for contacting us. We will get back to you soon.',
                    confirmButtonColor: '#000'
                });
                // Reset form
                setFormData({
                    fullName: '',
                    email: '',
                    mobileNumber: '',
                    message: '',
                    city: ''
                });
            } else {
                throw new Error(response.data.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to send message. Please try again later.',
                confirmButtonColor: '#000'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div ref={topRef}>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
                <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">Contact Us</h1>

                {/* Hero Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-16">
                    <div className="md:w-1/2">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                            SwiftlyMeds
                        </h2>
                        <p className="text-lg text-gray-600 mb-4">
                            No. 1 Herbal Wellness Brand for Men
                        </p>
                        <p className="text-lg font-medium text-gray-700">
                            Our Mission: Empower Men with Nature's Strength
                        </p>
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                        <img
                            src={contact}
                            alt="Men's wellness products"
                            className="w-full max-w-md rounded-lg shadow-md"
                            loading="lazy"
                        />
                    </div>
                </div>

                {/* Contact Form Section */}
                <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 rounded-xl">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                            {/* Contact Info */}
                            <div className="md:w-1/2 space-y-6">
                                <div className="text-center md:text-left">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Get in Touch</h1>
                                    <p className="text-lg text-gray-600">Need Help? We're Just a Call Away</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Visit Our Store</h2>
                                        <p className="text-gray-600 mb-6">Take our wellness test to find the perfect products for your needs.</p>
                                        <a
                                            href="https://www.google.com/maps?q=3715+XENOPHON+DR,+HOUSTON,+TX+77082-2922"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block bg-black hover:bg-gray-800 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
                                        >
                                            View on Map
                                        </a>
                                    </div>

                                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
                                        <div className="space-y-4">
                                            <div className="flex items-start">
                                                <svg className="w-5 h-5 mt-1 mr-3 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                <a href="tel:088580 43370" className="hover:underline text-gray-600 hover:text-gray-800">
                                                    088580 43370
                                                </a>
                                            </div>
                                            <div className="flex items-start">
                                                <svg className="w-5 h-5 mt-1 mr-3 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <a href="mailto:info@swiftlymeds.com" className="hover:underline text-gray-600 hover:text-gray-800">
                                                    info@swiftlymeds.com
                                                </a>
                                            </div>
                                            <div className="flex items-start">
                                                <svg className="w-5 h-5 mt-1 mr-3 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <div>
                                                    <a href="https://www.google.com/maps/search/H-6-K+Chandra+Chauraha+SA+20%2F205+Ashapur+Road+Hanuman+Nagar+Ashapur+Varanasi+Uttar+Pradesh+221007"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:underline hover:text-gray-700">
                                                        H-6-K, Chandra Chauraha, SA 20/205, Ashapur Road, Hanuman Nagar, Ashapur, Varanasi, Uttar Pradesh 221007
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="md:w-1/2 w-full">
                                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                                    <form className="space-y-6" onSubmit={sendMessage}>
                                        <div>
                                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                            <input
                                                type="text"
                                                id="fullName"
                                                value={formData.fullName}
                                                name='fullName'
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                                <input
                                                    type="tel"
                                                    id="mobileNumber"
                                                    name="mobileNumber"
                                                    value={formData.mobileNumber}
                                                    onChange={handleChange}
                                                    placeholder="(123) 456-7890"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="john@example.com"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                            <input
                                                type="text"
                                                id="city"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                placeholder="Your city"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows="4"
                                                placeholder="How can we help you?"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`w-full bg-black text-white font-medium py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800'}`}
                                        >
                                            {isSubmitting ? 'Sending...' : 'Send Message'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className='bg-gradient-to-r from-[#d9dbda] to-[#ddeee1] mt-16'>
                    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16'>
                        <div className='flex flex-col md:flex-row justify-between items-center gap-8'>
                            <div className='md:w-1/2 space-y-4'>
                                <h1 className='text-3xl md:text-4xl font-bold text-gray-800'>
                                    Explore our Premium Range
                                </h1>
                                <p className='text-lg text-gray-600'>
                                    Discover personalized wellness solutions tailored just for you
                                </p>
                                <button className='px-8 py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-colors duration-300 shadow-lg mt-6'>
                                    Visit Store
                                </button>
                            </div>
                            {/* <div className='md:w-1/2 flex justify-center'>
                                <img
                                    src={con}
                                    alt="Wellness products showcase"
                                    className='w-full max-w-md rounded-lg shadow-md'
                                    loading="lazy"
                                />
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactUs;