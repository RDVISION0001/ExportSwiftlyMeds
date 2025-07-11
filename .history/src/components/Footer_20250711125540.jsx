import React, { useEffect, useReducer, useRef } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import hippa from '../assets/hippa.png'

import { FaXTwitter } from "react-icons/fa6";


const Footer = () => {

  const topRef = useRef(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [])
  return (
    <footer ref={topRef} className="bg-[#06202B] text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-4">SWIFTLY MEDS PRIVATE LIMITED</h2>
            <p className="mb-6 text-lg">
              Offering hundreds of common (and often life-saving) medications at the most affordable prices.
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-4 mb-6">
              <a
                href="https://www.facebook.com/profile.php?id=61573859501526"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://x.com/swiftlymeds"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
              >
                <FaXTwitter size={24} />
              </a>
              <a
                href="https://www.instagram.com/swiftlymeds/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF0B55] hover:text-[#CF0F47] transition-colors"
              >
                <FaInstagram size={24} />
              </a>
              {/* <a
                  href="https://www.instagram.com/swiftlymeds/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                 <FaLinkedin size={24} />
                </a> */}
              <a
                href="https://www.youtube.com/@SwiftlyMeds"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#CB0404] hover:text-[#EA2F14] transition-colors"
              >
                <FaYoutube size={24} />
              </a>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
            <p className="mb-4">
              Subscribe to our newsletter for special offers, new products, and updates.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 border border-gray-300 rounded w-full"
              />
              <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+918858043370" className="hover:underline hover:text-gray-300">
                  +91 88580 43370
                </a>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@swiftlymeds.com" className="hover:underline text-white hover:text-gray-300">info@swiftlymeds.com</a>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <a href="https://www.google.com/maps/search/H-6-K+Chandra+Chauraha+SA+20%2F205+Ashapur+Road+Hanuman+Nagar+Ashapur+Varanasi+Uttar+Pradesh+221007"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-gray-300">
                    H-6-K, Chandra Chauraha, SA 20/205, Ashapur Road, Hanuman Nagar, Ashapur, Varanasi, Uttar Pradesh 221007
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8 border-t border-gray-200 pt-8">
          <div>
            <h4 className="font-semibold mb-3">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/newArive" className="hover:text-blue-600 hover:underline">New Arrivals</Link></li>
              <li><Link to="/seller" className="hover:text-blue-600 hover:underline">Best Sellers</Link></li>
              <li><Link to="/marketPlace" className="hover:text-blue-600 hover:underline">Swiftly Marketplace</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Services</h4>
            <ul className="space-y-2">
              <li><Link to="/proserve" className="hover:text-blue-600 hover:underline">Products & services details with pricing structure</Link></li>
              <li><Link to="/blog" className="hover:text-blue-600 hover:underline">Blog</Link></li>
              <li><Link to="/priRefil" className="hover:text-blue-600 hover:underline">Prescription Refills</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/our" className="hover:text-blue-600 hover:underline">Our Mission</Link></li>
              <li><Link to="/about" className="hover:text-blue-600 hover:underline">About Us</Link></li>
              <li><Link to="/career" className="hover:text-blue-600 hover:underline">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/faq" className="hover:text-blue-600 hover:underline">FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-blue-600 hover:underline">Contact Us</Link></li>
              <li><Link to="/deliveryShipping" className="hover:text-blue-600 hover:underline">Delivery & Shipping Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="hover:text-blue-600 hover:underline">Privacy Policy</Link></li>
              <div className="flex justify-start items-center">
                <li><Link to="/hipaa" className="hover:text-blue-600 hover:underline">Hipaa Policy</Link></li>
                <img src={hippa} alt="" className="h-10 w-10 rounded-full"/>
              </div>
              <li><Link to="/pci-dss" className="hover:text-blue-600 hover:underline">PCI DSS Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-600 hover:underline">Terms & conditions</Link></li>
              <li><Link to="/refund" className="hover:text-blue-600 hover:underline">Refund and cancellation policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-6 text-sm text-center md:text-left">
          <div className="flex justify-start items-center gap-2 ">

            {/* DMCA Badge */}
            <a
              href="//www.dmca.com/Protection/Status.aspx?ID=43247472-5597-4c7e-8677-b13660b7a2ab"
              title="DMCA.com Protection Status"
              className="dmca-badge"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://images.dmca.com/Badges/dmca_protected_sml_120n.png?ID=43247472-5597-4c7e-8677-b13660b7a2ab"
                alt="DMCA.com Protection Status"
              />
            </a>
            <p>
              © 2025 Swiftly Meds Private Limited. All rights reserved CIN: U21001UP2024PTC211871
            </p>



            {/* Load DMCA Badge Script */}
            <script src="https://images.dmca.com/Badges/DMCABadgeHelper.min.js"></script>

          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;