import React from 'react';
import lupin from '../../assets/manufacture/lupin.png';
import itc from '../../assets/manufacture/itcLogo.png';
import marico from '../../assets/manufacture/marico.jpg';
import abbott from '../../assets/manufacture/abbott.png';
import gsk from '../../assets/manufacture/gsk.png';
import mankind from '../../assets/manufacture/mankind.png';
import hetroDrug from '../../assets/manufacture/hetroDrug.jpeg';
import intas from '../../assets/manufacture/intas.webp';
import emcure from '../../assets/manufacture/emcure.jpeg';
import glenMark from '../../assets/manufacture/glenMark.avif';
import zydus from '../../assets/manufacture/zydus.webp';
import sun from '../../assets/manufacture/sun.jpg';
import reddy from '../../assets/manufacture/reddy.jpeg';
import myLan from '../../assets/manufacture/Mylan.png';
import natco from '../../assets/manufacture/natco.png';

function Manufacturer() {
  const imgData = [
    { id: 1, img: lupin, name: 'Lupin' },
    { id: 2, img: itc, name: 'ITC' },
    { id: 3, img: marico, name: 'Marico' },
    { id: 4, img: abbott, name: 'Abbott' },
    { id: 5, img: gsk, name: 'GSK' },
    { id: 6, img: mankind, name: 'Mankind' },
    { id: 7, img: hetroDrug, name: 'Hetro Drugs' },
    { id: 8, img: intas, name: 'Intas' },
    { id: 9, img: emcure, name: 'Emcure' },
    { id: 10, img: glenMark, name: 'Glenmark' },
    { id: 11, img: zydus, name: 'Zydus'},
    { id: 12, img: sun, name: 'Sun Pharma'},
    { id: 13, img: reddy, name: 'Dr.Reddy'},
    { id: 14, img: myLan, name: 'Mylan Pharma'},
    { id: 15, img: natco, name: 'Natco Pharma'},
  ];

  return (
    <div className='w-full max-w-7xl mx-auto px-4 py-8'>
      <h2 className='text-2xl font-bold text-center mb-8'>Our Manufacturing Partners</h2>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
        {imgData.map((item) => (
          <div 
            key={item.id} 
            className='bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer'
          >
            <div className='p-4 flex flex-col items-center'>
              <div className='h-32 w-32 flex items-center justify-center'>
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className='max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105'
                />
              </div>
              <h3 className='mt-4 text-center font-medium text-gray-700'>{item.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Manufacturer;