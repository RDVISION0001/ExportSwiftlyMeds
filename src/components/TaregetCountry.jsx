import React from 'react';
import marketPlace from '../assets/marketPlace.webp';

const TaregetCountry = () => {
  // Group countries in pairs for the table layout
  const countryPairs1 = [
    ['INDIA', 'UNITED STATES'],
    ['FRANCE', 'CANADA'],
    ['UNITED KINGDOM', 'AUSTRALIA'],
    ['RUSSIA', 'SPAIN'],
    ['NETHERLANDS', 'LUXEMBOURG'],
    ['SWEDEN', 'TURKEY'],
    ['DENMARK', 'LITHUANIA'],
    ['FINLAND', 'SUDAN']
  ];

  const countryPairs2 = [
    ['GERMANY', 'JAPAN'],
    ['BRAZIL', 'ITALY'],
    ['SOUTH KOREA', 'SAUDI ARABIA'],
    ['UNITED ARAB EMIRATES', 'SWITZERLAND'],
    ['SINGAPORE', 'MALAYSIA'],
    ['MEXICO', 'PORTUGAL'],
    ['MALTA', 'NORWAY']
  ];

  return (
    <>
    <div>
        <img src={marketPlace} alt="" className='w-full'/>
    </div>
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Our Market Area</h2>
     <div className='bg-[#BBFBFF] py-'>
     <h3 className="text-xl font-semibold text-center mb-6">GLOBAL COUNTRIES</h3>
     </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Column */}
        <div className="space-y-4">
          {countryPairs1.map((pair, index) => (
            <div key={index} className="grid grid-cols-2 gap-4">
              <div className={index === 0 ? 'font-medium' : ''}>{pair[0]}</div>
              <div className={index === 0 ? 'font-medium' : ''}>{pair[1]}</div>
            </div>
          ))}
        </div>

        {/* Second Column */}
        <div className="space-y-4">
          {countryPairs2.map((pair, index) => (
            <div key={index} className="grid grid-cols-2 gap-4">
              <div className={index === 0 ? 'font-medium' : ''}>{pair[0]}</div>
              <div className={index === 0 ? 'font-medium' : ''}>{pair[1]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default TaregetCountry;