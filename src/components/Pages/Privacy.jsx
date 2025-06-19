import React, { useEffect, useRef } from 'react';

const Privacy = () => {

    const topRef = useRef(null);

    useEffect(() =>{
        topRef.current?.scrollIntoView({ behavior: 'smooth'});
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [])

  return (
    <div ref={topRef} className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Privacy Policy</h1>
        <p className="mt-4 text-lg text-gray-600">Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 sm:p-8">
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Introduction</h2>
          <p className="text-gray-600">
            At SwiftlyMeds, we prioritize your privacy and are committed to safeguarding your personal information. 
            This Privacy Policy outlines how we collect, use, and protect your data when you visit our website.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li><strong>Personal Information:</strong> Name, email, shipping address, payment details</li>
            <li><strong>Usage Data:</strong> IP address, browser type, pages visited</li>
            <li><strong>Cookies:</strong> To enhance your browsing experience</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">How We Use Your Information</h2>
          <div className="grid md:grid-cols-2 gap-4 text-gray-600">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Order Processing</h3>
              <p>To fulfill and deliver your purchases</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Communication</h3>
              <p>Respond to inquiries and provide support</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Improvements</h3>
              <p>Enhance our website and services</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Marketing</h3>
              <p>Send promotions (with your consent)</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Security</h2>
          <p className="text-gray-600">
            We implement industry-standard security measures including SSL encryption and secure payment processing 
            to protect your information. While no system is completely secure, we take all reasonable precautions.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Rights</h2>
          <div className="space-y-3 text-gray-600">
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access or delete your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Opt-out of marketing communications</li>
              <li>Request data portability</li>
            </ul>
            <p>To exercise these rights, contact us at <a href="mailto:support@swiftlymeds.com" className="text-blue-600 hover:underline">support@swiftlymeds.com</a></p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Cookies</h2>
          <p className="text-gray-600">
            Our website uses cookies to analyze traffic and remember preferences. You can disable cookies in your 
            browser settings, but some features may not function properly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-600">
            For any privacy-related questions, please contact us at:<br />
            <a href="mailto:support@swiftlymeds.com" className="text-blue-600 hover:underline">support@swiftlymeds.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;