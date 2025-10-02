import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { API_ENDPOINTS } from '../config/api';

const BlogDetail = () => {
  const { id } = useParams();
  const { language: globalLanguage, t } = useLanguage();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('vi'); // Local language for post content
  const [availableLanguages, setAvailableLanguages] = useState(['vi']);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.posts}/${id}`);
      const data = await response.json();

      console.log('📝 Post detail:', data);

      setPost(data);

      // Determine available languages
      const langs = ['vi']; // Vietnamese is always available (base language)
      if (data.translations && data.translations.length > 0) {
        data.translations.forEach(trans => {
          if (!langs.includes(trans.language)) {
            langs.push(trans.language);
          }
        });
      }
      setAvailableLanguages(langs);

      // Set initial language based on global language if available
      if (langs.includes(globalLanguage)) {
        setLanguage(globalLanguage);
      }

      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching post:', error);
      setLoading(false);
    }
  };

  const getLocalizedContent = (field) => {
    if (!post) return '';
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

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.blog.notFound}</h1>
          <Link
            to="/blog"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {t.blog.backToBlog}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={post.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200'}
          alt={getLocalizedContent('title')}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center text-white mb-4 hover:text-primary-300 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t.blog.backToBlog}
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {getLocalizedContent('title')}
            </h1>
            <div className="flex items-center text-white/90">
              <span className="mr-4">
                📅 {formatDate(post.published_at || post.created_at)}
              </span>
              {post.creator && (
                <span>
                  ✍️ {post.creator.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {/* Description (if exists) */}
          {getLocalizedContent('description') && (
            <div className="bg-primary-50 border-l-4 border-primary-600 p-6 mb-8 rounded-r-lg">
              <p className="text-lg text-gray-700 italic">
                {getLocalizedContent('description')}
              </p>
            </div>
          )}

          {/* Main Content */}
          <div 
            className="prose prose-lg max-w-none
              prose-headings:text-gray-900 prose-headings:font-bold
              prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-lg prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
              prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
              prose-li:text-gray-700 prose-li:mb-2
              prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8
              prose-blockquote:border-l-4 prose-blockquote:border-primary-600 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700"
            dangerouslySetInnerHTML={{ __html: getLocalizedContent('content') }}
          />

          {/* Back to Blog Button */}
          <div className="mt-12 pt-8 border-t">
            <Link
              to="/blog"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t.blog.backToBlog}
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;

