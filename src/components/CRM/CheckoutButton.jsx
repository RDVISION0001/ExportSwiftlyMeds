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

const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromiseVox = loadStripe(stripeKey);

const CheckoutForm = ({ orderNumber, remark }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `https://swiftlymeds.com/success/${orderNumber}`,
      },
    });

    if (result.error) {
      setMessage(result.error.message);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[100vw] max-w-md mx-auto p-4 sm:p-6 md:p-8 space-y-6 rounded-lg bg-white shadow"
    >
      {message && (
        <div className="text-sm text-center text-red-600 mt-2">{message}</div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Billing Address</label>
        <AddressElement
          options={{
            mode: "billing",
            allowedCountries: [
              "AF", "AL", "DZ", "AD", "AO", "AG", "AR", "AM", "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BT", "BO", "BA", "BW", "BR", "BN", "BG", "BF", "BI", "KH", "CM", "CA", "CV", "CF", "TD", "CL", "CN", "CO", "KM", "CG", "CR", "HR", "CY", "CZ", "DK", "DJ", "DM", "DO", "EC", "EG", "SV", "GQ", "ER", "EE", "ET", "FJ", "FI", "FR", "GA", "GM", "GE", "DE", "GH", "GR", "GD", "GT", "GN", "GW", "GY", "HT", "HN", "HK", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IL", "IT", "JM", "JP", "JO", "KZ", "KE", "KI", "KR", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MO", "MK", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MR", "MU", "MX", "FM", "MD", "MC", "MN", "ME", "MA", "MZ", "MM", "NA", "NP", "NL", "NZ", "NI", "NE", "NG", "NO", "OM", "PK", "PW", "PA", "PG", "PY", "PE", "PH", "PL", "PT", "QA", "RO", "RU", "RW", "KN"],
            defaultValues: {
              name: "Customer Name",
              address: {
                country: "IN",
              },
            },
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Payment Method</label>
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
      >
        {loading ? "Processing..." : "Pay"}
      </button>
    </form>
  );
};

const CheckoutButton = ({ orderNumber, remark }) => {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    axiosInstance
      .post("/api/payment/create-payment-intent", {
        accountType: "vox",
        amount: 5549,
        currency: "usd",
        orderNumber,
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
    <div className="w-full  flex items-center justify-center px-4 py-8 bg-gray-50">
      {clientSecret && (
        <Elements stripe={stripePromiseVox} options={options}>
          <CheckoutForm orderNumber={orderNumber} remark={remark} />
        </Elements>
      )}
    </div>
  );
};

export default CheckoutButton;
