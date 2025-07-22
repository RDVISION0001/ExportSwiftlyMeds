import React, { useEffect, useRef } from 'react';
import marketPlace from '../assets/marketPlace.webp';

const TargetCountry = () => {
  // Country data organized in arrays
  const globalCountries = {
    column1: [
      ['INDIA', 'UNITED STATES'],
      ['FRANCE', 'CANADA'],
      ['UNITED KINGDOM', 'AUSTRALIA'],
      ['RUSSIA', 'SPAIN'],
      ['NETHERLANDS', 'LUXEMBOURG'],
      ['SWEDEN', 'TURKEY'],
      ['DENMARK', 'LITHUANIA'],
      ['FINLAND', 'SUDAN']
    ],
    column2: [
      ['GERMANY', 'JAPAN'],
      ['BRAZIL', 'ITALY'],
      ['SOUTH KOREA', 'SAUDI ARABIA'],
      ['UNITED ARAB EMIRATES', 'SWITZERLAND'],
      ['SINGAPORE', 'MALAYSIA'],
      ['MEXICO', 'PORTUGAL'],
      ['MALTA', 'NORWAY']
    ]
  };

  const cities = {
    usa: [
      'New York', 'Atlanta', 'Virginia', 'Los Angeles', 'Chicago',
      'Houston', 'Miami', 'San Francisco', 'Washington DC', 'Boston',
      'Las Vegas', 'Seattle'
    ],
    europe: [
      'Paris', 'Rome', 'London', 'Berlin', 'Amsterdam',
      'Barcelona', 'Vienna', 'Prague', 'Madrid', 'Zurich'
    ],
    middleEast: [
      'Dubai', 'Abu Dhabi', 'Riyadh', 'Doha', 'Istanbul',
      'Jerusalem', 'Amman', 'Beirut', 'Kuwait', 'Muscat'
    ],
    asia: [
      'Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Tokyo',
      'Hong Kong', 'Bangkok', 'Shanghai', 'Beijing', 'Kuala Lumpur', 'Jakarta'
    ]
  };

  const topRef = useRef(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth'});
  }, [])

  return (
    <div ref={topRef} className="bg-white">
      {/* Hero Image */}
      <div className="w-full">
        <img src={marketPlace} alt="Global Market Coverage" className="w-full object-cover" />
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Global Countries Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Market Area</h2>
          
          <div className="bg-[#BBFBFF] py-3 px-4 mb-6 rounded-lg">
            <h3 className="text-xl font-semibold text-center text-gray-800">GLOBAL COUNTRIES</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* First Column */}
            <div className="space-y-4">
              {globalCountries.column1.map((pair, index) => (
                <div key={`global-1-${index}`} className="grid grid-cols-2 gap-4">
                  <div className={`${index === 0 ? 'font-bold' : ''} text-gray-700`}>{pair[0]}</div>
                  <div className={`${index === 0 ? 'font-bold' : ''} text-gray-700`}>{pair[1]}</div>
                </div>
              ))}
            </div>

            {/* Second Column */}
            <div className="space-y-4">
              {globalCountries.column2.map((pair, index) => (
                <div key={`global-2-${index}`} className="grid grid-cols-2 gap-4">
                  <div className={`${index === 0 ? 'font-bold' : ''} text-gray-700`}>{pair[0]}</div>
                  <div className={`${index === 0 ? 'font-bold' : ''} text-gray-700`}>{pair[1]}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cities Sections */}
        <div className="space-y-12">
          {/* US Cities */}
          <section>
            <div className="bg-[#BBFBFF] py-3 px-4 mb-6 rounded-lg">
              <h3 className="text-xl font-semibold text-center text-gray-800">Cities in the United States (U.S.A)</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {cities.usa.map((city, index) => (
                <div key={`usa-${index}`} className="bg-gray-50 p-3 rounded-lg text-gray-700">
                  {city}
                </div>
              ))}
            </div>
          </section>

          {/* Europe Cities */}
          <section>
            <div className="bg-[#BBFBFF] py-3 px-4 mb-6 rounded-lg">
              <h3 className="text-xl font-semibold text-center text-gray-800">Cities in Europe</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {cities.europe.map((city, index) => (
                <div key={`europe-${index}`} className="bg-gray-50 p-3 rounded-lg text-gray-700">
                  {city}
                </div>
              ))}
            </div>
          </section>

          {/* Middle East Cities */}
          <section>
            <div className="bg-[#BBFBFF] py-3 px-4 mb-6 rounded-lg">
              <h3 className="text-xl font-semibold text-center text-gray-800">Cities in the Middle East</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {cities.middleEast.map((city, index) => (
                <div key={`middleEast-${index}`} className="bg-gray-50 p-3 rounded-lg text-gray-700">
                  {city}
                </div>
              ))}
            </div>
          </section>

          {/* Asia Cities */}
          <section>
            <div className="bg-[#BBFBFF] py-3 px-4 mb-6 rounded-lg">
              <h3 className="text-xl font-semibold text-center text-gray-800">Cities in Asia</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {cities.asia.map((city, index) => (
                <div key={`asia-${index}`} className="bg-gray-50 p-3 rounded-lg text-gray-700">
                  {city}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TargetCountry;