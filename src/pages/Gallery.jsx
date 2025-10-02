import React, { useState, useEffect, useCallback, useRef } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { useLanguage } from '../contexts/LanguageContext';
import { API_ENDPOINTS } from '../config/api';

// Progressive Image Component with Blur Placeholder
const ProgressiveImage = ({ image, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={imgRef}
      className="group relative bg-gray-200 rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300"
      onClick={onClick}
    >
      <div className="aspect-w-4 aspect-h-3 relative overflow-hidden">
        {/* Blur Placeholder */}
        {image.blurHash && !isLoaded && isInView && (
          <img
            src={image.blurHash}
            alt=""
            className="absolute inset-0 w-full h-64 object-cover blur-xl scale-110"
            aria-hidden="true"
          />
        )}

        {/* Main Image */}
        {isInView && (
          <img
            src={image.thumbnail}
            alt={image.title}
            loading="lazy"
            className={`w-full h-64 object-cover group-hover:scale-110 transition-all duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsLoaded(true)}
          />
        )}

        {/* Loading Spinner */}
        {!isLoaded && isInView && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-lg font-bold mb-1">{image.title}</h3>
            <p className="text-sm text-gray-200 line-clamp-2">{image.description}</p>
          </div>
        </div>

        {/* View Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View
        </div>
      </div>
    </div>
  );
};

const Gallery = () => {
  const { t } = useLanguage();
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const observerTarget = useRef(null);
  const isLoadingRef = useRef(false);

  const fetchGalleryImages = useCallback(async (page = 1, category = 'all') => {
    // Prevent duplicate requests
    if (isLoadingRef.current) {
      console.log('⏸️ Already loading, skipping request...');
      return;
    }

    try {
      isLoadingRef.current = true;

      const isFirstPage = page === 1;
      if (isFirstPage) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // Build URL with pagination and category filter
      const url = new URL(API_ENDPOINTS.gallery);
      url.searchParams.append('page', page);
      url.searchParams.append('per_page', 24);
      if (category && category !== 'all') {
        url.searchParams.append('category', category);
      }

      console.log(`🌐 Fetching: ${url.toString()}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Laravel paginated response
      const apiData = result.data || [];
      const hasMoreData = result.current_page < result.last_page;

      console.log(`📸 API Response - Page ${page}:`, {
        total: result.total,
        per_page: result.per_page,
        current_page: result.current_page,
        last_page: result.last_page,
        data_count: apiData.length,
        hasMoreData
      });

      // Stop if no data or already past last page
      if (apiData.length === 0 || result.current_page > result.last_page) {
        console.log('🛑 No more data or past last page, stopping...');
        setHasMore(false);
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      // Transform API data
      const transformedImages = apiData.map(item => ({
        id: item.id,
        src: item.image_url || item.image_path,
        thumbnail: item.thumbnail_url || item.image_url || item.image_path,
        blurHash: item.blur_hash,
        title: item.title || 'Untitled',
        category: item.category || item.monument?.zone || 'General',
        description: item.description || 'No description available',
      }));

      console.log(`✅ Transformed ${transformedImages.length} images for page ${page}`);

      if (isFirstPage) {
        setImages(transformedImages);
        console.log(`🎯 Set initial images: ${transformedImages.length}`);
      } else {
        setImages(prev => {
          // Check for duplicates before adding
          const existingIds = new Set(prev.map(img => img.id));
          const newUniqueImages = transformedImages.filter(img => !existingIds.has(img.id));

          if (newUniqueImages.length === 0) {
            console.log('⚠️ All images are duplicates, skipping...');
            return prev;
          }

          const newImages = [...prev, ...newUniqueImages];
          console.log(`➕ Added ${newUniqueImages.length} unique images (${transformedImages.length - newUniqueImages.length} duplicates filtered). Total now: ${newImages.length}`);
          return newImages;
        });
      }

      console.log(`🏁 Setting hasMore to: ${hasMoreData} (current_page: ${result.current_page}, last_page: ${result.last_page})`);
      setHasMore(hasMoreData);
      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      console.error('❌ Error fetching gallery:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        page,
        category
      });
      setLoading(false);
      setLoadingMore(false);
      setHasMore(false);

      // Show user-friendly error
      if (page === 1) {
        alert(`Failed to load gallery images. Please check:\n1. Laravel server is running (php artisan serve)\n2. CORS is enabled\n3. API endpoint is accessible\n\nError: ${error.message}`);
      }
    } finally {
      isLoadingRef.current = false;
    }
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Load more function
  const loadMore = useCallback(() => {
    console.log('🔄 loadMore triggered:', { currentPage, loadingMore, hasMore, isLoading: isLoadingRef.current });

    // Prevent multiple simultaneous requests
    if (isLoadingRef.current) {
      console.log('⏸️ Already loading, ignoring trigger');
      return;
    }

    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      console.log(`⏭️ Loading page ${nextPage}...`);
      setCurrentPage(nextPage);
      fetchGalleryImages(nextPage, selectedCategory);
    } else {
      console.log('⏸️ loadMore blocked:', { loadingMore, hasMore });
    }
  }, [currentPage, loadingMore, hasMore, selectedCategory, fetchGalleryImages]);

  // Fetch images when category changes
  useEffect(() => {
    console.log(`🔄 Category changed to: ${selectedCategory}, resetting...`);
    isLoadingRef.current = false; // Reset loading flag
    setImages([]);
    setCurrentPage(1);
    setHasMore(true);
    setLoading(true);
    setLoadingMore(false);
    fetchGalleryImages(1, selectedCategory);
  }, [selectedCategory, fetchGalleryImages]);

  // Infinite scroll observer
  useEffect(() => {
    console.log('👀 Setting up IntersectionObserver:', {
      hasMore,
      loadingMore,
      observerTargetExists: !!observerTarget.current,
      imagesCount: images.length
    });

    if (!hasMore) {
      console.log('⏸️ Skipping observer setup - no more data');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        console.log('🔍 Observer triggered:', {
          isIntersecting: entries[0].isIntersecting,
          hasMore,
          loadingMore,
          currentPage
        });
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          console.log('✅ Conditions met, calling loadMore()');
          loadMore();
        } else {
          console.log('⏸️ Conditions not met:', {
            isIntersecting: entries[0].isIntersecting,
            hasMore,
            loadingMore
          });
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    // Wait for DOM to be ready
    const setupObserver = () => {
      const currentTarget = observerTarget.current;
      if (currentTarget) {
        console.log('✅ Observer target found, observing...', currentTarget);
        observer.observe(currentTarget);
      } else {
        console.log('❌ Observer target not found, retrying...');
        setTimeout(setupObserver, 100);
      }
    };

    setupObserver();

    return () => {
      const currentTarget = observerTarget.current;
      if (currentTarget) {
        console.log('🧹 Cleaning up observer');
        observer.unobserve(currentTarget);
      }
      observer.disconnect();
    };
  }, [hasMore, loadingMore, loadMore, images.length, currentPage]);

  const fetchCategories = async () => {
    try {
      console.log(`🌐 Fetching categories from: ${API_ENDPOINTS.galleryCategories}`);
      const response = await fetch(API_ENDPOINTS.galleryCategories, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Categories fetched:', result.categories);
      setCategories(result.categories || ['all']);
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      setCategories(['all', 'East', 'West', 'North', 'South', 'Central']);
    }
  };

  const openLightbox = useCallback((index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const lightboxSlides = images.map(img => ({
    src: img.src,
    title: img.title,
    description: img.description,
  }));

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.gallery.title}</h1>
          <p className="text-xl text-primary-100">
            {t.gallery.subtitle}
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white shadow-sm sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? t.gallery.allCategories : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {selectedCategory === 'all' ? t.gallery.allCategories : selectedCategory}
            </h2>
            <p className="text-gray-600 mt-2">
              {images.length} {images.length === 1 ? t.gallery.imageCount.singular : t.gallery.imageCount.plural}
              {loadingMore && ' (loading more...)'}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">{t.gallery.loading}</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-lg">{t.gallery.noImages}</p>
            </div>
          ) : (
            <>
              {/* Masonry Grid with Progressive Loading */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {images.map((image, index) => (
                  <ProgressiveImage
                    key={`${image.id}-${index}`}
                    image={image}
                    onClick={() => openLightbox(index)}
                  />
                ))}
              </div>

              {/* Infinite Scroll Trigger */}
              {hasMore && (
                <div
                  ref={observerTarget}
                  className="flex justify-center items-center py-12 bg-gray-50 rounded-lg"
                  style={{ minHeight: '100px' }}
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mr-3"></div>
                      <p className="text-gray-600">Loading more images...</p>
                    </>
                  ) : (
                    <p className="text-gray-400">Scroll to load more...</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxSlides}
        index={lightboxIndex}
      />
    </div>
  );
};

export default Gallery;

