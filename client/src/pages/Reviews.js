import React, { useState, useEffect } from 'react';
import { FaStar, FaUser, FaMapMarkerAlt, FaQuoteLeft } from 'react-icons/fa';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('all'); // all, 5, 4, 3, 2, 1
  const [loading, setLoading] = useState(true);

  // Mock data - will be replaced with API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReviews([
        {
          id: 1,
          farmerName: "Ramesh Kumar",
          village: "Village Rampur",
          rating: 5,
          date: "2024-01-15",
          review: "Excellent service and quality equipment. I bought a tractor on EMI and the process was very smooth. The owner personally explained all the features and maintenance tips. Highly recommended for all farmers!",
          equipment: "Mahindra 575 DI Tractor",
          verified: true
        },
        {
          id: 2,
          farmerName: "Suresh Patel",
          village: "Village Khandwa",
          rating: 5,
          date: "2024-01-10",
          review: "My family has been buying from this shop for three generations. The trust and quality have never changed. They understand farmers' needs and provide honest advice. The after-sales service is exceptional.",
          equipment: "Rotavator",
          verified: true
        },
        {
          id: 3,
          farmerName: "Vijay Singh",
          village: "Village Madhoganj",
          rating: 5,
          date: "2024-01-05",
          review: "Professional service backed by mechanical engineering expertise. They don't just sell equipment, they educate you about proper usage and maintenance. The EMI options made it affordable for me.",
          equipment: "Seed Drill Machine",
          verified: true
        },
        {
          id: 4,
          farmerName: "Prakash Yadav",
          village: "Village Sehore",
          rating: 4,
          date: "2023-12-28",
          review: "Good quality products and fair pricing. The delivery was on time and installation support was provided. Would have given 5 stars if they had more variety in smaller equipment.",
          equipment: "Water Pump",
          verified: true
        },
        {
          id: 5,
          farmerName: "Mohan Sharma",
          village: "Village Dewas",
          rating: 5,
          date: "2023-12-20",
          review: "Best agriculture equipment shop in the region. The owner's knowledge about machinery is impressive. They helped me choose the right equipment for my farm size and crop type. Very satisfied!",
          equipment: "Cultivator",
          verified: true
        },
        {
          id: 6,
          farmerName: "Rajesh Verma",
          village: "Village Indore",
          rating: 5,
          date: "2023-12-15",
          review: "Trustworthy and reliable. They stand behind their products and provide excellent warranty support. The finance options are farmer-friendly with reasonable interest rates.",
          equipment: "Sprayer Machine",
          verified: true
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(review => review.rating === parseInt(filter));

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 
      ? ((reviews.filter(r => r.rating === rating).length / reviews.length) * 100).toFixed(0)
      : 0
  }));

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar 
        key={index} 
        className={index < rating ? 'star-filled' : 'star-empty'} 
      />
    ));
  };

  if (loading) {
    return (
      <div className="reviews-page">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-page">
      <div className="container">
        {/* Header */}
        <div className="reviews-header">
          <h1 className="reviews-title">Customer Reviews & Testimonials</h1>
          <p className="reviews-subtitle">
            Real experiences from real farmers in our community
          </p>
        </div>

        {/* Rating Overview */}
        <div className="rating-overview">
          <div className="rating-summary">
            <div className="average-rating">
              <span className="rating-number">{averageRating}</span>
              <div className="rating-stars">
                {renderStars(Math.round(averageRating))}
              </div>
              <p className="rating-text">Based on {reviews.length} reviews</p>
            </div>
          </div>

          <div className="rating-distribution">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="rating-bar-container">
                <span className="rating-label">{rating} ⭐</span>
                <div className="rating-bar">
                  <div 
                    className="rating-bar-fill" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="rating-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="reviews-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Reviews ({reviews.length})
          </button>
          {[5, 4, 3, 2, 1].map(rating => {
            const count = reviews.filter(r => r.rating === rating).length;
            return count > 0 ? (
              <button 
                key={rating}
                className={`filter-btn ${filter === rating.toString() ? 'active' : ''}`}
                onClick={() => setFilter(rating.toString())}
              >
                {rating} ⭐ ({count})
              </button>
            ) : null;
          })}
        </div>

        {/* Reviews List */}
        <div className="reviews-list">
          {filteredReviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    <FaUser />
                  </div>
                  <div className="reviewer-details">
                    <h3 className="reviewer-name">
                      {review.farmerName}
                      {review.verified && (
                        <span className="verified-badge" title="Verified Purchase">✓</span>
                      )}
                    </h3>
                    <p className="reviewer-location">
                      <FaMapMarkerAlt /> {review.village}
                    </p>
                  </div>
                </div>
                <div className="review-meta">
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                  <p className="review-date">
                    {new Date(review.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="review-body">
                <FaQuoteLeft className="quote-icon" />
                <p className="review-text">{review.review}</p>
                {review.equipment && (
                  <div className="review-equipment">
                    <span className="equipment-label">Equipment Purchased:</span>
                    <span className="equipment-name">{review.equipment}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="no-reviews">
            <p>No reviews found for the selected filter.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="reviews-cta">
          <h2>Share Your Experience</h2>
          <p>Have you purchased equipment from us? We'd love to hear about your experience!</p>
          <button className="btn btn-primary btn-lg">Write a Review</button>
        </div>
      </div>
    </div>
  );
};

export default Reviews;

// Made with Bob
