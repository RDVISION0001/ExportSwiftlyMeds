import React, { useEffect, useRef } from 'react';
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
import m3 from '../../assets/manufacture/3m.webp';
import bd from '../../assets/manufacture/bd.png';
import cipla from '../../assets/manufacture/cipla.png';
import emami from '../../assets/manufacture/emami.webp';
import furist from '../../assets/manufacture/furist.png';
import galderma from '../../assets/manufacture/galderma.png';
import lucius from '../../assets/manufacture/lucius.jpeg';
import mama from '../../assets/manufacture/mama.png';
import omron from '../../assets/manufacture/omron.avif';
import pg from '../../assets/manufacture/p&g.png';
import roche from '../../assets/manufacture/roche.png';
import romson from '../../assets/manufacture/romson.png';
import sanofi from '../../assets/manufacture/sanofi.png';
import trueCure from '../../assets/manufacture/trueCure.png';
import ajanta from '../../assets/manufacture/ajanta.png';
import alambic from '../../assets/manufacture/alambic.png';
import alkem from '../../assets/manufacture/alkem.avif';
import apex from '../../assets/manufacture/apex.png';
import astra from '../../assets/manufacture/astrazeneca.png';
import astro from '../../assets/manufacture/astro.png';
import boehringer from '../../assets/manufacture/boehringer.png';
import cadila from '../../assets/manufacture/cadila.webp';
import eris from '../../assets/manufacture/eris.png';
import framco from '../../assets/manufacture/framco.png';
import indico from '../../assets/manufacture/indoco.png';
import ipca from '../../assets/manufacture/ipca.png';
import macleods from '../../assets/manufacture/macleods.png';
import mayer from '../../assets/manufacture/mayer.png';
import miraccure from '../../assets/manufacture/miraccure.png';
import msd from '../../assets/manufacture/MSD.webp';
import pfizer from '../../assets/manufacture/pfizer.png';
import torrent from '../../assets/manufacture/torrent.png';
import usv from '../../assets/manufacture/usv.png';

function Manufacturer() {

  const topRef = useRef(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth'});
    window.scrollTo({ top: 0, behavior:'smooth'});
  }, [])
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
    { id: 16, img: m3, name: '3M'},
    { id: 17, img: bd, name: 'BD'},
    { id: 18, img: cipla, name: 'Cipla Health' },
    { id: 19, img: emami, name: 'Emami' },
    { id: 20, img: furist, name: 'Furist' },
    { id: 21, img: galderma, name: 'Galderma' },
    { id: 22, img: lucius, name: 'Lucius' },
    { id: 23, img: mama, name: 'Mamaearth' },
    { id: 24, img: omron, name: 'Omron' },
    { id: 25, img: pg, name: 'p&g' },
    { id: 26, img: roche, name: 'roche' },
    { id: 27,img: romson, name: 'Romsons' },
    { id: 28, img: sanofi, name: 'Sanofi' },
    { id: 29, img: trueCure, name: 'TrueCure' },
    { id: 30, img: ajanta, name: 'Ajanta' },
    { id: 31, img: alambic, name: 'Alambic' },
    { id: 32, img: alkem, name: 'Alkem'},
    { id: 33, img: apex,  name: 'Apex' },
    { id: 34, img: astra, name: 'Astrazeneca' },
    { id: 35, img: astro, name: 'Astro'},
    { id: 36, img: boehringer, name: 'Boehringer'},
    { id: 37, img: cadila, name: 'Cadila'},
    { id: 38, img: eris, name: 'Eris'},
    { id: 39, img: framco, name: 'Framco'},
    { id: 40, img: indico, name: 'Indoco'},
    {id: 41, img: ipca, name: 'Ipca'},
    { id: 42, img: macleods, name: 'macleos'},
    { id: 43, img: mayer, name: 'Meyer'},
    { id: 44,img: miraccure, name: 'Miraccure'},
    { id: 45, img: msd, name: 'MSD'},
    { id: 46, img: pfizer, name: 'Pfizer'},
    { id: 47, img: torrent, name: 'Torrent'},
    { id: 48, img: usv, name: 'USV'}, 
  ];

  return (
    <div ref={topRef} className='w-full max-w-7xl mx-auto px-4 py-8'>
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