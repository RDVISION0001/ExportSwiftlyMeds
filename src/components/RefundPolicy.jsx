import React, { useEffect, useRef, useState } from 'react';

const RefundPolicy = () => {

  const topRef = useRef(null);
  const [currentTime,setCurrentTime] = useState(new Date());

  useEffect(() =>{
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    });

    return () => clearInterval(timer);
  }, [])
  
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [])
  return (
    <div ref={topRef} className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Refund & Cancellation Policy</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <p className="text-gray-700 mb-4">
          At SwiftlyMeds, we strive to provide excellent service for our international customers. However, due to the nature of pharmaceutical products,
          we have specific policies regarding cancellations and refunds.
        </p>
        <p className="text-gray-700 font-medium">
          Please read this policy carefully before placing your order.
        </p>
      </div>

      <div className="space-y-8">
        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">1. Order Cancellation Policy</h3>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-md">
              <h4 className="font-medium text-blue-600">Before Processing</h4>
              <p className="text-gray-700 mt-2">
                You may cancel your order within <span className="font-semibold">24 hours</span> of placement for a full refund, provided we have not
                begun processing your order.
              </p>
            </div>

            <div className="p-4 bg-white rounded-md">
              <h4 className="font-medium text-blue-600">After Processing</h4>
              <p className="text-gray-700 mt-2">
                Once your order has entered processing (typically within 24-48 hours), cancellations may not be possible due to the
                immediate handling requirements for pharmaceutical products.
              </p>
            </div>

            <div className="p-4 bg-white rounded-md">
              <h4 className="font-medium text-blue-600">How to Cancel</h4>
              <p className="text-gray-700 mt-2">
                To request cancellation, please contact our customer service immediately at:
              </p>
              <p className="mt-2 text-gray-700 font-medium">
                Email: <a href="mailto:info@swiftlymeds.com" className="hover:underline text-gray-600 hover:text-gray-800">info@swiftlymeds.com </a><br />
                Phone: <a href="tel:088580 43370" className="hover:underline text-gray-600 hover:text-gray-800">
                  088580 43370
                </a>
              </p>
              <p className="text-gray-700 mt-2 text-sm">
                Include your order number in all cancellation requests.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">2. Refund Policy</h3>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-md">
              <h4 className="font-medium text-blue-600">Eligible Refunds</h4>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                <li>Orders successfully canceled within the 24-hour window</li>
                <li>Medications that arrive damaged (must report within 7 days of delivery)</li>
                <li>Undeliverable packages returned to us by customs or shipping carriers</li>
                <li>Confirmed errors in your order made by SwiftlyMeds</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-md">
              <h4 className="font-medium text-blue-600">Non-Refundable Situations</h4>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                <li>Change of mind after order processing has begun</li>
                <li>Customs seizures in your country (unless we guaranteed delivery)</li>
                <li>Incorrect shipping information provided by the customer</li>
                <li>Prescription medications that have left our facility</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-md">
              <h4 className="font-medium text-blue-600">Partial Refunds</h4>
              <p className="text-gray-700 mt-2">
                In some cases, we may issue partial refunds at our discretion:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                <li>Delays beyond our stated shipping times (percentage based on delay length)</li>
                <li>Partial order fulfillment when items become unavailable</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">3. International Shipping Considerations</h3>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-md">
              <h4 className="font-medium text-blue-600">Customs & Import Issues</h4>
              <p className="text-gray-700 mt-2">
                SwiftlyMeds cannot be responsible for medications refused by your country's customs. We recommend:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                <li>Checking your country's medication import laws before ordering</li>
                <li>Being available to provide any required documentation to customs</li>
                <li>Understanding that some countries may destroy prohibited medications</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-md">
              <h4 className="font-medium text-blue-600">Shipping Delays</h4>
              <p className="text-gray-700 mt-2">
                While we provide estimated delivery times, international shipping involves many variables beyond our control.
                Delays do not typically qualify for refunds unless they exceed our maximum stated delivery time by more than 30 days.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">4. Refund Processing</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-md">
                <h4 className="font-medium text-blue-600">Timeframe</h4>
                <p className="text-gray-700 mt-2">
                  Approved refunds are processed within 7-10 business days, plus additional time for your bank or payment processor.
                </p>
              </div>

              <div className="p-4 bg-white rounded-md">
                <h4 className="font-medium text-blue-600">Method</h4>
                <p className="text-gray-700 mt-2">
                  Refunds are issued to the original payment method. For international transactions, currency conversion differences may apply.
                </p>
              </div>

              <div className="p-4 bg-white rounded-md">
                <h4 className="font-medium text-blue-600">Notification</h4>
                <p className="text-gray-700 mt-2">
                  You will receive email confirmation when your refund is processed. Contact us if you don't see the refund within 15 business days.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">5. How to Request a Refund</h3>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-md">
              <h4 className="font-medium text-blue-600">Requirements</h4>
              <p className="text-gray-700 mt-2">
                To request a refund, you must provide:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                <li>Your order number</li>
                <li>Reason for refund request</li>
                <li>For damaged items: photos of the product and packaging</li>
                <li>For customs issues: official documentation from customs</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-md">
              <h4 className="font-medium text-blue-600">Contact Information</h4>
              <p className="text-gray-700 mt-2">
                Submit refund requests to:
              </p>
              <p className="mt-2 text-gray-700 font-medium">
                Email: <a href="mailto:info@swiftlymeds.com" className="hover:underline text-gray-600 hover:text-gray-800">info@SwiftlyMeds.com</a><br />
                Phone: <a href="tel:088580 43370" className="hover:underline text-gray-600 hover:text-gray-800"> 088580 43370 </a>
              </p>
              <p className="text-gray-700 mt-2 text-sm">
                We typically respond to refund requests within 2 business days.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">6. Policy Updates</h3>
          <p className="text-gray-700">
            We may update this policy periodically. The current version is always available on our website and was last updated on {currentTime.toLocaleString()}.
          </p>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">7. Questions?</h3>
          <p className="text-gray-700">
            If you have questions about our Refund & Cancellation Policy, please contact our customer service team:
          </p>
          <div className="mt-3 p-4 bg-white rounded-md">
            <p className="font-medium">SwiftlyMeds Customer Service</p>
            <p>Email:  <a href="mailto:info@swiftlymeds.com" className="hover:underline text-gray-600 hover:text-gray-800">info@SwiftlyMeds.com</a></p>
            <p>Phone: <a href="tel:088580 43370" className="hover:underline text-gray-600 hover:text-gray-800"> 088580 43370</a></p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RefundPolicy;