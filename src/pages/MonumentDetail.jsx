import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { API_ENDPOINTS } from '../config/api';
import { useLanguage } from '../contexts/LanguageContext.jsx';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MonumentDetail = () => {
  const { id: urlParam } = useParams();
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();

  // Extract ID from URL (handles both /monuments/123 and /monuments/123-slug formats)
  const id = urlParam.includes('-') ? urlParam.split('-')[0] : urlParam;

  const [monument, setMonument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [loadingMoreReviews, setLoadingMoreReviews] = useState(false);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState(['vi']);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    rating: 5,
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    fetchMonumentDetail();
    fetchReviews(1, true); // Reset reviews when monument changes
  }, [id, language]); // Re-fetch when language changes

  const fetchMonumentDetail = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.monuments}/${id}?locale=${language}`);
      const data = await response.json();
      console.log('📍 Monument detail:', data);

      // Detect available languages from translations
      const langs = ['vi']; // Default language (base monument data)
      if (data.translations && data.translations.length > 0) {
        data.translations.forEach(trans => {
          if (!langs.includes(trans.language)) {
            langs.push(trans.language);
          }
        });
      }

      setAvailableLanguages(langs);
      console.log('🌐 Available languages:', langs);
      setMonument(data);
      setTotalReviews(data.total_feedbacks || 0);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching monument detail:', error);
      setLoading(false);
    }
  };

  const fetchReviews = async (page = 1, reset = false) => {
    try {
      if (reset) {
        setLoadingMoreReviews(true);
        setReviewsPage(1);
      } else {
        setLoadingMoreReviews(true);
      }

      const response = await fetch(`${API_ENDPOINTS.monuments}/${id}/feedbacks?page=${page}&per_page=5`);
      const data = await response.json();
      
      console.log('📝 Reviews data:', data);

      if (reset) {
        setReviews(data.data || []);
      } else {
        setReviews(prev => [...prev, ...(data.data || [])]);
      }
      
      setReviewsPage(page);
      setHasMoreReviews(data.current_page < data.last_page);
      setLoadingMoreReviews(false);
    } catch (error) {
      console.error('❌ Error fetching reviews:', error);
      setLoadingMoreReviews(false);
    }
  };

  const loadMoreReviews = () => {
    if (!loadingMoreReviews && hasMoreReviews) {
      fetchReviews(reviewsPage + 1, false);
    }
  };

  // Get content in selected language with fallback
  const getLocalizedContent = (field) => {
    if (!monument) return '';

    // Special handling for boolean/numeric fields that should preserve 0 or false values
    const booleanFields = ['is_world_wonder'];
    const isNumericField = booleanFields.includes(field);

    // If selected language is 'vi' (default), use base monument data
    if (language === 'vi') {
      const value = monument[field];
      // For boolean fields, return the actual value (0, false, 1, true)
      if (isNumericField) return value;
      // Return empty string if value is null, undefined, or 0
      return (value === null || value === undefined || value === 0) ? '' : value;
    }

    // Try to find translation for selected language
    if (monument.translations && monument.translations.length > 0) {
      const translation = monument.translations.find(t => t.language === language);
      if (translation && translation[field]) {
        const value = translation[field];
        // For boolean fields, return the actual value
        if (isNumericField) return value;
        // Return empty string if value is null, undefined, or 0
        return (value === null || value === undefined || value === 0) ? '' : value;
      }
    }

    // Fallback to base monument data (Vietnamese)
    const value = monument[field];
    // For boolean fields, return the actual value
    if (isNumericField) return value;
    // Return empty string if value is null, undefined, or 0
    return (value === null || value === undefined || value === 0) ? '' : value;
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch(API_ENDPOINTS.feedback, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monument_id: parseInt(id),
          name: reviewForm.name,
          email: reviewForm.email,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          type: 'monument_review', // Specific type for monument reviews
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage('✅ Thank you! Your review has been submitted successfully.');
        setReviewForm({ name: '', email: '', rating: 5, comment: '' });

        // Close modal after 2 seconds
        setTimeout(() => {
          setSubmitMessage('');
          setShowReviewModal(false);
          // Refresh reviews
          fetchReviews(1, true);
        }, 2000);
      } else {
        setSubmitMessage('❌ Error: ' + (data.message || 'Failed to submit review'));
      }
    } catch (error) {
      console.error('❌ Error submitting review:', error);
      setSubmitMessage('❌ Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading monument details...</p>
        </div>
      </div>
    );
  }

  if (!monument) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Monument Not Found</h2>
          <button
            onClick={() => navigate('/monuments')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Back to Monuments
          </button>
        </div>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-900">
        <img
          src={monument.image || 'https://via.placeholder.com/1200x400?text=No+Image'}
          alt={getLocalizedContent('title')}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            {monument.is_world_wonder === 1 && (
              <span className="inline-block px-4 py-2 bg-yellow-500 text-gray-900 rounded-full text-sm font-bold mb-4">
                World Wonder
              </span>
            )}
            <h1 className="text-5xl font-bold mb-4">{getLocalizedContent('title')}</h1>
            <p className="text-xl">📍 {getLocalizedContent('location') || monument.zone}</p>
          </div>
        </div>
      </div>

      {/* Translation Warning */}
      {!monument.has_translation && language !== 'vi' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>{language === 'vi' ? 'Thông báo:' : 'Notice:'}</strong> {language === 'vi' 
                    ? 'Nội dung này chưa có bản dịch tiếng Việt. Đang hiển thị nội dung gốc.'
                    : 'This content is not available in your selected language. Showing original content.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Navigation */}
      <div className="bg-white shadow-sm sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex space-x-8">
              <a
                href="#description"
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('description')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {language === 'vi' ? 'Mô tả' : 'Description'}
              </a>
              {monument.gallery?.length > 0 && (
                <a
                  href="#gallery"
                  className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {language === 'vi' ? 'Thư viện' : 'Gallery'}
                </a>
              )}
              {(monument.latitude && monument.longitude && monument.latitude !== 0 && monument.longitude !== 0) && (
                <a
                  href="#location"
                  className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {language === 'vi' ? 'Vị trí' : 'Location'}
                </a>
              )}
              <a
                href="#reviews"
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {language === 'vi' ? 'Đánh giá' : 'Reviews'}
              </a>
            </div>
            <div className="text-sm text-gray-500">
              {reviews.length > 0 && (
                <span className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  {averageRating} ({reviews.length} {language === 'vi' ? 'đánh giá' : 'reviews'})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Language Switcher */}
        {availableLanguages.length > 1 && (
          <div className="flex justify-end mb-6">
            <div className="bg-white rounded-lg shadow-md p-2 flex gap-2">
              {availableLanguages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    language === lang
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div id="description" className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {language === 'vi' ? 'Sơ lược' : 'Description'}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {getLocalizedContent('description')}
              </p>

              {/* Featured Image from Gallery */}
              {monument.gallery?.length > 0 && (
                <div className="my-8 rounded-xl overflow-hidden shadow-xl">
                  <img
                    src={monument.gallery[0].image_path}
                    alt={monument.gallery[0].title || 'Featured monument image'}
                    className="w-full h-auto object-cover"
                  />
                  {monument.gallery[0].description ? (
                    <p className="text-center text-sm text-gray-500 mt-2 italic">
                      {monument.gallery[0].description}
                    </p>
                  ) : null}
                </div>
              )}

              {getLocalizedContent('content') ? (
                <div
                  className="prose prose-lg max-w-none text-gray-700 prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-lg prose-p:leading-relaxed prose-p:mb-4 prose-strong:text-gray-900 prose-strong:font-semibold prose-ul:my-4 prose-li:my-2"
                  dangerouslySetInnerHTML={{ __html: getLocalizedContent('content') }}
                />
              ) : null}
            </div>

            {/* Gallery Section */}
            {monument.gallery?.length > 0 && (
              <div id="gallery" className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {language === 'vi' ? '📸 Thư viện ảnh' : '📸 Photo Gallery'}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {monument.gallery.map((image, index) => (
                    <div
                      key={image.id}
                      className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square"
                      onClick={() => {
                        setLightboxIndex(index);
                        setLightboxOpen(true);
                      }}
                    >
                      <img
                        src={image.image_path}
                        alt={image.title || `Gallery image ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
                {monument.gallery.length > 6 && (
                  <p className="text-center text-gray-500 mt-4 text-sm">
                    {language === 'vi'
                      ? `${monument.gallery.length} ảnh - Click để xem full size`
                      : `${monument.gallery.length} photos - Click to view full size`}
                  </p>
                )}
              </div>
            )}

            {/* Reviews Section */}
            <div id="reviews" className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Reviews</h2>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-yellow-500">{averageRating}</span>
                  <div>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < Math.round(averageRating) ? '★' : '☆'}</span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      {reviews.length} of {totalReviews} reviews
                    </p>
                  </div>
                </div>
              </div>

              {/* Review List */}
              <div className="space-y-6 mb-8">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-900">{review.name}</h4>
                        <div className="flex text-yellow-500 text-lg">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.message || review.comment}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                )}
              </div>

              {/* Load More Reviews Button */}
              {hasMoreReviews && (
                <div className="text-center mb-6">
                  <button
                    onClick={loadMoreReviews}
                    disabled={loadingMoreReviews}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMoreReviews ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700 mr-2"></div>
                        {language === 'vi' ? 'Đang tải...' : 'Loading...'}
                      </div>
                    ) : (
                      language === 'vi' ? `Xem thêm ${Math.min(5, totalReviews - reviews.length)} đánh giá` : `Load ${Math.min(5, totalReviews - reviews.length)} more reviews`
                    )}
                  </button>
                </div>
              )}

              {/* Leave a Review Button */}
              <div className="border-t pt-8">
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="w-full px-6 py-4 bg-primary-600 text-white text-lg font-bold rounded-lg hover:bg-primary-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Leave a Review
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Map */}
            {(monument.latitude && monument.longitude && monument.latitude !== 0 && monument.longitude !== 0) && (
              <div id="location" className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Location</h3>
                <div className="h-64 rounded-lg overflow-hidden relative z-0">
                  <MapContainer
                    center={[monument.latitude, monument.longitude]}
                    zoom={13}
                    style={{ height: '100%', width: '100%', zIndex: 0 }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <Marker position={[monument.latitude, monument.longitude]}>
                      <Popup>
                        <div className="font-semibold">{getLocalizedContent('title')}</div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            )}

            {/* Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {language === 'vi' ? 'Thông tin' : 'Information'}
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">
                    {language === 'vi' ? 'Khu vực' : 'Zone'}
                  </p>
                  <p className="font-semibold text-gray-900">{monument.zone}</p>
                </div>
                {getLocalizedContent('location') ? (
                  <div>
                    <p className="text-sm text-gray-600">
                      {language === 'vi' ? 'Địa điểm' : 'Location'}
                    </p>
                    <p className="font-semibold text-gray-900">{getLocalizedContent('location')}</p>
                  </div>
                ) : null}
                {monument.is_world_wonder === 1 && (
                  <div className="pt-3 border-t">
                    <span className="inline-flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-semibold">
                      🌟 {language === 'vi' ? 'Kỳ quan thế giới' : 'World Wonder'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox for Gallery */}
      {monument.gallery?.length > 0 && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={monument.gallery.map((image) => ({
            src: image.image_path,
            alt: image.title || image.description || 'Monument gallery image',
            title: image.title,
            description: image.description,
          }))}
        />
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">✍️ Leave a Review</h3>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setSubmitMessage('');
                }}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {submitMessage && (
                <div
                  className={`mb-4 p-4 rounded-lg ${
                    submitMessage.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {submitMessage}
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      required
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Email *</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      required
                      value={reviewForm.email}
                      onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className={`text-3xl transition-all ${
                          star <= reviewForm.rating
                            ? 'text-yellow-500 scale-110'
                            : 'text-gray-300 hover:text-yellow-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {reviewForm.rating === 5 && '⭐ Excellent'}
                    {reviewForm.rating === 4 && '⭐ Very Good'}
                    {reviewForm.rating === 3 && '⭐ Good'}
                    {reviewForm.rating === 2 && '⭐ Fair'}
                    {reviewForm.rating === 1 && '⭐ Poor'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Review *</label>
                  <textarea
                    placeholder="Share your experience with this monument..."
                    required
                    rows="5"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-1">{reviewForm.comment.length} characters</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewModal(false);
                      setSubmitMessage('');
                    }}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-bold"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonumentDetail;