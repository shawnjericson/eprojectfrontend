import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { API_ENDPOINTS } from '../../config/api';
// import NotificationBell from '../NotificationBell';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Track visitor via API (IP-based tracking)
    const trackVisitor = async () => {
      try {
        console.log('🔄 Tracking visitor...');
        const response = await fetch(API_ENDPOINTS.visitorTrack, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        console.log('📊 Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Visitor tracking successful:', data);
          setVisitorCount(data.visitor_count);

          // Optional: Show a welcome message for new visitors
          if (data.is_new_visitor) {
            console.log('🎉 Welcome, new visitor!');
          }
        } else {
          console.error('❌ Tracking failed with status:', response.status);
          const errorText = await response.text();
          console.error('❌ Error response:', errorText);
          
          // Fallback: fetch current count if tracking fails
          const countResponse = await fetch(API_ENDPOINTS.visitorCount);
          if (countResponse.ok) {
            const countData = await countResponse.json();
            console.log('📊 Fallback count:', countData);
            setVisitorCount(countData.visitor_count);
          }
        }
      } catch (error) {
        console.error('❌ Error tracking visitor:', error);
        // Fallback to localStorage if API fails
        const count = localStorage.getItem('visitorCount') || 0;
        const newCount = parseInt(count) + 1;
        localStorage.setItem('visitorCount', newCount);
        setVisitorCount(newCount);
      }
    };

    trackVisitor();
  }, []);

  const navLinks = [
    { path: '/', label: t.nav.home, icon: '' },
    { path: '/monuments', label: t.nav.monuments, icon: '' },
    { path: '/blog', label: t.nav.blog, icon: '' },
    { path: '/gallery', label: t.nav.gallery, icon: '' },
    { path: '/contact', label: t.nav.contact, icon: '' },
    { path: '/feedback', label: t.nav.feedback, icon: '' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg'
          : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-24 h-24
             rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <img
                src="/favicon_io/android-chrome-192x192.png"
                alt="Global Heritage Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">Global Heritage</h1>
              <p className="text-xs text-gray-600">Preserving World History</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  isActive(link.path)
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
                }`}
              >
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
            title={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
          >
            <span className="text-xl">{language === 'vi' ? '🇻🇳' : '🇬🇧'}</span>
            <span className="text-sm font-medium text-gray-700">
              {language === 'vi' ? 'VI' : 'EN'}
            </span>
          </button>

          {/* Notification Bell */}
          {/* <div className="flex items-center">
            <NotificationBell />
          </div> */}

          {/* Visitor Counter */}
          <div className="hidden lg:flex items-center space-x-2 bg-primary-50 px-4 py-2 rounded-lg">
            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <div className="text-sm">
              <span className="text-gray-600">Visitors:</span>
              <span className="ml-1 font-bold text-primary-700">{visitorCount.toLocaleString()}</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? 'max-h-96 opacity-100 pb-4'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="space-y-2 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-primary-50'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}

            {/* Mobile Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-300 flex items-center justify-between"
            >
              <span className="text-sm font-medium text-gray-700">
                {language === 'vi' ? 'Ngôn ngữ / Language' : 'Language / Ngôn ngữ'}
              </span>
              <span className="flex items-center gap-2">
                <span className="text-xl">{language === 'vi' ? '🇻🇳' : '🇬🇧'}</span>
                <span className="text-sm font-bold text-gray-700">
                  {language === 'vi' ? 'VI' : 'EN'}
                </span>
              </span>
            </button>

        {/* Mobile Notifications */}
        {/* <div className="px-4 py-3 bg-gray-50 rounded-lg">
          <NotificationBell />
        </div> */}

            <div className="px-4 py-3 bg-primary-50 rounded-lg flex items-center justify-between">
              <span className="text-sm text-gray-600">Visitors:</span>
              <span className="text-sm font-bold text-primary-700">{visitorCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

