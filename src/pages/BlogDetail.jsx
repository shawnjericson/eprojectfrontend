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
  }, [id, globalLanguage]); // Re-fetch when global language changes

  const fetchPost = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.posts}/${id}?locale=${globalLanguage}`);
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
      // Always include English as an option for better UX
      if (!langs.includes('en')) {
        langs.push('en');
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



    // If requesting Vietnamese content
    if (language === 'vi') {
      // First try to find Vietnamese translation
      const viTranslation = post.translations?.find(t => t.language === 'vi');
      if (viTranslation && viTranslation[field]) {
        return viTranslation[field];
      }
      return post[field] || '';
    }

    // If requesting English content
    if (language === 'en') {
      // First try to find English translation
      const enTranslation = post.translations?.find(t => t.language === 'en');
      if (enTranslation && enTranslation[field]) {
        return enTranslation[field];
      }
      return post[field] || '';
    }

    // Default fallback
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

      {/* Translation Warning */}
      {!post.has_translation && globalLanguage !== 'vi' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>{globalLanguage === 'vi' ? 'Thông báo:' : 'Notice:'}</strong> {globalLanguage === 'vi' 
                    ? 'Nội dung này chưa có bản dịch tiếng Việt. Đang hiển thị nội dung gốc.'
                    : 'This content is not available in your selected language. Showing original content.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Language Switcher - Always show for better UX */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              {language === 'vi' ? 'Ngôn ngữ bài viết' : 'Article Language'}
            </div>

            <div className="bg-white rounded-lg shadow-md p-1 flex gap-1">
              <button
                onClick={() => setLanguage('vi')}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center gap-2 ${
                  language === 'vi'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">🇻🇳</span>
                <span>Tiếng Việt</span>
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center gap-2 ${
                  language === 'en'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">🇬🇧</span>
                <span>English</span>
              </button>
            </div>
          </div>

          {/* Language availability notice */}
          {!availableLanguages.includes(language) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-yellow-800 text-sm">
                  {language === 'vi'
                    ? 'Bài viết này chưa có bản dịch tiếng Việt. Hiển thị nội dung gốc.'
                    : 'This article is not available in English. Showing original content.'
                  }
                </p>
              </div>
            </div>
          )}

          {/* Description (if exists) */}
          {getLocalizedContent('description') && (
            <div key={`desc-${language}`} className="bg-primary-50 border-l-4 border-primary-600 p-6 mb-8 rounded-r-lg">
              <p className="text-lg text-gray-700 italic">
                {getLocalizedContent('description')}
              </p>
            </div>
          )}



          {/* Main Content */}
          <div
            key={language} // Force re-render when language changes for smooth transition
            className="prose prose-lg max-w-none transition-all duration-300 ease-in-out
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

