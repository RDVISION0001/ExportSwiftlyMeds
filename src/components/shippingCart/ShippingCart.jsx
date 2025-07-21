import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext/AuthContext';
import axiosInstance from '../../AuthContext/AxiosInstance';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import {
  FiShoppingBag,
  FiPackage,
  FiLayers,
  FiDollarSign,
  FiCreditCard,
  FiTruck,
  FiTag,
  FiFileText,
  FiGift,
  FiCheck,
  FiAlertCircle,
  FiShoppingCart
} from 'react-icons/fi';

function ShippingCart() {
  const { token, refresh, setRefresh } = useAuth();
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState({}); // Track which priceIds are being updated
  const [removing, setRemoving] = useState(false)
  const [currentId, setCurrentID] = useState("")
  const [platformFee, setPlatformFee] = useState(2.99); // Example platform fee
  const [logisticFee, setLogisticFee] = useState(5.99); // Example shipping fee
  const [otherFees, setOtherFees] = useState(0); // Other optional fees
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const calculateSubtotal = () => {
    return cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Apply coupon function
  const applyCoupon = () => {
    // Here you would typically validate the coupon with your backend
    if (couponCode === 'DISCOUNT10') {
      setCouponDiscount(10);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
      setCouponDiscount(0);
    }
  };

  const getAllCartItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/swift/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartData(response.data);
      console.log("data", response);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError("Failed to load cart items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity, priceId, name) => {
    console.log("name", name)
    try {
      setUpdatingItems(prev => ({ ...prev, [priceId]: true })); // Track by priceId
      await axiosInstance.post(`/swift/cart/update`,
        {
          productId: productId,
          quantity: newQuantity,
          priceId: priceId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      await getAllCartItems()
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setUpdatingItems(prev => ({ ...prev, [priceId]: false }));
    }
  };

  const removeItem = async (productId, priceId, quantity) => {
    console.log(productId, priceId, quantity);
    try {
      setCurrentID(priceId)
      setRemoving(true)
      const response = await axiosInstance.post(
        `/swift/cart/remove`,
        {
          productId: productId,
          quantity: quantity,
          priceId: priceId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRemoving(false)
      setCurrentID(null)
      setRefresh(refresh + 1)
      await getAllCartItems(); // Refresh cart data
    } catch (error) {
      console.error("Error removing item:", error);
      setRemoving(false)
      setCurrentID(null)
    }
  };


  useEffect(() => {
    if (token) {
      getAllCartItems();
    }
  }, [token]);

  const calculateTotal = () => {
    return cartData.reduce((sum, item) => sum + item.total, 0);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <span className="loading loading-spinner loading-xl"></span>
        <p className="text-lg">Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (cartData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-[75%] mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side - Scrollable cart items */}
        <div className="md:w-2/3 h-[calc(100vh-200px)] overflow-y-auto pr-2">
          <div className="space-y-4">
            {cartData.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="flex flex-col sm:flex-row border border-gray-200 rounded-lg p-4 gap-4 relative">
                {/* Delete button */}
                {console.log("remove", item)}
                <button
                  onClick={() => removeItem(item.productId, item.priceId, item.quantity)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  aria-label="Remove item"
                  disabled={updatingItems[item.priceId]}
                >
                  {removing && item.priceId == currentId ? <span className="loading loading-spinner loading-sm"></span> : <FiTrash2 size={18} />}
                </button>

                {/* Product image */}
                <div className="w-full sm:w-32 flex-shrink-0">
                  {item.image && item.image.length > 0 && (
                    <img
                      src={item.image[0]}
                      alt={item.name}
                      className="w-full h-32 object-contain rounded"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100';
                      }}
                    />
                  )}
                </div>

                {/* Product details */}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold pr-6">{item.name}</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <p className="text-gray-600">Price:</p>
                    <p>${item.price}</p>

                    <p className="text-gray-600">Quantity:</p>
                    <div className="flex justify-center items-center gap-1 border border-gray-300 rounded-md w-fit px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1), item.priceId, "plus")}
                        className={`p-1 rounded-md cursor-pointer ${item.quantity <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}
                        disabled={item.quantity <= 1 || updatingItems[item.priceId]}
                        aria-label="Decrease quantity"
                      >
                        {updatingItems[item.priceId] ? (
                          <span className="loading loading-dots loading-xs"></span>
                        ) : (
                          <FiMinus size={14} />
                        )}
                      </button>

                      <span className="w-6 text-center text-sm font-medium text-gray-800">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.priceId)}
                        className="p-1 cursor-pointer rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                        disabled={updatingItems[item.priceId]}
                        aria-label="Increase quantity"
                      >
                        {updatingItems[item.priceId] ? (
                          <span className="loading loading-dots loading-xs"></span>
                        ) : (
                          <FiPlus size={14} />
                        )}
                      </button>
                    </div>

                    <p className="text-gray-600">Total:</p>
                    <p className="font-medium">${item.total}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Fixed order summary */}
        <div className="md:w-1/3">
          <div className="border border-gray-200 rounded-lg p-6 sticky top-4">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FiShoppingBag className="text-green-600" />
              Order Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center gap-1">
                  <FiPackage size={16} className='text-yellow-700 mr-4' />
                  Total Quantity:
                </span>
                <span>{cartData.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center gap-1">
                  <FiLayers size={16} className='text-blue-700 mr-4' />
                  Total Items:
                </span>
                <span>{cartData.length}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center gap-1">
                  <FiDollarSign size={16} className='text-orange-700 mr-4' />
                  Subtotal:
                </span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>

              {/* Platform Fee */}
              {platformFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <FiCreditCard size={16} className='text-teal-800 mr-4' />
                    Platform Fee:
                  </span>
                  <span>${platformFee.toFixed(2)}</span>
                </div>
              )}

              {/* Logistic Fee */}
              {logisticFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <FiTruck size={16} className='text-yellow-700 mr-4' />
                    Shipping Fee:
                  </span>
                  <span>${logisticFee.toFixed(2)}</span>
                </div>
              )}

              {/* Coupon Discount */}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    <FiTag size={16} className='text-[#B12C00] mr-4' />
                    Coupon Discount:
                  </span>
                  <span>-${couponDiscount.toFixed(2)}</span>
                </div>
              )}

              {/* Other Fees */}
              {otherFees > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <FiFileText size={16} />
                    Other Fees:
                  </span>
                  <span>${otherFees.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Coupon Code Input */}
            <div className="mt-4 mb-2">
              <label htmlFor="coupon" className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FiGift size={16} className='text-[#B12C00] mr-4' />
                Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="coupon"
                  className="flex-1 border rounded-md px-3 py-2 text-sm"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md text-sm flex items-center cursor-pointer gap-1"
                  onClick={applyCoupon}
                >
                  <FiCheck /> Apply
                </button>
              </div>
              {couponError && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FiAlertCircle size={14} /> {couponError}
                </p>
              )}
            </div>

            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span className="flex items-center gap-1">
                <FiShoppingCart size={18} />
                Grand Total:
              </span>
              <span>${(calculateSubtotal() + platformFee + logisticFee + otherFees - couponDiscount).toFixed(2)}</span>
            </div>

            <button
              className="w-full mt-6 cursor-pointer bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              disabled={Object.values(updatingItems).some(Boolean)}
            >
              <FiCreditCard size={18} />
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShippingCart;