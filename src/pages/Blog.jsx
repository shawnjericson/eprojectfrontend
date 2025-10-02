import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { API_ENDPOINTS } from '../config/api';

const Blog = () => {
  const { language, t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.posts}?per_page=100`);
      const result = await response.json();
      const apiData = result.data || result;
      
      console.log('📝 Posts API response:', apiData);
      
      setPosts(apiData);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching posts:', error);
      setLoading(false);
    }
  };

  const getLocalizedContent = (post, field) => {
    if (language === 'vi') return post[field];
    
    const translation = post.translations?.find(t => t.language === language);
    if (translation && translation[field]) {
      return translation[field];
    }
    
    return post[field] || '';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t.blog.title}
          </h1>
          <p className="text-xl text-primary-100">
            {t.blog.subtitle}
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">{t.common.loading}</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* Post Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
                      alt={getLocalizedContent(post, 'title')}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-primary-700">
                      {formatDate(post.published_at || post.created_at)}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {getLocalizedContent(post, 'title')}
                    </h2>
                    
                    {/* Description or Content Preview */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {getLocalizedContent(post, 'description') || 
                       stripHtml(getLocalizedContent(post, 'content')).substring(0, 150) + '...'}
                    </p>

                    {/* Read More */}
                    <div className="flex items-center text-primary-600 font-semibold group-hover:translate-x-2 transition-transform">
                      {t.common.readMore}
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t.blog.noPosts}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;

