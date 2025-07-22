import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext/AuthContext';
import axiosInstance from '../../AuthContext/AxiosInstance';
import { 
  FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiPackage, 
  FiLayers, FiDollarSign, FiCreditCard, FiTruck, 
  FiTag, FiFileText, FiGift, FiCheck, FiAlertCircle, 
  FiShoppingCart, FiX, FiEdit2, FiPhone, FiMapPin 
} from 'react-icons/fi';
import Swal from 'sweetalert2';

function ShippingCart() {
  const { token, refresh, setRefresh, user } = useAuth();
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState({});
  const [removing, setRemoving] = useState(false);
  const [currentId, setCurrentID] = useState('');
  const [platformFee, setPlatformFee] = useState(2.99);
  const [logisticFee, setLogisticFee] = useState(5.99);
  const [otherFees, setOtherFees] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [selectedOption, setSelectedOption] = useState('existing');
  const [openModal, setOpenModal] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);

  console.log('fgf',user);
  // Address form state
  const [formData, setFormData] = useState({
    addressType: '',
    fullName: '',
    addressLine: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'United States',
    phone: '',
    isDefault: false,
  });

  // Format address data for API request
  const formatAddressPayload = (data) => ({
    addressLine: data.addressLine,
    addressLine2: data.addressLine2 || null,
    city: data.city,
    state: data.state,
    pincode: data.pincode,
    country: data.country,
    addressType: data.addressType,
    phone: data.phone || null,
    isDefault: data.isDefault,
    user: {
      swiftUserName: user?.username || '',
    },
  });

  // Calculate cart totals
  const calculateSubtotal = () => {
    return cartData.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + platformFee + logisticFee + otherFees - couponDiscount;
  };

  // Fetch cart items
  const getAllCartItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/swift/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartData(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setError('Failed to load cart items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch saved addresses
  const fetchSavedAddresses = async () => {
    try {
      const response = await axiosInstance.get('/swift/cart/address/list', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedAddresses(response.data);
      console.log('dfgdfgfdg3',response)
      // Set default address in formData if available
      const defaultAddress = response.data.find((addr) => addr.isDefault);
      if (defaultAddress && selectedOption === 'existing') {
        setFormData({
          ...defaultAddress,
          addressLine: defaultAddress.addressLine,
          pincode: defaultAddress.pincode,
          phone: defaultAddress.phone || '',
          isDefault: false,
        });
      }
    } catch (error) {
      console.error('Error fetching saved addresses:', error);
      Swal.fire('Error', 'Failed to load saved addresses. Please try again.', 'error');
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, newQuantity, priceId) => {
    try {
      setUpdatingItems((prev) => ({ ...prev, [priceId]: true }));
      await axiosInstance.post(
        '/swift/cart/update',
        { productId, quantity: newQuantity, priceId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      await getAllCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
      Swal.fire('Error', 'Failed to update quantity. Please try again.', 'error');
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [priceId]: false }));
    }
  };

  // Remove item from cart
  const removeItem = async (productId, priceId, quantity) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        setCurrentID(priceId);
        setRemoving(true);
        await axiosInstance.post(
          '/swift/cart/remove',
          { productId, quantity, priceId },
          { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
        );
        setRefresh(refresh + 1);
        await getAllCartItems();
        Swal.fire('Success', 'Item removed from cart.', 'success');
      } catch (error) {
        console.error('Error removing item:', error);
        Swal.fire('Error', 'Failed to remove item. Please try again.', 'error');
      } finally {
        setRemoving(false);
        setCurrentID('');
      }
    }
  };

  // Set default address
  const handleSetDefaultAddress = async (addressId) => {
    try {
      await axiosInstance.put(
        `/swift/cart/address/set-default/${addressId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      await fetchSavedAddresses();
      Swal.fire('Success', 'Default address updated successfully.', 'success');
    } catch (error) {
      console.error('Error setting default address:', error);
      Swal.fire('Error', 'Failed to set default address. Please try again.', 'error');
    }
  };

  // Address management
  const handleOptionChange = (option) => {
    setSelectedOption(option);
    if (option === 'existing') {
      const defaultAddress = savedAddresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setFormData({
          ...defaultAddress,
          addressLine: defaultAddress.addressLine,
          pincode: defaultAddress.pincode,
          phone: defaultAddress.phone || '',
          isDefault: false,
        });
      } else {
        resetForm();
      }
    } else {
      resetForm();
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const resetForm = () => {
    setFormData({
      addressType: '',
      fullName: '',
      addressLine: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'United States',
      phone: '',
      isDefault: false,
    });
    setEditAddressId(null);
  };

  const handleAddressSelect = (address) => {
    setFormData({
      ...address,
      addressLine: address.addressLine,
      pincode: address.pincode,
      phone: address.phone || '',
      isDefault: false,
    });
    setSelectedOption('existing');
    setEditAddressId(null);
    setOpenModal(false);
  };

  const handleEditAddress = (address) => {
    setFormData({
      ...address,
      addressLine: address.addressLine,
      pincode: address.pincode,
      phone: address.phone || '',
      isDefault: address.isDefault,
    });
    setSelectedOption('new');
    setEditAddressId(address.id);
  };

  const handleDeleteAddress = async (id) => {
    if (savedAddresses.find((addr) => addr.id === id)?.isDefault) {
      Swal.fire('Error', 'Cannot delete default address. Set another address as default first.', 'error');
      return;
    }

    const result = await Swal.fire({
      title: 'Delete Address?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/swift/cart/address/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await fetchSavedAddresses();
        if (editAddressId === id) {
          resetForm();
        }
        Swal.fire('Success', 'Address deleted successfully.', 'success');
      } catch (error) {
        console.error('Error deleting address:', error);
        Swal.fire('Error', 'Failed to delete address. Please try again.', 'error');
      }
    }
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
  
    try {
      const payload = formatAddressPayload(formData);
      let response;
  
      if (editAddressId) {
        // Update existing address
        response = await axiosInstance.put(
          `/swift/cart/address/update/${editAddressId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        Swal.fire({
          title: 'succss',
          text: response.data.message || 'Addess updated Successfully',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        fetchSavedAddresses();
      } else {
        // Add new address
        response = await axiosInstance.post(
          '/swift/cart/address/add',
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        Swal.fire({
          title: 'succss',
          text: response.data.message || 'Addess Successfully Added',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        fetchSavedAddresses();
        console.log('AddressData',response)
      }
    } catch (error) {
      console.error('Error saving address:', error);
  
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };
  

  // Coupon functions
  const applyCoupon = async () => {
    try {
      if (couponCode === 'DISCOUNT10') {
        setCouponDiscount(10);
        setCouponError('');
        Swal.fire('Success', 'Coupon applied successfully!', 'success');
      } else {
        setCouponError('Invalid coupon code');
        setCouponDiscount(0);
        Swal.fire('Error', 'Invalid coupon code.', 'error');
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      setCouponError('Failed to apply coupon. Please try again.');
      Swal.fire('Error', 'Failed to apply coupon. Please try again.', 'error');
    }
  };

  // Fetch cart and addresses on mount
  useEffect(() => {
    if (token) {
      getAllCartItems();
      fetchSavedAddresses();
    }
  }, [token]);

  // Update formData when modal opens to select default address
  useEffect(() => {
    if (openModal && selectedOption === 'existing') {
      const defaultAddress = savedAddresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setFormData({
          ...defaultAddress,
          addressLine: defaultAddress.addressLine,
          pincode: defaultAddress.pincode,
          phone: defaultAddress.phone || '',
          isDefault: false,
        });
      }
    }
  }, [openModal, savedAddresses]);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <span className="loading loading-spinner loading-xl"></span>
        <p className="text-lg">Loading your cart...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  // Empty cart state
  if (cartData.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <FiShoppingCart size={48} className="text-gray-400" />
        <p className="text-lg">Your cart is empty</p>
        <button
          className="btn btn-primary"
          onClick={() => (window.location.href = '/products')}
          aria-label="Continue shopping"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="w-full md:w-[75%] mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FiShoppingCart size={24} />
        Your Cart
      </h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side - Cart items */}
        <div className="md:w-2/3 h-[calc(100vh-200px)] overflow-y-auto pr-2">
          <div className="space-y-4">
            {cartData.map((item) => (
              <div
                key={`${item.productId}-${item.priceId}`}
                className="flex flex-col sm:flex-row border border-gray-200 rounded-lg p-4 gap-4 relative"
              >
                <button
                  onClick={() => removeItem(item.productId, item.priceId, item.quantity)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                  disabled={updatingItems[item.priceId]}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  {removing && item.priceId === currentId ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <FiTrash2 size={18} />
                  )}
                </button>

                <div className="w-full sm:w-32 flex-shrink-0">
                  {item.image?.[0] && (
                    <img
                      src={item.image[0]}
                      alt={item.name}
                      className="w-full h-32 object-contain rounded"
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/100')}
                    />
                  )}
                </div>

                <div className="flex-grow">
                  <h3 className="text-lg font-semibold pr-6">{item.name}</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <p className="text-gray-600">Price:</p>
                    <p>${item.price.toFixed(2)}</p>

                    <p className="text-gray-600">Quantity:</p>
                    <div className="flex justify-center items-center gap-1 border border-gray-300 rounded-md w-fit px-2 py-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, Math.max(1, item.quantity - 1), item.priceId)
                        }
                        className={`p-1 rounded-md ${
                          item.quantity <= 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        disabled={item.quantity <= 1 || updatingItems[item.priceId]}
                        aria-label={`Decrease quantity of ${item.name}`}
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
                        className="p-1 text-gray-700 hover:bg-gray-100 rounded-md"
                        disabled={updatingItems[item.priceId]}
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        {updatingItems[item.priceId] ? (
                          <span className="loading loading-dots loading-xs"></span>
                        ) : (
                          <FiPlus size={14} />
                        )}
                      </button>
                    </div>

                    <p className="text-gray-600">Total:</p>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Order summary */}
        <div className="md:w-1/3">
          <div className="border border-gray-200 rounded-lg p-6 sticky top-4">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FiShoppingBag className="text-green-600" />
              Order Summary
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center gap-1">
                  <FiPackage size={16} className="text-yellow-700 mr-4" />
                  Total Quantity:
                </span>
                <span>{cartData.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center gap-1">
                  <FiLayers size={16} className="text-blue-700 mr-4" />
                  Total Items:
                </span>
                <span>{cartData.length}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center gap-1">
                  <FiDollarSign size={16} className="text-orange-700 mr-4" />
                  Subtotal:
                </span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>

              {platformFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <FiCreditCard size={16} className="text-teal-800 mr-4" />
                    Platform Fee:
                  </span>
                  <span>${platformFee.toFixed(2)}</span>
                </div>
              )}

              {logisticFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <FiTruck size={16} className="text-yellow-700 mr-4" />
                    Shipping Fee:
                  </span>
                  <span>${logisticFee.toFixed(2)}</span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    <FiTag size={16} className="text-[#B12C00] mr-4" />
                    Coupon Discount:
                  </span>
                  <span>-${couponDiscount.toFixed(2)}</span>
                </div>
              )}

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

            {/* Coupon Code */}
            <div className="mt-4 mb-2">
              <label
                htmlFor="coupon"
                className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
              >
                <FiGift size={16} className="text-[#B12C00] mr-4" />
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
                  aria-label="Coupon code"
                />
                <button
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md text-sm flex items-center gap-1"
                  onClick={applyCoupon}
                  aria-label="Apply coupon code"
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

            {/* Grand Total */}
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span className="flex items-center gap-1">
                <FiShoppingCart size={18} />
                Grand Total:
              </span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => setOpenModal(true)}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              disabled={Object.values(updatingItems).some(Boolean)}
              aria-label="Proceed to checkout"
            >
              <FiCreditCard size={18} />
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {openModal && (
        <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FiMapPin className="text-blue-500" />
                Shipping Address
              </h2>
              <button
                onClick={() => {
                  setOpenModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                aria-label="Close address modal"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => handleOptionChange('existing')}
                  className={`px-4 py-2 cursor-pointer rounded-md flex items-center gap-2 ${
                    selectedOption === 'existing' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                  aria-label="Select saved addresses"
                >
                  <FiCheck className={selectedOption === 'existing' ? 'block' : 'hidden'} />
                  Saved Addressesf
                </button>
                <button
                  onClick={() => handleOptionChange('new')}
                  className={`px-4 py-2 cursor-pointer rounded-md flex items-center gap-2 ${
                    selectedOption === 'new' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                  aria-label="Add new address"
                >
                  <FiPlus className={selectedOption === 'new' ? 'block' : 'hidden'} />
                  New Address
                </button>
              </div>

              {selectedOption === 'existing' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Select an address</h3>
                  {savedAddresses.length === 0 ? (
                    <p className="text-gray-500">No saved addresses found.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedAddresses.map((address) => (
                        <div
                          key={address.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            address.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'
                          }`}
                          onClick={() => handleAddressSelect(address)}
                          role="button"
                          tabIndex={0}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddressSelect(address)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{address.addressType}</h4>
                                {address.isDefault && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Default</span>
                                )}
                              </div>
                              <p className="text-gray-600 mt-1">{address.fullName}</p>
                              <p className="text-gray-600">{address.addressLine}</p>
                              {address.addressLine2 && <p className="text-gray-600">{address.addressLine2}</p>}
                              <p className="text-gray-600">
                                {address.city}, {address.state} {address.pincode}
                              </p>
                              <p className="text-gray-600">{address.country}</p>
                              <p className="text-gray-600 mt-2 flex items-center gap-1">
                                <FiPhone size={14} /> {address.phone || 'N/A'}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditAddress(address);
                                }}
                                className="text-blue-500 cursor-pointer hover:text-blue-700"
                                title="Edit address"
                                aria-label={`Edit address ${address.addressType}`}
                              >
                                <FiEdit2 size={16} />
                              </button>
                              {!address.isDefault && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteAddress(address.id);
                                  }}
                                  className="text-red-500 cursor-pointer hover:text-red-700"
                                  title="Delete address"
                                  aria-label={`Delete address ${address.addressType}`}
                                >
                                  <FiTrash2 size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddressSelect(address);
                              }}
                              className="text-sm cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                              aria-label={`Select address ${address.addressType}`}
                            >
                              Select
                            </button>
                            {!address.isDefault && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetDefaultAddress(address.id);
                                }}
                                className="text-sm cursor-pointer bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                                aria-label={`Set ${address.addressType} as default address`}
                              >
                                Set as Default
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedOption === 'new' && (
                <form onSubmit={handleSubmitAddress} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="addressType"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Address Type (e.g., Home, Office) *
                      </label>
                      <select
                        id="addressType"
                        name="addressType"
                        value={formData.addressType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="home">Home</option>
                        <option value="office">Office</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        aria-required="true"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="addressLine"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="addressLine"
                      name="addressLine"
                      value={formData.addressLine}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="addressLine2"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Apt, Suite, Building (Optional)
                    </label>
                    <input
                      type="text"
                      id="addressLine2"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        aria-required="true"
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State/Province *
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        aria-required="true"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="pincode"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        ZIP/Postal Code *
                      </label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        aria-required="true"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Country *
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        aria-required="true"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        aria-required="true"
                      />
                    </div>
                  </div>

                  <div className="flex items-center pt-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      aria-label="Set as default shipping address"
                    />
                    <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                      Set as default shipping address
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOption('existing');
                        resetForm();
                      }}
                      className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      aria-label="Cancel address form"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label={editAddressId ? 'Update address' : 'Save address'}
                    >
                      {editAddressId ? 'Update Address' : 'Save Address'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShippingCart;