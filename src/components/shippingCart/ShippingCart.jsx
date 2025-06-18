import React, { useState } from 'react';
import { useAuth } from '../../AuthContext/AuthContext';
import { TiDeleteOutline } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';

function ShippingCart() {
  const { product } = useAuth();
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1);
  const [selectedBonus, setSelectedBonus] = useState('Vlagra 100 mg × 2 pills');
  const [selectedShipping, setSelectedShipping] = useState('AirMail');

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

        {/* Products Table */}
        <table className="w-full border-collapse overflow-hidden rounded-2xl shadow-sm">
          <thead className="">
            <tr className='bg-gray-100'>
              <th className="text-left p-4 font-medium text-gray-700">Product Name</th>
              <th className="text-left p-4 font-medium text-gray-700">Package</th>
              <th className="text-left p-4 font-medium text-gray-700">Qty</th>
              <th className="text-left p-4 font-medium text-gray-700">Per Pack</th>
              <th className="text-left p-4"></th>
            </tr>
          </thead>
          <tbody className="">
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="p-4 border-t border-gray-200 font-medium text-blue-300">Viagra</td>
              <td className="p-4 border-t border-gray-200 text-gray-600">100mg × {product.pills}</td>
              <td className="p-4 border-t border-gray-200">
                <div className="flex items-center">
                  <button
                    onClick={handleDecrement}
                    className="px-3 py-1 border border-gray-300 rounded-l-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-t border-b border-gray-300 bg-white text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="px-3 py-1 border border-gray-300 rounded-r-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="p-4 border-t border-gray-200 font-medium">{product.perPack}</td>
              <td className='p-4 border-t border-gray-200'>
                <TiDeleteOutline className='text-red-500 text-2xl hover:text-red-600 cursor-pointer' />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Free Bonus Section */}
        <div className="py-10">
          <h2 className="text-xl font-semibold mb-4">Select Free Bonus</h2>
          <div className="space-x-4 flex items-center bg-[#ADEED9] p-2 rounded-md">
            {['No bonus', 'Vlagra 100 mg × 2 pills', 'Clails 20 mg × 2 pills', 'Levitra 20 mg × 2 pills'].map((option) => (
              <div key={option} className="flex items-center">
                <input
                  type="radio"
                  id={option}
                  name="bonus"
                  checked={selectedBonus === option}
                  onChange={() => setSelectedBonus(option)}
                  className="mr-2"
                />
                <label htmlFor={option} className='text-sm font-medium'>{option}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Options */}
        <h2 className="text-xl font-semibold mb-4">Select Shipping</h2>
        <div className="space-y-4 bg-[#F5F8ED] rounded-lg p-6 shadow-sm">
          {/* Airmail Option */}
          <div className="flex items-start p-3 hover:bg-[#ECFAE5] rounded-md transition-colors cursor-pointer">
            <input
              type="radio"
              id="airmail"
              name="shipping"
              checked={selectedShipping === 'AirMail'}
              onChange={() => setSelectedShipping('AirMail')}
              className="mt-1 mr-3 h-4 w-4 text-[#A0C878] focus:ring-[#A0C878]"
            />
            <label htmlFor="airmail" className="flex-1">
              <div className="flex justify-between items-start">
                <span className="font-medium text-gray-800">AirMail (World Wide)</span>
                <span className="font-bold text-gray-900 ml-4">$9.95</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                The delivery may take up to 2-3 business weeks for AirMail. Unfortunately Online Tracking is not available for Airmail.
                <span className="block text-[#A0C878] font-medium mt-1">
                  We provide Free AirMail shipping for orders over $200.
                </span>
              </p>
            </label>
          </div>

          {/* EMS Option */}
          <div className="flex items-start p-3 hover:bg-[#ECFAE5] rounded-md transition-colors cursor-pointer">
            <input
              type="radio"
              id="ems"
              name="shipping"
              checked={selectedShipping === 'EMS'}
              onChange={() => setSelectedShipping('EMS')}
              className="mt-1 mr-3 h-4 w-4 text-[#A0C878] focus:ring-[#A0C878]"
            />
            <label htmlFor="ems" className="flex-1 cursor-pointer">
              <div className="flex justify-between items-start">
                <span className="font-medium text-gray-800">EMS (World Wide)</span>
                <span className="font-bold text-gray-900 ml-4">$29.95</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Is the fastest available shipping method. You will receive your shipping track id as soon as the package is shipped. The waiting period for EMS lasts 3-8 business days.
                <span className="block text-[#A0C878] font-medium mt-1">
                  We provide Free EMS shipping for orders over $300.
                </span>
              </p>
            </label>
          </div>
        </div>

        {/* Price Summary */}
        <div className=" pt-6">
          <div className="flex justify-between mb-2">
            <span>{product.perPack}</span>
            <span>with discount 10%</span>
            <span>{(product.perPack * 0.9).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Your order sum is:</span>
            <span>${(product.perPack * 0.9 * quantity).toFixed(2)}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-8">
          <button onClick={() => navigate('/ed')} className="px-6 py-2 border rounded hover:bg-gray-100 cursor-pointer">
            CONTINUE SHOPPING
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
            CHECKOUT
          </button>
        </div>
      </div>
  );
}

export default ShippingCart;