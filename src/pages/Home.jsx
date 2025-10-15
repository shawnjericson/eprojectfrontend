import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { API_ENDPOINTS } from '../config/api';
import { createMonumentUrl } from '../utils/slug';

const Home = () => {
  const { t, language } = useLanguage();
  const [monuments, setMonuments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch monuments for carousel
  useEffect(() => {
    const fetchMonuments = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.monuments}?per_page=5&locale=${language}`);
        const result = await response.json();
        const apiData = result.data || result;
        setMonuments(apiData.slice(0, 5)); // Get first 5 monuments for carousel
      } catch (error) {
        console.error('Error fetching monuments:', error);
      }
    };

    fetchMonuments();
  }, [language]); // Re-fetch when language changes

  // Fetch approved reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.feedback}?per_page=100`);
        const result = await response.json();

        console.log('📝 Feedback API response:', result);

        // Handle paginated response
        const feedbackData = result.data || result;

        // Filter reviews with rating (monument reviews)
        const reviewsWithRating = Array.isArray(feedbackData)
          ? feedbackData.filter(f => f.rating && f.rating > 0)
          : [];

        console.log('⭐ Reviews with rating:', reviewsWithRating);

        setReviews(reviewsWithRating.slice(0, 6)); // Get first 6 reviews
        setLoading(false);
      } catch (error) {
        console.error('❌ Error fetching reviews:', error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (monuments.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % monuments.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [monuments.length]);

  const features = [
    {
      title: t.home.features.exploreMonuments.title,
      description: t.home.features.exploreMonuments.description,
      link: '/monuments',
      icon: '',
    },
    {
      title: t.home.features.visualGallery.title,
      description: t.home.features.visualGallery.description,
      link: '/gallery',
      icon: '',
    },
    {
      title: t.home.features.worldWonders.title,
      description: t.home.features.worldWonders.description,
      link: '/monuments#wonders',
      icon: '',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Carousel Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Carousel Images */}
        {monuments.length > 0 ? (
          monuments.map((monument, index) => (
            <div
              key={monument.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={monument.image || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071'}
                alt={monument.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
            </div>
          ))
        ) : (
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071"
              alt="Historical Monument"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            {t.home.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto animate-fade-in-delay">
            {t.home.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
            <Link
              to="/monuments"
              className="px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              {t.home.hero.cta}
            </Link>
            <Link
              to="/gallery"
              className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              {t.home.hero.viewGallery}
            </Link>
          </div>
        </div>

        {/* Carousel Indicators */}
        {monuments.length > 0 && (
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {monuments.map((monument, index) => (
              <div key={index} className="flex flex-col items-center">
                <button
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-white w-8'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
                {!monument.has_translation && language !== 'vi' && (
                  <span className="text-xs text-yellow-300 mt-1" title="This content is not available in your selected language">
                    ⚠️
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.home.features.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t.home.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="p-8">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-primary-600 font-semibold group-hover:translate-x-2 transition-transform">
                    {t.home.features.learnMore}
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.home.reviews.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t.home.reviews.subtitle}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {review.rating}/5
                    </span>
                  </div>

                  {/* Monument Link (if review is for a monument) */}
                  {review.monument && (
                    <div className="mb-3">
                      <Link
                        to={createMonumentUrl(review.monument.id, review.monument.title)}
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {review.monument.title}
                      </Link>
                    </div>
                  )}

                  {/* Review Message */}
                  <p className="text-gray-700 mb-4 line-clamp-4">
                    "{review.message}"
                  </p>

                  {/* Reviewer Info */}
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-semibold text-lg">
                        {review.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{review.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t.home.reviews.noReviews}</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t.home.cta.title}
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            {t.home.cta.subtitle}
          </p>
          <Link
            to="/feedback"
            className="inline-block px-8 py-4 bg-white text-primary-700 rounded-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            {t.home.cta.button}
          </Link>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }

        .animate-fade-in-delay {
          animation: fadeIn 1s ease-out 0.3s both;
        }

        .animate-fade-in-delay-2 {
          animation: fadeIn 1s ease-out 0.6s both;
        }
      `}</style>
    </div>
  );
};

export default Home;

