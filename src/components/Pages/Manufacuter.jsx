import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from '../../AuthContext/AxiosInstance';
import { useNavigate } from 'react-router-dom';

function Manufacturer() {

  const topRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [])

  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllManufacturers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/product/manufacturer/get/productManufacturer?status=y`);
      setManufacturers(response.data.data);
    } catch (error) {
      console.error('Error fetching manufacturers:', error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    getAllManufacturers();
  }, [])

  return (
    <div ref={topRef} className='w-full max-w-7xl mx-auto px-4 py-8'>
      <h2 className='text-2xl font-bold text-center mb-8'>Our Manufacturing Partners</h2>
      {loading ? (
        <div className="w-full flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600"></div>
          <p className="text-gray-500 text-sm mt-4">Loading Manufacture...</p>
        </div>
      ) :
        (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
            {manufacturers.map((manufacture) => (
              <div
                key={manufacture.id}
                onClick={() => {
                  navigate('/CatProduct', { state: { manufacture } });
                }}
                className='bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer'
              >
                <div className='p-4 flex flex-col items-center'>
                  <div className='h-32 w-32 flex items-center justify-center'>
                    <img
                      src={manufacture.imageUrl}
                      alt={manufacture.name}
                      className='max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105'
                    />
                  </div>
                  <h3 className='mt-4 text-center font-medium text-gray-700'>{manufacture.name}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

export default Manufacturer;