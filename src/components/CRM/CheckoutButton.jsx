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

const stripePromiseVox = loadStripe("pk_test_51RY5guKomOVAGS7djPG0yRUk9OHOglAA3haDBNIKDz70klhrJ515LpcDNOcBzO12aCQZNosK1SaZj0mHAoJ39zYy00O3gEYnhK");
const stripePromiseRdvision=loadStripe("pk_test_51KpHlnSAxOboMMom0iL0iGQCFoBJm1TpQxShbdJbj7vsqVh8QHWz3LFV66YSJDMRUXuA0UAfl5lddXOcgDlXYhmD00hHgDaIEU")
const CheckoutForm = ({orderNumber,remark}) => {
    console.log(orderNumber,"hello")
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
        return_url: `http://localhost:3000/success/${orderNumber}`,
        // billing_details will be taken from AddressElement automatically
      },
    });

    if (result.error) {
      setMessage(result.error.message);
    }

    setLoading(false);
  };


  return (
    <form onSubmit={handleSubmit} className="w-[35vw] p-6 rounded-lg shadow-lg space-y-6">
      {/* Address input */}
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

      {message && (
        <div className="text-sm text-center text-red-600 mt-4">{message}</div>
      )}
    </form>
  );
};

const CheckoutButton = ({orderNumber,remark}) => {
  const [clientSecret, setClientSecret] = useState("");
  console.log("Order number :- ",orderNumber)

  useEffect(() => {
    axiosInstance
    .post("/api/payment/create-payment-intent", {
      accountType: remark=="tried"?"vox":"rdvision", // or "vox"
      amount: 5549,         // optional: if you want to control amount from frontend
      currency: "usd",
      orderNumber       // optional: "inr", "usd", etc.
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
console.log("Remark is ",remark)
  return (
    <div className="flex items-center w-[35vw] justify-center p-4">
      {clientSecret && (
        <Elements stripe={remark=="tried"?stripePromiseVox:stripePromiseRdvision} options={options}>
          <CheckoutForm orderNumber={orderNumber} remark={remark}/>
        </Elements>
      )}
    </div>
  );
};

export default CheckoutButton;
