import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../AuthContext/AuthContext';
import axiosInstance from '../../AuthContext/AxiosInstance';
import { FiTrash2, FiPlus, FiMinus, FiMapPin, FiX } from 'react-icons/fi';
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
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import RecomndedProduct from './RecomndedProduct';

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
  const [aaNewAddressModal, setAddnewAddressModal] = useState(false)
  const navigate = useNavigate()
   const topRef = useRef(null);

  const calculateSubtotal = () => {
    return cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const applyCoupon = () => {
    if (couponCode === 'R10') {
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
      console.log("cart data", response.data)
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError("Failed to load cart items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity, priceId, action) => {
    try {
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
      await getAllCartItems();
    } catch (error) {
      console.error("Error updating quantity:", error);
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
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will remove the item from your cart',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel'
    });
    if (result.isConfirmed) {
      try {
        setCurrentID(priceId);
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
        Swal.close();
        await Swal.fire(
          'Removed!',
          'Item has been removed from your cart.',
          'success'
        );

        setRemoving(false);
        setCurrentID(null);
        setRefresh(refresh + 1);
        await getAllCartItems();
      } catch (error) {
        console.error("Error removing item:", error);
        Swal.fire(
          'Error!',
          'Failed to remove item. Please try again.',
          'error'
        );
        setRemoving(false);
        setCurrentID(null);
      }
    }
  };
  useEffect(() => {
    if (token) {
      getAllCartItems();
    }
  }, [token]);
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [])

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
        <button onClick={() => navigate('/CatProduct')} className='bg-teal-800 text-white px-4 py-1 rounded-md cursor-pointer'>Continue Shopping</button >
      </div>
    );
  }
  const openaddresModal = () => {
    setAddnewAddressModal(true)
  }
  const closeAddressModal = () => {
    setAddnewAddressModal(false)
  }
  return (
    <div ref={topRef}  className="w-full mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
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
                  className="absolute top-[68px] right-8 text-gray-400 hover:text-red-500 hover:bg-red-100 transition-colors cursor-pointer border rounded-full p-2"
                  aria-label="Remove item"
                  disabled={removing && item.priceId === currentId}
                >
                  {removing && item.priceId === currentId ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <FiTrash2 size={18} className="sm:w-4 sm:h-4" />
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
                  <div className="grid grid-cols-2 gap-2 mt-1 sm:mt-2 text-sm sm:text-base">
                    <p className="text-gray-600">Price:</p>
                    <p>${item.price.toFixed(2)}</p>

                    <p className="text-gray-600">Quantity:</p>
                    <div className="flex justify-start sm:justify-center items-center gap-1 border border-gray-300 rounded-md w-fit px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1), item.priceId, "minus")}
                        className={`p-1 rounded-md cursor-pointer h-6 w-6 flex items-center justify-center ${item.quantity <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                          } transition-colors`}
                        disabled={item.quantity <= 1 || updatingItems[`${item.priceId}-minus`]}
                        aria-label="Decrease quantity"
                      >
                        {updatingItems[`${item.priceId}-minus`] ? (
                          <span className="loading loading-dots loading-xs h-full flex items-center"></span>
                        ) : (
                          <FiMinus size={12} className="sm:w-3 sm:h-3" />
                        )}
                      </button>

                      <span className="w-6 text-center text-sm font-medium text-gray-800">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.priceId, "plus")}
                        className="p-1 cursor-pointer rounded-md text-gray-700 hover:bg-gray-100 transition-colors h-6 w-6 flex items-center justify-center"
                        disabled={updatingItems[`${item.priceId}-plus`]}
                        aria-label="Increase quantity"
                      >
                        {updatingItems[`${item.priceId}-plus`] ? (
                          <span className="loading loading-dots loading-xs h-full flex items-center"></span>
                        ) : (
                          <FiPlus size={12} className="sm:w-3 sm:h-3" />
                        )}
                      </button>
                    </div>

                    <p className="text-gray-600">Total:</p>
                    <p className="font-medium">${item.total.toFixed(2)}</p>
                  </div>
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
              onClick={openaddresModal}
              className="w-full mt-4 sm:mt-6 cursor-pointer bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              disabled={Object.values(updatingItems).some(Boolean) || removing}
            >
              <FiCreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {aaNewAddressModal && (
        <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FiMapPin className="text-blue-500" />
                Shipping Address
              </h2>
              <button
                onClick={closeAddressModal}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                aria-label="Close address modal"
              >
                <FiX size={24} />
              </button>
            </div>
            <AddNewAddress onClose={closeAddressModal} />
          </div>
        </div>
      )}
      {/* <RecomndedProduct categoeryId={"category"} /> */}
    </div>
  );
}

export default ShippingCart;
