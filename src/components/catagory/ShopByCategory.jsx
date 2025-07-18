import React, { useRef, useState, useEffect } from 'react';
import { MdChevronRight, MdChevronLeft } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext/AuthContext';

function ShopByCategory() {
  const { category, setCatId, loading, searchItem } = useAuth();
  const [showAll, setShowAll] = useState(false);
  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  const slideLeft = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.querySelector('.category-card').offsetWidth + 16; // Including margin
      sliderRef.current.scrollBy({
        left: -cardWidth, // Scroll one card
        behavior: 'smooth',
      });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.querySelector('.category-card').offsetWidth + 16; // Including margin
      sliderRef.current.scrollBy({
        left: cardWidth, // Scroll one card
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftArrow(scrollLeft >= 6);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const filtereCategory = category.filter(cat => cat.categoryName.toLowerCase().includes(searchItem.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Product Categories */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          Shop by Category
        </h2>
        {!loading && category?.length > 0 && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base transition-colors cursor-pointer"
          >
            See All
          </button>
        )}
      </div>

      {loading ? (
        <div className="w-full flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600"></div>
          <p className="text-gray-500 text-sm mt-4">Loading products...</p>
        </div>
      ) : !filtereCategory || filtereCategory.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-12">
          <p className="text-gray-500 text-sm mt-4">Data not found</p>
        </div>
      ) : showAll ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtereCategory.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setCatId(item.productCategoryId);
                navigate('/CatProduct');
              }}
              className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-100 category-card"
            >
              <img
                src={item.imageUrl}
                alt={item.categoryName}
                className="w-20 h-20 object-contain mb-3"
              />
              <span className="text-xs md:text-sm text-center font-medium text-gray-700 line-clamp-2">
                {item.categoryName}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative">
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="overflow-x-hidden scroll-smooth flex gap-4 px-2"
            style={{ scrollSnapType: 'x mandatory', maxWidth: '100%' }}
          >
            {filtereCategory.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setCatId(item.productCategoryId);
                  navigate('/CatProduct');
                }}
                className="bg-white rounded-lg shadow-sm p-4 w-[160px] flex-shrink-0 flex flex-col items-center cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-100 category-card"
                style={{ scrollSnapAlign: 'start' }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.categoryName}
                  className="w-20 h-20 object-contain mb-3"
                />
                <span className="text-xs text-center font-medium text-gray-700 line-clamp-2">
                  {item.categoryName}
                </span>
              </div>
            ))}
          </div>

          {showLeftArrow && (
            <button
              onClick={slideLeft}
              className="absolute -left-10 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all hover:scale-105 z-10"
              aria-label="Scroll left"
            >
              <MdChevronLeft className="text-gray-600 text-2xl cursor-pointer" />
            </button>
          )}
          {showRightArrow && (
            <button
              onClick={slideRight}
              className="absolute -right-10 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all hover:scale-105 z-10"
              aria-label="Scroll right"
            >
              <MdChevronRight className="text-gray-600 text-2xl cursor-pointer" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ShopByCategory;