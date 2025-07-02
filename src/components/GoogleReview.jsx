import React, { useState, useEffect } from 'react';

const GoogleReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Replace with your actual API key and place ID
        const apiKey = 'YOUR_GOOGLE_API_KEY';
        const placeId = 'YOUR_GOOGLE_PLACE_ID';
        
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=review&key=${apiKey}`
        );
        
        const data = await response.json();
        setReviews(data.result.reviews || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return <div>Loading reviews...</div>;
  if (!reviews.length) return <div>No reviews found</div>;

  return (
    <div className="google-reviews">
      <h2>Customer Reviews</h2>
      <div className="reviews-container">
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <div className="review-header">
              <img 
                src={review.profile_photo_url || 'default-avatar.png'} 
                alt={review.author_name} 
                className="review-avatar"
              />
              <h3>{review.author_name}</h3>
              <div className="review-rating">
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </div>
            </div>
            <p className="review-text">{review.text}</p>
            <p className="review-time">{new Date(review.time * 1000).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoogleReviews;