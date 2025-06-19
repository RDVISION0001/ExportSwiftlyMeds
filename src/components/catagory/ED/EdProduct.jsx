import React, { useEffect, useRef } from 'react';
import viagra from '../../../assets/viagra.jpg';
import cialis from '../../../assets/cialis.jpg';
import kamagra from '../../../assets/kamagra.jpg';
import edSample from '../../../assets/edSample.jpg';
import brand from '../../../assets/brandVigra.jpg';
import cenforce from '../../../assets/cenforce.jpg';
import stromectol from '../../../assets/stromectol.jpg';
import clomid from '../../../assets/clomid.jpg';
import doxy from '../../../assets/doxycycline.jpg';
import { useNavigate } from 'react-router-dom';

function EdProduct() {

    const topRef = useRef(null); 

    useEffect(() =>{
        topRef.current?.scrollIntoView({ behavior: 'smooth'});
        window.scrollTo({
            top:0,
            behavior: 'smooth'
        });
    }, [])

    const navigate = useNavigate()
    const products = [
        {
            title: 'Viagra',
            info: 'Active ingredient: Sildenafil',
            image: viagra,
            price: '$0.27',
        },
        {
            title: 'Cialis',
            info: 'Active ingredient: Tadalafil',
            image: cialis,
            price: '$0.68',
        },
        {
            title: 'Kamagra Oral Jelly',
            info: 'Active ingredient: Sildenafil',
            image: kamagra,
            price: '$3.94',
        },
        {
            title: 'ED Sample Pack 1',
            info: 'Active ingredient: Sildenafil',
            image: edSample,
            price: '$2.31',
        },
        {
            title: 'Brand Viagra',
            info: 'Active ingredient: Sildenafil',
            image: brand,
            price: '$1.77',
        },
        {
            title: 'Cenforce',
            info: 'Active ingredient: Sildenafil',
            image: cenforce,
            price: '$0.27',
        },
        {
            title: 'Stromectol',
            info: 'Active ingredient: Ivermectin',
            image: stromectol,
            price: '$2.64',
        },
        {
            title: 'Clomid',
            info: 'Active ingredient: Clomiphene',
            image: clomid,
            price: '$0.44',
        },
        {
            title: 'Doxycycline',
            info: '',
            image: doxy,
            price: '$0.30',
        },
    ];

    return (
        <>
            <div ref={topRef} className="w-full mx-auto">
                <div className="bg-green-500 font-bold text-center text-white py-2">
                    <h2>Erectile Dysfunction Medicines</h2>
                </div>
                <div className='w-full max-w-6xl mx-auto py-20'>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4">
                        {products.map((product, index) => (
                            <div
                                key={index}
                                className="border border-gray-300 rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:border-green-200 hover:scale-[1.02] group cursor-pointer"
                                onClick={() => navigate('/view')}
                            >
                                <div className="flex flex-col h-full">
                                    <div className="mb-3">
                                        <h3 className="text-lg font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
                                            {product.title}
                                        </h3>
                                        <p className="text-sm text-green-600 mt-1 line-clamp-2">
                                            {product.info}
                                        </p>
                                    </div>

                                    <div className="flex justify-center items-center gap-4 my-4 flex-grow">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="max-h-40 object-contain group-hover:scale-105 transition-transform"
                                        />
                                        <div className='bg-blue-50 rounded-xl p-3 flex justify-center items-center group-hover:bg-blue-100 transition-colors'>
                                            <div className='flex flex-col items-center'>
                                                <p className="text-xl font-bold text-green-600 group-hover:text-green-700">
                                                    {product.price}
                                                </p>
                                                <span className='text-xs text-gray-500'>per pill</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={() => navigate('/view')} className="mt-auto cursor-pointe bg-white text-green-600 border border-green-600 rounded-full px-6 py-2 hover:bg-green-600 hover:text-white transition-colors hover:shadow-md transform hover:-translate-y-1">
                                        BUY NOW
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default EdProduct;