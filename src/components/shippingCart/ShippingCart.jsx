import React from 'react';
import { useAuth } from '../../AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft } from 'react-icons/fi';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, setCart } = useAuth();

  const removeItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    alert('Item removed from cart');
  };

  const removePriceEntry = (productIndex, priceIndex) => {
    const newCart = [...cart];
    newCart[productIndex].product.prices.splice(priceIndex, 1);
    setCart(newCart);
  };

  const updatePriceQuantity = (productIndex, priceIndex, newQuantity) => {
    if (newQuantity < 1) {
      alert('Quantity cannot be less than 1');
      return;
    }

    const newCart = [...cart];
    newCart[productIndex].product.prices[priceIndex].quantity = newQuantity;
    setCart(newCart);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const priceDetails = item.product.prices || [];
      const itemTotal = priceDetails.reduce((sum, priceObj) => {
        return sum + ((priceObj.price || 0) * (priceObj.quantity || 1));
      }, 0);
      return total + itemTotal;
    }, 0).toFixed(2);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <FiArrowLeft className="mr-2" /> Back to Shop
      </button>

      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Your Shopping Cart</h2>

      {cart && cart.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-6">
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-full sm:w-40 h-40 flex items-center justify-center mb-4 sm:mb-0 bg-gray-50 rounded-lg">
                  {item.product.imageUrls?.[0] ? (
                    <img
                      src={item.product.imageUrls[0]}
                      alt={item.product.name}
                      className="max-h-full max-w-full object-contain p-2"
                    />
                  ) : (
                    <div className="text-gray-400">No image available</div>
                  )}
                </div>

                <div className="flex-1 sm:ml-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-800">{item.product.name}</h3>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                      aria-label="Remove item"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm text-gray-600">
                    <p><span className="font-medium text-gray-700">Brand:</span> {item.product.brand}</p>
                    <p><span className="font-medium text-gray-700">Strength:</span> {item.product.strength}</p>
                    <p><span className="font-medium text-gray-700">Packaging:</span> {item.product.packagingSize} {item.product.packagingType}</p>
                    <p><span className="font-medium text-gray-700">Category:</span> {item.product.category}</p>
                  </div>

                  {item.product.prices?.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {item.product.prices.map((price, priceIndex) => (
                        <div key={priceIndex} className="border border-gray-100 p-3 rounded-md bg-gray-50">
                          <div className="flex justify-between items-center text-sm text-gray-700">
                            <div>
                              <p>
                                <span className="font-semibold text-gray-900">
                                  ${(price.price * price.quantity).toFixed(2)}
                                </span>{" "}
                                ({price.quantity} × ${price.price} {price.currency})
                              </p>
                            </div>
                            {/* <button
                              onClick={() => removePriceEntry(index, priceIndex)}
                              className="text-xs text-red-500 hover:underline"
                            >
                              Remove
                            </button> */}
                          </div>

                          <div className="flex items-center mt-2">
                            <button
                              onClick={() =>
                                updatePriceQuantity(index, priceIndex, price.quantity - 1)
                              }
                              className="w-7 h-7 border border-gray-300 rounded-l bg-white hover:bg-gray-100 flex items-center justify-center"
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="w-10 h-7 border-t border-b border-gray-300 flex items-center justify-center bg-white">
                              {price.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updatePriceQuantity(index, priceIndex, price.quantity + 1)
                              }
                              className="w-7 h-7 border border-gray-300 rounded-r bg-white hover:bg-gray-100 flex items-center justify-center"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:w-1/3">
            <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm sticky top-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${calculateTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-gray-900">${calculateTotal()}</span>
                </div>
              </div>
              <button
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <button
              onClick={() => navigate('/CatProduct')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <FiArrowLeft className="mr-2" /> Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
