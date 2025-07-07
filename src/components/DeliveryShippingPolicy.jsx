import React, { useEffect, useRef } from 'react';

const DeliveryShippingPolicy = () => {


    const topRef = useRef(null);

    useEffect(() =>{
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [])
  return (
    <div ref={topRef} className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Delivery & Shipping Policy</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <p className="text-gray-700 mb-4">
          At SwiftlyMeds, we understand the importance of reliable delivery for your medications. This policy outlines our shipping 
          procedures, delivery timelines, and important information for international customers.
        </p>
        <p className="text-gray-700 font-medium">
          Please review this policy before placing your order.
        </p>
      </div>

      <div className="space-y-8">
        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">1. Shipping Methods & Carriers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-white rounded-md">
              <h4 className="font-medium text-blue-600">Standard International</h4>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li>7-14 business days delivery</li>
                <li>Tracked shipping</li>
                <li>Signature required</li>
                <li>Most economical option</li>
              </ul>
            </div>
            
            <div className="p-4 bg-white rounded-md">
              <h4 className="font-medium text-blue-600">Express Shipping</h4>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li>3-7 business days delivery</li>
                <li>Priority handling</li>
                <li>Real-time tracking</li>
                <li>Higher cost option</li>
              </ul>
            </div>
          </div>
          <p className="text-gray-700 mt-4">
            We partner with reputable international carriers including DHL, FedEx, and national postal services depending on 
            your destination country.
          </p>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">2. Processing Time</h3>
          <div className="p-4 bg-white rounded-md">
            <p className="text-gray-700">
              All orders require <span className="font-semibold">24-48 hours</span> for processing and verification before shipping. 
              This includes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
              <li>Prescription verification</li>
              <li>Quality control check</li>
              <li>Customs documentation preparation</li>
              <li>Packaging for international transit</li>
            </ul>
            <p className="text-gray-700 mt-2">
              Orders placed on weekends or holidays will begin processing the next business day.
            </p>
          </div>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">3. Delivery Time Estimates</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-md">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left text-blue-600">Region</th>
                  <th className="px-4 py-2 text-left text-blue-600">Standard Shipping</th>
                  <th className="px-4 py-2 text-left text-blue-600">Express Shipping</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2">North America</td>
                  <td className="px-4 py-2">7-10 business days</td>
                  <td className="px-4 py-2">3-5 business days</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Europe</td>
                  <td className="px-4 py-2">8-12 business days</td>
                  <td className="px-4 py-2">4-6 business days</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Asia/Pacific</td>
                  <td className="px-4 py-2">10-14 business days</td>
                  <td className="px-4 py-2">5-7 business days</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Other Regions</td>
                  <td className="px-4 py-2">12-18 business days</td>
                  <td className="px-4 py-2">7-10 business days</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-700 mt-4 text-sm">
            *These are estimates only and do not include processing time. Actual delivery may vary due to customs clearance.
          </p>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">4. International Customs</h3>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-md">
              <h4 className="font-medium text-blue-600">Customs Documentation</h4>
              <p className="text-gray-700 mt-2">
                All international shipments include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li>Commercial invoice with product details</li>
                <li>Prescription copy (when required)</li>
                <li>Certificate of Pharmaceutical Product (CPP) if needed</li>
                <li>Proper HS codes for customs classification</li>
              </ul>
            </div>
            
            <div className="p-4 bg-white rounded-md">
              <h4 className="font-medium text-blue-600">Customs Duties & Taxes</h4>
              <p className="text-gray-700 mt-2">
                Recipients are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li>Any import duties, taxes, or fees</li>
                <li>Providing additional documentation if requested by customs</li>
                <li>Complying with all import regulations in their country</li>
              </ul>
              <p className="text-gray-700 mt-2 text-sm">
                We cannot predict or control customs fees which vary by country and product value.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">5. Order Tracking</h3>
          <div className="p-4 bg-white rounded-md">
            <p className="text-gray-700">
              You will receive tracking information via email once your order ships. Tracking typically updates within 24 hours 
              of shipment.
            </p>
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-blue-600">Tracking Issues</h4>
              <p className="text-gray-700">
                If your tracking hasn't updated in 3 business days or shows "delivered" but you haven't received your package:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li>Wait 24 hours as updates can be delayed</li>
                <li>Check with your local post office or customs office</li>
                <li>Contact our support if the issue persists</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">6. Shipping Restrictions</h3>
          <div className="p-4 bg-white rounded-md">
            <p className="text-gray-700">
              Certain medications cannot be shipped to some countries due to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
              <li>National import restrictions on specific drugs</li>
              <li>International narcotics control regulations</li>
              <li>Temperature-sensitive product limitations</li>
              <li>Quantity restrictions in destination countries</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We will notify you if any items in your order cannot be shipped to your destination and offer alternatives or 
              partial refunds when applicable.
            </p>
          </div>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">7. Undeliverable Packages</h3>
          <div className="p-4 bg-white rounded-md">
            <p className="text-gray-700">
              Packages may be returned to us as undeliverable for several reasons:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
              <li>Incorrect or incomplete address</li>
              <li>Failure to pay customs fees</li>
              <li>Refusal by customs</li>
              <li>Unsuccessful delivery attempts</li>
            </ul>
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-blue-600">Our Process</h4>
              <p className="text-gray-700">
                If your package is returned to us:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li>We will contact you to arrange reshipment (additional fees may apply)</li>
                <li>You may request a refund minus original shipping costs</li>
                <li>Certain medications cannot be resent due to stability concerns</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">8. Contact Information</h3>
          <div className="p-4 bg-white rounded-md">
            <p className="text-gray-700">
              For shipping inquiries or issues, please contact:
            </p>
            <div className="mt-2 space-y-1">
              <p className="font-medium">SwiftlyMeds Shipping Department</p>
              <p>Email: <a href="mailto:info@mensvitaminshop.com" className="hover:underline text-gray-600 hover:text-gray-800">info@SwiftlyMeds.com</a></p>
              <p>Phone: <a href="tel:088580 43370" className="hover:underline text-gray-600 hover:text-gray-800"> 088580 43370</a></p> 
            </div>
            <p className="text-gray-700 mt-4">
              Please include your order number in all communications for faster service.
            </p>
          </div>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">9. Policy Updates</h3>
          <p className="text-gray-700">
            This policy was last updated on [Insert Date]. We may update our shipping methods and policies periodically to 
            ensure the best service possible.
          </p>
        </section>
      </div>
    </div>
  );
};

export default DeliveryShippingPolicy;