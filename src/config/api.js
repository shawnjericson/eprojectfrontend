// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
  gallery: `${API_BASE_URL}/api/gallery`,
  galleryCategories: `${API_BASE_URL}/api/gallery/categories`,
  monuments: `${API_BASE_URL}/api/monuments`,
  posts: `${API_BASE_URL}/api/posts`,
  contact: `${API_BASE_URL}/api/contact`,
  feedback: `${API_BASE_URL}/api/feedback`,
  visitorTrack: `${API_BASE_URL}/api/visitor/track`,
  visitorCount: `${API_BASE_URL}/api/visitor/count`,
  visitorStats: `${API_BASE_URL}/api/visitor/stats`,
};

export default API_BASE_URL;

