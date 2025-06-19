import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#06202B] text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-4">SWIFTLY MEDS PRIVATE LIMITED</h2>
            <p className="mb-6 text-lg">
              Offering hundreds of common (and often life-saving) medications at the most affordable prices.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4 mb-6">
              <Link to="" className=" hover:text-blue-600 transition-colors">
                <FaFacebook size={24} />
              </Link>
              <Link to="" className=" hover:text-blue-400 transition-colors">
                <FaTwitter size={24} />
              </Link>
              <Link to="" className=" hover:text-pink-600 transition-colors">
                <FaInstagram size={24} />
              </Link>
              <Link to="" className=" hover:text-blue-700 transition-colors">
                <FaLinkedin size={24} />
              </Link>
              <Link to="" className=" hover:text-red-600 transition-colors">
                <FaYoutube size={24} />
              </Link>
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
            <p className="mb-2">
              <strong>Email:</strong> contact@swiftlymeds.com
            </p>
            <p className="mb-2">
              <strong>Phone:</strong> +1 (800) 123-4567
            </p>
            <p>
              <strong>Address:</strong> 123 Healthcare Ave, Suite 100<br />
              San Francisco, CA 94107
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8 border-t border-gray-200 pt-8">
          <div>
            <h4 className="font-semibold mb-3">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="" className="hover:text-blue-600 hover:underline">Browse Medications</Link></li>
              <li><Link to="" className="hover:text-blue-600 hover:underline">New Arrivals</Link></li>
              <li><Link to="" className="hover:text-blue-600 hover:underline">Best Sellers</Link></li>
              <li><Link to="" className="hover:text-blue-600 hover:underline">Swiftly Marketplace</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Services</h4>
            <ul className="space-y-2">
              <li><Link to="" className="hover:text-blue-600 hover:underline">Contact Doctor</Link></li>
              <li><Link to="" className="hover:text-blue-600 hover:underline">For Providers</Link></li>
              <li><Link to="" className="hover:text-blue-600 hover:underline">Prescription Refills</Link></li>
              <li><Link to="" className="hover:text-blue-600 hover:underline">Home Delivery</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link to="" className="hover:text-blue-600 hover:underline">Our Mission</Link></li>
              <li><Link to="/about" className="hover:text-blue-600 hover:underline">About Us</Link></li>
              <li><Link to="" className="hover:text-blue-600 hover:underline">Careers</Link></li>
              <li><Link to="" className="hover:text-blue-600 hover:underline">Press</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2">
              <li><Link to="" className="hover:text-blue-600 hover:underline">FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-blue-600 hover:underline">Contact Us</Link></li>
              <li><Link to="" className="hover:text-blue-600 hover:underline">Shipping Info</Link></li>
              <li><Link to="" className="hover:text-blue-600 hover:underline">Returns</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="hover:text-blue-600 hover:underline">Privacy Policy</Link></li>
              <li><Link to="" className="hover:text-blue-600 hover:underline">CA Privacy</Link></li>
              <li><Link to="" className="hover:text-blue-600 hover:underline">HIPAA Policy</Link></li>
              <li><Link to="" className="hover:text-blue-600 hover:underline">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-200 pt-6 text-sm text-center md:text-left">
          <p>© 2025 Swiftly Meds Private Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;