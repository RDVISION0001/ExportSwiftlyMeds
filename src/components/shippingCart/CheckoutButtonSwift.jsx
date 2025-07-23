import React, { useEffect, useState } from "react";
import {
  Elements,
  PaymentElement,
  AddressElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axiosInstance from "../../AuthContext/AxiosInstance";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext/AuthContext";

// const stripePromiseVox = loadStripe("pk_live_51RY5guKomOVAGS7dAHY7zT0opFxmbzNxNvsR9qwVHg9mnaVAxkGDT0sLztGHAFqXju9FFWXFHjEpIn6rUCNrmZJs001hB3HSlY");
const stripePromiseVox = loadStripe("pk_test_51RY5guKomOVAGS7djPG0yRUk9OHOglAA3haDBNIKDz70klhrJ515LpcDNOcBzO12aCQZNosK1SaZj0mHAoJ39zYy00O3gEYnhK")
// const stripePromiseRdvision=loadStripe("pk_live_51KpHlnSAxOboMMomzgtOknKDOwEg9AysCqs6g0O2e9ETloartosrHcf8qOAwOsChi8s5EYN8UHzNn2VgyKirIE6K00TujZ91YB")
const CheckoutForm = ({ closeFunction }) => {
  const navigate = useNavigate()
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [loading,setLoading] = useState(false)

  const { setCartCount } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // NO return_url – to prevent redirection
        payment_method_data: {
          billing_details: {
            // Optional if using AddressElement
            name: 'Customer Name',
            email: 'customer@example.com',
          },
        },
      },
      redirect: 'if_required', // This prevents redirection for cards that don't need 3D Secure
    });

    // Handle the result
    if (result.error) {
      // ❌ Payment failed
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: result.error.message || 'There was an issue with your payment.',
      });
    } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
      // ✅ Payment succeeded
      Swal.fire({
        icon: 'success',
        title: 'Payment Successful',
        text: 'Thank you! Your payment has been completed.',
      });

      setTimeout(() => {
        closeFunction()
        navigate("/orders")
        setCartCount(0)
      }, 3000)
    } else {
      // 🚧 Possibly requires action (like 3D Secure)
      Swal.fire({
        icon: 'info',
        title: 'Additional Authentication Required',
        text: 'Please complete the authentication to proceed with payment.',
      });
    }
    setLoading(false);
  };


  return (
    <form onSubmit={handleSubmit} className="w-[35vw] p-6 rounded-lg space-y-6">
      {/* Address input */}
      {message && (
        <div className="text-sm text-center text-red-600 mt-4">{message}</div>
      )}
      <div>
        <label className="block text-sm font-medium mb-2">Billing Address</label>
        <AddressElement
          options={{
            mode: "billing",
            allowedCountries: ["US", "IN", "GB", "CA"],
            defaultValues: {
              name: "Customer Name",
              address: {
                country: "IN",
              },
            },
          }}
        />
      </div>

      {/* Payment method selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Payment Method</label>
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
      >
        {loading ? "Processing..." : "Pay"}
      </button>


    </form>
  );
};

const CheckoutButtonSwift = ({ userId, addressId, closeFunction }) => {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    axiosInstance
      .post("/api/payment/swift/create-payment-intent", {
        userId, // or "vox"
        addressId,         // optional: if you want to control amount from frontend
        currency: "usd",
      })
      .then((res) => setClientSecret(res.data.clientSecret))
      .catch((err) => console.error("PaymentIntent error:", err));
  }, []);

  const appearance = {
    theme: "stripe",
  };

  const options = {
    clientSecret,
    appearance,
  };
  return (
    <div className="flex items-center w-[35vw] justify-center">
      {clientSecret && (
        <Elements stripe={stripePromiseVox} options={options} >
          <CheckoutForm closeFunction={closeFunction} />
        </Elements>
      )}
    </div>
  );
};

export default CheckoutButtonSwift;
