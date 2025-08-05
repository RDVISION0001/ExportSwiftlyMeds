import React, { useEffect, useRef } from 'react';

const OurMissin = () => {

  const topRef = useRef(null);

  useEffect(() =>{
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [])
  return (
    <div ref={topRef} className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Affordable Medicine for All</h1>
          <p className="text-xl sm:text-2xl mb-8">
            Swiftly Meds is committed to providing high-quality, affordable medicines worldwide with a seamless, user-friendly experience.
          </p>
          <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition">
            Shop Now
          </button>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Our Mission</h2>
        <p className="text-lg text-gray-600 text-center mb-12">
          At Swiftly Meds, we believe healthcare should be accessible to everyone. Our mission is to deliver affordable, genuine medicines to your doorstep with a simple, intuitive platform that makes ordering effortless.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { icon: "🌍", title: "Worldwide Delivery", desc: "Fast, reliable shipping." },
            { icon: "💲", title: "Affordable Pricing", desc: "Discounts & transparent costs." },
            { icon: "📱", title: "Easy-to-Use App", desc: "Order in just a few taps." },
            { icon: "🛡️", title: "Verified Medicines", desc: "Trusted sources only." },
          ].map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
              <span className="text-4xl mb-4 block">{item.icon}</span>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us? */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Swiftly Meds?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "💰 Cost-Effective", desc: "We negotiate directly with suppliers to keep prices low." },
              { title: "🚚 Fast Delivery", desc: "Express shipping options available." },
              { title: "🔒 Secure Payments", desc: "100% safe & encrypted transactions." },
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Join Us in Making Healthcare Accessible</h2>
        <button className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition">
          Get Started
        </button>
      </section>
    </div>
  );
};

export default OurMissin;