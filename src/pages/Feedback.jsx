import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { API_ENDPOINTS } from '../config/api';

const Feedback = () => {
  const { t } = useLanguage();
  const [monuments, setMonuments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    monument_id: '',
    rating: 5,
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMonuments();
  }, []);

  const fetchMonuments = async () => {
    try {
      // Fetch from Laravel API
      const response = await fetch(API_ENDPOINTS.monuments);
      const result = await response.json();

      // Laravel returns paginated data with 'data' property
      const apiData = result.data || result;

      // Transform to simple list
      const monumentList = apiData.map(m => ({
        id: m.id,
        title: m.title || 'Untitled Monument'
      }));

      console.log('Fetched monuments for dropdown:', monumentList);
      setMonuments(monumentList);
    } catch (error) {
      console.error('Error fetching monuments:', error);
      // Fallback to mock data
      setMonuments([
        { id: 1, title: 'Taj Mahal' },
        { id: 2, title: 'Great Wall of China' },
        { id: 3, title: 'Colosseum' },
      ]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send to Laravel API
      const response = await fetch(API_ENDPOINTS.feedback, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);

        setTimeout(() => {
          setSubmitted(false);
          setFormData({
            name: '',
            email: '',
            monument_id: '',
            rating: 5,
            message: '',
          });
        }, 3000);
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const ratingLabels = {
    5: t.feedback.ratings.excellent,
    4: t.feedback.ratings.veryGood,
    3: t.feedback.ratings.good,
    2: t.feedback.ratings.fair,
    1: t.feedback.ratings.poor,
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.feedback.title}</h1>
          <p className="text-xl text-primary-100">
            {t.feedback.subtitle}
          </p>
        </div>
      </section>

      {/* Feedback Form */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-2xl p-8 md:p-12">
            {submitted && (
              <div className="mb-8 p-6 bg-green-50 border-2 border-green-200 rounded-xl">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-green-800 font-bold text-lg">{t.feedback.successTitle}</p>
                    <p className="text-green-700">{t.feedback.successMessage}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                  {t.feedback.yourName}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder={t.feedback.namePlaceholder}
                />
              </div>

              {/* Email */}
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                  {t.feedback.yourEmail}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder={t.feedback.emailPlaceholder}
                />
              </div>

              {/* Monument Selection */}
              <div className="mb-6">
                <label htmlFor="monument_id" className="block text-gray-700 font-semibold mb-2">
                  {t.feedback.selectMonument}
                </label>
                <select
                  id="monument_id"
                  name="monument_id"
                  value={formData.monument_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                >
                  <option value="">{t.feedback.chooseMonument}</option>
                  {monuments.map((monument) => (
                    <option key={monument.id} value={monument.id}>
                      {monument.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-3">
                  {t.feedback.rating}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className={`text-4xl transition-all ${
                        star <= formData.rating
                          ? 'text-yellow-500 scale-110'
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-3 text-gray-600 font-medium">
                    {ratingLabels[formData.rating]}
                  </span>
                </div>
              </div>

              {/* Message */}
              <div className="mb-8">
                <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
                  {t.feedback.yourMessage}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                  placeholder={t.feedback.messagePlaceholder}
                ></textarea>
                <p className="mt-2 text-sm text-gray-500">
                  {formData.message.length} / 1000 characters
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 transform hover:scale-105 shadow-lg'
                } text-white`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.feedback.submitting}
                  </span>
                ) : (
                  t.feedback.submit
                )}
              </button>
            </form>
          </div>

          {/* Info Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Secure</h3>
              <p className="text-sm text-gray-600">Your information is safe with us</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Fast</h3>
              <p className="text-sm text-gray-600">Quick and easy submission</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Valued</h3>
              <p className="text-sm text-gray-600">We read every feedback</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Feedback;

