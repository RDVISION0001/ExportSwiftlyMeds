import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../AuthContext/AuthContext';
import { TiDeleteOutline } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';
import { IoArrowBackOutline } from "react-icons/io5";
import { BsCartX } from "react-icons/bs";

function ShippingCart() {
  const { product, setProduct, setAmount, setCart } = useAuth();
  console.log('productShippingCartData: ', product);
  const navigate = useNavigate();
  const topRef = useRef(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedBonus, setSelectedBonus] = useState('Vlagra 100 mg × 2 pills');
  const [selectedShipping, setSelectedShipping] = useState('AirMail');
  const [totalAmount, setTotalAmount] = useState(0);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(1, prev - 1));

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    // Calculate initial total amount
    if (product) {
      const initialTotal = Array.isArray(product)
        ? product.reduce((sum, item) => sum + (item.perPack * 0.9), 0)
        : product.perPack * 0.9;
      setTotalAmount(initialTotal);
    }
  }, [product]);

  const calculateTotal = () => {
    if (!product) return 0;
    if (Array.isArray(product)) {
      return product.reduce((sum, item) => sum + (item.perPack * 0.9 * quantity), 0).toFixed(2);
    }
    return (product.perPack * 0.9 * quantity).toFixed(2);
  };

  const shippingOptions = [
    {
      id: 'airmail',
      name: 'AirMail (World Wide)',
      price: 9.95,
      description: 'The delivery may take up to 2-3 business weeks for AirMail. Unfortunately Online Tracking is not available for Airmail.',
      freeThreshold: 200
    },
    {
      id: 'ems',
      name: 'EMS (World Wide)',
      price: 29.95,
      description: 'Is the fastest available shipping method. You will receive your shipping track id as soon as the package is shipped. The waiting period for EMS lasts 3-8 business days.',
      freeThreshold: 300
    }
  ];

  const bonusOptions = [
    'No bonus',
    'Vlagra 100 mg × 2 pills',
    'Clails 20 mg × 2 pills',
    'Levitra 20 mg × 2 pills'
  ];

  const handleRemove = (productId) => {
    if (Array.isArray(product)) {
      // Find the product to get its price
      const removedProduct = product.find(item => item.id === productId);
      if (removedProduct) {
        // Update total amount
        setTotalAmount(prev => prev - (removedProduct.perPack * 0.9));
        // Update cart count
        setCart(prev => prev - 1);
        // Remove the product
        setProduct(prevItems => prevItems.filter(item => item.id !== productId));
        // Update the amount in context if needed
        setAmount(prev => prev - (removedProduct.perPack * 0.9));
      }
    } else {
      // Handle single product case
      setTotalAmount(0);
      setCart(0);
      setProduct(null);
      setAmount(0);
    }
  };


  // Check if product is empty or null
  const isEmpty = !product || (Array.isArray(product) && product.length === 0);

  if (isEmpty) {
    return (
      <div className='w-full flex justify-center items-center py-20'>
        <div className='text-center space-y-4'>
          <BsCartX className='text-5xl mx-auto text-gray-400' />
          <p className='text-lg font-medium'>Your shopping cart is empty!</p>
          <button
            onClick={() => navigate('/CatProduct')}
            className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors cursor-pointer font-medium'
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Convert single product to array for consistent rendering
  const productsToRender = Array.isArray(product) ? product : [product];

  return (
    <div ref={topRef} className="max-w-6xl mx-auto px-4 py-8">
      <div className='flex justify-between items-center mb-6'>
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        <button
          onClick={() => navigate('/view')}
          className='bg-[#BBFBFF] rounded-lg px-3 py-1 flex items-center gap-2 hover:bg-[#A0E0E0] transition-colors cursor-pointer'
        >
          <IoArrowBackOutline /> Back
        </button>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
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
            {productsToRender.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 border-t border-gray-200 font-medium text-blue-300">Viagra</td>
                <td className="p-4 border-t border-gray-200 text-gray-600">
                  {item?.dosage}*{item?.pills}
                </td>
                <td className="p-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <button
                      onClick={handleDecrement}
                      className="px-3 py-1 border border-gray-300 rounded-l-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-t border-b border-gray-300 bg-white text-center w-12">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      className="px-3 py-1 border border-gray-300 rounded-r-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="p-4 border-t border-gray-200 font-medium">{item?.perPack}</td>
                <td onClick={() => handleRemove(item.id)} className='p-4 border-t border-gray-200'>
                  <TiDeleteOutline
                    className='text-red-500 text-2xl hover:text-red-600 cursor-pointer'
                    aria-label="Remove item"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Free Bonus Section */}
      <div className="py-10">
        <h2 className="text-xl font-semibold mb-4">Select Free Bonus</h2>
        <div className="space-x-4 flex flex-wrap items-center bg-[#ADEED9] p-3 rounded-md gap-2">
          {bonusOptions.map((option) => (
            <div key={option} className="flex items-center">
              <input
                type="radio"
                id={`bonus-${option}`}
                name="bonus"
                checked={selectedBonus === option}
                onChange={() => setSelectedBonus(option)}
                className="mr-2"
              />
              <label htmlFor={`bonus-${option}`} className='text-sm font-medium'>
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Options */}
      <h2 className="text-xl font-semibold mb-4">Select Shipping</h2>
      <div className="space-y-4 bg-[#F5F8ED] rounded-lg p-6 shadow-sm">
        {shippingOptions.map((option) => (
          <div
            key={option.id}
            className={`flex items-start p-3 hover:bg-[#ECFAE5] rounded-md transition-colors cursor-pointer ${selectedShipping === option.id ? 'bg-[#ECFAE5]' : ''}`}
            onClick={() => setSelectedShipping(option.id)}
          >
            <input
              type="radio"
              id={option.id}
              name="shipping"
              checked={selectedShipping === option.id}
              onChange={() => setSelectedShipping(option.id)}
              className="mt-1 mr-3 h-4 w-4 text-[#A0C878] focus:ring-[#A0C878]"
            />
            <label htmlFor={option.id} className="flex-1 cursor-pointer">
              <div className="flex justify-between items-start">
                <span className="font-medium text-gray-800">{option.name}</span>
                <span className="font-bold text-gray-900 ml-4">${option.price}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {option.description}
                <span className="block text-[#A0C878] font-medium mt-1">
                  We provide Free {option.id.toUpperCase()} shipping for orders over ${option.freeThreshold}.
                </span>
              </p>
            </label>
          </div>
        ))}
      </div>

      {/* Price Summary */}
      <div className="pt-6">
        <div className="flex justify-between mb-2">
          <span>{product?.perPack}</span>
          <span>with discount 10%</span>
          <span>{(product?.perPack * 0.9).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-4">
          <span>Your order sum is:</span>
          <span>${calculateTotal()}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate('/ed')}
          className="px-6 py-2 border rounded hover:bg-gray-100 cursor-pointer transition-colors text-xs md:text-lg"
        >
          CONTINUE SHOPPING
        </button>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer transition-colors text-xs md:text-lg"
          onClick={() => navigate('/checkout')}
        >
          CHECKOUT
        </button>
      </div>
    </div>
  );
}

export default ShippingCart;