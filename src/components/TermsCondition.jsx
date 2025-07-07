import React, { useEffect, useRef } from 'react';

const TermsCondition = () => {

    const topRef = useRef(null);

    useEffect(() =>{
        topRef.current?.scrollIntoView({ behavior: 'smooth'});
        window.scrollTo({ top: 0, behavior: 'smooth'});
    }, [])
  return (
    <div ref={topRef} className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Terms and Conditions</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <p className="text-gray-700 mb-4">
          Welcome to SwiftlyMeds! These terms and conditions outline the rules and regulations for the use of SwiftlyMeds's Website, 
          located at www.swiftlymeds.com.
        </p>
        <p className="text-gray-700">
          By accessing this website, we assume you accept these terms and conditions. Do not continue to use SwiftlyMeds if you do 
          not agree to take all of the terms and conditions stated on this page.
        </p>
      </div>

      <div className="space-y-8">
        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">1. International Medication Sales</h3>
          <div className="space-y-4">
            <p className="text-gray-700">
              SwiftlyMeds specializes in facilitating the international sale and delivery of prescription medications. By using our 
              service, you acknowledge and agree that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>You are responsible for ensuring the medications you order are legal to import into your country</li>
              <li>All prescription medications require a valid prescription from a licensed healthcare provider</li>
              <li>We cannot guarantee delivery times due to customs processing in your country</li>
              <li>Some medications may be restricted in certain countries and we reserve the right to refuse such orders</li>
            </ul>
          </div>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">2. Intellectual Property</h3>
          <p className="text-gray-700">
            Unless otherwise stated, SwiftlyMeds and/or its licensors own the intellectual property rights for all material on 
            SwiftlyMeds. All intellectual property rights are reserved.
          </p>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">3. User Responsibilities</h3>
          <div className="space-y-4">
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>You must provide accurate and complete information when placing orders</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You agree not to use our service for any illegal purpose or in violation of any laws</li>
              <li>You confirm that all prescriptions submitted are valid and issued for your personal use</li>
            </ul>
          </div>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">4. Order Processing and Payments</h3>
          <div className="space-y-4">
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>All prices are subject to change without notice</li>
              <li>Payment must be completed before order processing begins</li>
              <li>We accept various payment methods including credit cards and international payment options</li>
              <li>Customs duties, taxes, or fees imposed by your country are your responsibility</li>
              <li>Refunds are processed according to our Refund Policy (see section 7)</li>
            </ul>
          </div>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">5. Shipping and Delivery</h3>
          <div className="space-y-4">
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Delivery times are estimates only and not guaranteed</li>
              <li>We are not responsible for delays caused by customs or other regulatory agencies</li>
              <li>Some countries may require additional documentation for medication imports</li>
              <li>You are responsible for providing a correct and complete shipping address</li>
            </ul>
          </div>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">6. Returns and Refunds</h3>
          <div className="space-y-4">
            <p className="text-gray-700">
              Due to the nature of pharmaceutical products, our return policy is limited:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>We cannot accept returns of prescription medications unless they were damaged during shipping</li>
              <li>Refunds may be issued for unshipped orders canceled within 24 hours</li>
              <li>If your order is seized by customs, we may issue a partial refund at our discretion</li>
              <li>To request a refund, please contact our customer service within 14 days of delivery</li>
            </ul>
          </div>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">7. Disclaimer and Limitation of Liability</h3>
          <div className="space-y-4">
            <p className="text-gray-700">
              SwiftlyMeds acts as a facilitator between international pharmacies and customers. We do not:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Practice medicine or provide medical advice</li>
              <li>Guarantee the availability of any specific medication</li>
              <li>Assume responsibility for how you use the medications you purchase</li>
            </ul>
            <p className="text-gray-700">
              To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions 
              relating to our website and the use of this website.
            </p>
          </div>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">8. Governing Law & Jurisdiction</h3>
          <p className="text-gray-700">
            These terms will be governed by and interpreted in accordance with the laws of [Varanasi/UP], and you submit 
            to the non-exclusive jurisdiction of the state and federal courts located in [Varanasi/UP] for the resolution 
            of any disputes.
          </p>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">9. Changes to Terms</h3>
          <p className="text-gray-700">
            We reserve the right to revise these terms at any time as we see fit. By continuing to access or use our service 
            after those revisions become effective, you agree to be bound by the revised terms.
          </p>
        </section>

        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">10. Contact Information</h3>
          <p className="text-gray-700">
            If you have any questions about these Terms and Conditions, please contact us:
          </p>
          <div className="mt-3 p-4 bg-white rounded-md">
            <p className="font-medium">SwiftlyMeds Customer Service</p>
            <p>Email: <a href="mailto:info@mensvitaminshop.com" className="hover:underline text-gray-600 hover:text-gray-800">info@SwiftlyMeds.com </a></p>
            <p>Phone: <a href="tel:088580 43370" className="hover:underline text-gray-600 hover:text-gray-800">088580 43370 </a></p>
            <p>Address:  <a href="https://www.google.com/maps/search/H-6-K+Chandra+Chauraha+SA+20%2F205+Ashapur+Road+Hanuman+Nagar+Ashapur+Varanasi+Uttar+Pradesh+221007" target="_blank"  rel="noopener noreferrer" className="hover:underline hover:text-gray-700"> H-6-K, Chandra Chauraha, SA 20/205, Ashapur Road, Hanuman Nagar, Ashapur, Varanasi, Uttar Pradesh 221007 </a></p>
          </div>
          
        </section>
      </div>
    </div>
  );
};

export default TermsCondition;