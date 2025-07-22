import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext/AuthContext';
import axiosInstance from '../../AuthContext/AxiosInstance';
import { FiTrash2, FiPlus, FiMinus, FiX, FiMapPin } from 'react-icons/fi';
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
import AddNewAddress from './AddNewAddress';

function ShippingCart() {
  const { token, refresh, setRefresh } = useAuth();
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState({});
  const [removing, setRemoving] = useState(false);
  const [currentId, setCurrentID] = useState("");
  const [platformFee, setPlatformFee] = useState(2.99);
  const [logisticFee, setLogisticFee] = useState(5.99);
  const [otherFees, setOtherFees] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [openAddressModal, setAddresModal] = useState(false)

  const calculateSubtotal = () => {
    return cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const applyCoupon = () => {
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
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError("Failed to load cart items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity, priceId, action) => {
    try {
      // Optimistically update the UI first
      setCartData(prevCart =>
        prevCart.map(item =>
          item.priceId === priceId
            ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
            : item
        )
      );

      setUpdatingItems(prev => ({ ...prev, [`${priceId}-${action}`]: true }));

      const response = await axiosInstance.post(`/swift/cart/update`,
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

      // Refresh cart data to ensure sync with server
      await getAllCartItems();
    } catch (error) {
      console.error("Error updating quantity:", error);
      // Revert optimistic update if there's an error
      setCartData(prevCart =>
        prevCart.map(item =>
          item.priceId === priceId
            ? { ...item, quantity: item.quantity, total: item.price * item.quantity }
            : item
        )
      );
    } finally {
      setUpdatingItems(prev => ({ ...prev, [`${priceId}-${action}`]: false }));
    }
  };

  const removeItem = async (productId, priceId, quantity) => {
    try {
      setCurrentID(priceId);
      setRemoving(true);
      await axiosInstance.post(
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
      setRemoving(false);
      setCurrentID(null);
      setRefresh(refresh + 1);
      await getAllCartItems();
    } catch (error) {
      console.error("Error removing item:", error);
      setRemoving(false);
      setCurrentID(null);
    }
  };

  useEffect(() => {
    if (token) {
      getAllCartItems();
    }
  }, [token]);

  const handleAddress = () => {
    setAddresModal(true)
  }
  const closeModalAddress = () => {
    setAddresModal(false)
  }

  if (loading && cartData.length === 0) {
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
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <FiShoppingCart size={48} className="text-gray-400" />
        <p className="text-lg text-gray-600">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 px-2">Your Cart</h2>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
        {/* Left side - Scrollable cart items */}
        <div className="lg:w-2/3">
          <div className="space-y-3 sm:space-y-4">
            {cartData.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="flex flex-col sm:flex-row border border-gray-200 rounded-lg p-3 sm:p-4 gap-3 sm:gap-4 relative">
                {/* Delete button */}
                <button
                  onClick={() => removeItem(item.productId, item.priceId, item.quantity)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  aria-label="Remove item"
                  disabled={removing && item.priceId === currentId}
                >
                  {removing && item.priceId === currentId ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <FiTrash2 size={16} className="sm:w-4 sm:h-4" />
                  )}
                </button>

                {/* Product image */}
                <div className="w-full sm:w-24 md:w-32 flex-shrink-0 self-center">
                  {item.image && item.image.length > 0 && (
                    <img
                      src={item.image[0]}
                      alt={item.name}
                      className="w-full h-20 sm:h-24 md:h-32 object-contain rounded"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100';
                      }}
                    />
                  )}
                </div>

                {/* Product details */}
                <div className="flex-grow">
                  <h3 className="text-base sm:text-lg font-semibold pr-6 line-clamp-2">{item.name}</h3>
                  Your cart is empty
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Fixed order summary */}
        <div className="lg:w-1/3">
          <div className="border border-gray-200 rounded-lg p-4 sm:p-6 sticky top-4">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
              <FiShoppingBag className="text-green-600 w-5 h-5" />
              Order Summary
            </h3>
            <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center gap-1">
                  <FiPackage className="text-yellow-700 w-4 h-4 sm:w-4 sm:h-4 mr-2 sm:mr-4" />
                  Total Quantity:
                </span>
                <span>{cartData.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center gap-1">
                  <FiLayers className="text-blue-700 w-4 h-4 sm:w-4 sm:h-4 mr-2 sm:mr-4" />
                  Total Items:
                </span>
                <span>{cartData.length}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center gap-1">
                  <FiDollarSign className="text-orange-700 w-4 h-4 sm:w-4 sm:h-4 mr-2 sm:mr-4" />
                  Subtotal:
                </span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>

              {platformFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <FiCreditCard className="text-teal-800 w-4 h-4 sm:w-4 sm:h-4 mr-2 sm:mr-4" />
                    Platform Fee:
                  </span>
                  <span>${platformFee.toFixed(2)}</span>
                </div>
              )}

              {logisticFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <FiTruck className="text-yellow-700 w-4 h-4 sm:w-4 sm:h-4 mr-2 sm:mr-4" />
                    Shipping Fee:
                  </span>
                  <span>${logisticFee.toFixed(2)}</span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    <FiTag className="text-[#B12C00] w-4 h-4 sm:w-4 sm:h-4 mr-2 sm:mr-4" />
                    Coupon Discount:
                  </span>
                  <span>-${couponDiscount.toFixed(2)}</span>
                </div>
              )}

              {otherFees > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <FiFileText className="w-4 h-4 sm:w-4 sm:h-4 mr-2 sm:mr-4" />
                    Other Fees:
                  </span>
                  <span>${otherFees.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Coupon Code Input */}
            <div className="mt-3 sm:mt-4 mb-2">
              <label htmlFor="coupon" className="text-xs sm:text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FiGift className="text-[#B12C00] w-4 h-4 sm:w-4 sm:h-4 mr-2 sm:mr-4" />
                Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="coupon"
                  className="flex-1 border rounded-md px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button
                  className="bg-gray-200 hover:bg-gray-300 px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm flex items-center cursor-pointer gap-1"
                  onClick={applyCoupon}
                >
                  <FiCheck className="w-3 h-3 sm:w-4 sm:h-4" /> Apply
                </button>
              </div>
              {couponError && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FiAlertCircle className="w-3 h-3 sm:w-4 sm:h-4" /> {couponError}
                </p>
              )}
            </div>

            <div className="flex justify-between font-bold text-base sm:text-lg pt-2 border-t mt-2 sm:mt-3">
              <span className="flex items-center gap-1">
                <FiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                Grand Total:
              </span>
              <span>${(calculateSubtotal() + platformFee + logisticFee + otherFees - couponDiscount).toFixed(2)}</span>
            </div>

            <button
              onClick={handleAddress}
              className="w-full mt-4 sm:mt-6 cursor-pointer bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              disabled={Object.values(updatingItems).some(Boolean) || removing}
            >
              <FiCreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>


      {openAddressModal && (
        <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FiMapPin className="text-blue-500" />
                Shipping Address
              </h2>
              <button
                onClick={closeModalAddress}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                aria-label="Close address modal"
              >
                <FiX size={24} />
              </button>
            </div>
            <AddNewAddress onClose={closeModalAddress} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ShippingCart;
