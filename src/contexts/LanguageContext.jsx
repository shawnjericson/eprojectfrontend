import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  // Get saved language from localStorage or default to 'vi'
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'vi';
  });

  // Save to localStorage whenever language changes
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'vi' ? 'en' : 'vi');
  };

  // Translation object
  const t = {
    // Navbar
    nav: {
      home: language === 'vi' ? 'Trang chủ' : 'Home',
      monuments: language === 'vi' ? 'Di tích' : 'Monuments',
      blog: language === 'vi' ? 'Blog' : 'Blog',
      gallery: language === 'vi' ? 'Thư viện' : 'Gallery',
      contact: language === 'vi' ? 'Liên hệ' : 'Contact',
      feedback: language === 'vi' ? 'Phản hồi' : 'Feedback',
    },
    
    // Home page
    home: {
      hero: {
        title: language === 'vi'
          ? 'Khám phá Di sản Văn hóa Thế giới'
          : 'Explore World Cultural Heritage',
        subtitle: language === 'vi'
          ? 'Hành trình qua các kỳ quan kiến trúc và di tích lịch sử đáng kinh ngạc'
          : 'Journey through amazing architectural wonders and historical monuments',
        cta: language === 'vi' ? 'Khám phá ngay' : 'Explore Now',
        viewGallery: language === 'vi' ? 'Xem thư viện' : 'View Gallery',
      },
      features: {
        title: language === 'vi' ? 'Khám phá Di sản Thế giới' : 'Discover World Heritage',
        subtitle: language === 'vi'
          ? 'Khám phá bộ sưu tập toàn diện các di tích lịch sử và di sản văn hóa từ khắp nơi trên thế giới'
          : 'Explore our comprehensive collection of historical monuments and cultural sites from around the globe',
        exploreMonuments: {
          title: language === 'vi' ? 'Khám phá Di tích' : 'Explore Monuments',
          description: language === 'vi'
            ? 'Khám phá các di tích lịch sử được phân loại theo khu vực địa lý trên khắp thế giới'
            : 'Discover historical monuments categorized by geographical zones across the world',
        },
        visualGallery: {
          title: language === 'vi' ? 'Thư viện Hình ảnh' : 'Visual Gallery',
          description: language === 'vi'
            ? 'Duyệt qua những hình ảnh tuyệt đẹp của các di sản thế giới và địa danh lịch sử'
            : 'Browse through stunning images of world heritage sites and historical landmarks',
        },
        worldWonders: {
          title: language === 'vi' ? 'Kỳ quan Thế giới' : 'World Wonders',
          description: language === 'vi'
            ? 'Tìm hiểu về Bảy kỳ quan Thế giới với mô tả chi tiết và lịch sử'
            : 'Learn about the Seven Wonders of the World with detailed descriptions and history',
        },
        learnMore: language === 'vi' ? 'Tìm hiểu thêm' : 'Learn More',
      },
      reviews: {
        title: language === 'vi' ? 'Khách tham quan nói gì' : 'What Visitors Say',
        subtitle: language === 'vi'
          ? 'Trải nghiệm thực tế được chia sẻ bởi các thành viên cộng đồng'
          : 'Real experiences shared by our community members',
        noReviews: language === 'vi'
          ? 'Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!'
          : 'No reviews yet. Be the first to share your experience!',
      },
      cta: {
        title: language === 'vi' ? 'Chia sẻ Trải nghiệm của Bạn' : 'Share Your Experience',
        subtitle: language === 'vi'
          ? 'Bạn đã từng ghé thăm những địa điểm tuyệt vời này? Chúng tôi rất muốn nghe về trải nghiệm của bạn'
          : 'Have you visited any of these magnificent sites? We\'d love to hear about your experience',
        button: language === 'vi' ? 'Chia sẻ Phản hồi' : 'Share Feedback',
      },
    },

    // Monuments page
    monuments: {
      title: language === 'vi' ? 'Di tích lịch sử' : 'Historical Monuments',
      subtitle: language === 'vi' 
        ? 'Khám phá các di tích văn hóa đáng kinh ngạc trên khắp thế giới'
        : 'Discover amazing cultural monuments around the world',
      filterByZone: language === 'vi' ? 'Lọc theo khu vực' : 'Filter by Zone',
      allZones: language === 'vi' ? 'Tất cả khu vực' : 'All Zones',
      zones: {
        East: language === 'vi' ? 'Đông' : 'East',
        West: language === 'vi' ? 'Tây' : 'West',
        North: language === 'vi' ? 'Bắc' : 'North',
        South: language === 'vi' ? 'Nam' : 'South',
        Central: language === 'vi' ? 'Trung tâm' : 'Central',
      },
      worldWonders: language === 'vi' ? 'Kỳ quan thế giới' : 'World Wonders',
      worldWondersDesc: language === 'vi'
        ? 'Khám phá những di tích được đánh dấu là Kỳ quan thế giới'
        : 'Discover monuments marked as World Wonders',
      noWonders: language === 'vi'
        ? 'Chưa có Kỳ quan thế giới nào. Quay lại sau!'
        : 'No World Wonders available yet. Check back soon!',
      loading: language === 'vi' ? 'Đang tải...' : 'Loading...',
      viewOnMap: language === 'vi' ? 'Xem trên bản đồ' : 'View on Map',
    },

    // Blog page
    blog: {
      title: language === 'vi' ? 'Blog Du lịch' : 'Travel Blog',
      subtitle: language === 'vi'
        ? 'Khám phá những câu chuyện, kinh nghiệm và bí quyết du lịch'
        : 'Discover travel stories, experiences and tips',
      noPosts: language === 'vi'
        ? 'Chưa có bài viết nào. Quay lại sau!'
        : 'No posts yet. Check back soon!',
      notFound: language === 'vi' ? 'Không tìm thấy bài viết' : 'Post Not Found',
      backToBlog: language === 'vi' ? 'Quay lại Blog' : 'Back to Blog',
    },

    // Gallery page
    gallery: {
      title: language === 'vi' ? 'Thư viện ảnh' : 'Photo Gallery',
      subtitle: language === 'vi'
        ? 'Khám phá vẻ đẹp của các di tích qua ống kính'
        : 'Explore the beauty of monuments through the lens',
      filterByCategory: language === 'vi' ? 'Lọc theo danh mục' : 'Filter by Category',
      allCategories: language === 'vi' ? 'Tất cả hình ảnh' : 'All Images',
      loading: language === 'vi' ? 'Đang tải...' : 'Loading...',
      noImages: language === 'vi' ? 'Không có hình ảnh' : 'No images available',
      imageCount: {
        singular: language === 'vi' ? 'hình ảnh' : 'image found',
        plural: language === 'vi' ? 'hình ảnh' : 'images found',
      },
    },

    // Contact page
    contact: {
      title: language === 'vi' ? 'Liên hệ với chúng tôi' : 'Contact Us',
      subtitle: language === 'vi'
        ? 'Liên hệ với chúng tôi để được tư vấn và hỗ trợ'
        : 'Get in touch with us for any inquiries or information',
      getInTouch: language === 'vi' ? 'Liên hệ' : 'Get in Touch',
      address: language === 'vi' ? 'Địa chỉ' : 'Address',
      phone: language === 'vi' ? 'Điện thoại' : 'Phone',
      email: language === 'vi' ? 'Email' : 'Email',
      hours: language === 'vi' ? 'Giờ làm việc' : 'Business Hours',
      hoursValue: language === 'vi' ? 'Thứ 2 - Thứ 6: 9:00 - 18:00' : 'Mon - Fri: 9:00 AM - 6:00 PM',
      yourLocation: language === 'vi' ? 'Vị trí của bạn' : 'Your Location',
      getDirections: language === 'vi' ? 'Chỉ đường' : 'Get Directions',
      ourLocation: language === 'vi' ? 'Vị trí của chúng tôi' : 'Our Location',
      sendMessage: language === 'vi' ? 'Gửi tin nhắn' : 'Send us a Message',
      yourName: language === 'vi' ? 'Tên của bạn' : 'Your Name',
      emailAddress: language === 'vi' ? 'Địa chỉ Email' : 'Email Address',
      subject: language === 'vi' ? 'Chủ đề' : 'Subject',
      message: language === 'vi' ? 'Tin nhắn' : 'Message',
      namePlaceholder: language === 'vi' ? 'Nhập tên đầy đủ' : 'John Doe',
      emailPlaceholder: language === 'vi' ? 'email@example.com' : 'john@example.com',
      subjectPlaceholder: language === 'vi' ? 'Chúng tôi có thể giúp gì?' : 'How can we help?',
      messagePlaceholder: language === 'vi' ? 'Tin nhắn của bạn...' : 'Your message here...',
      sendButton: language === 'vi' ? 'Gửi tin nhắn' : 'Send Message',
      successMessage: language === 'vi'
        ? 'Cảm ơn! Tin nhắn của bạn đã được gửi thành công.'
        : 'Thank you! Your message has been sent successfully.',
    },

    // Feedback page
    feedback: {
      title: language === 'vi' ? 'Chia sẻ phản hồi của bạn' : 'Share Your Feedback',
      subtitle: language === 'vi'
        ? 'Chúng tôi trân trọng ý kiến của bạn. Hãy cho chúng tôi biết trải nghiệm của bạn với các di tích'
        : 'We value your opinion. Tell us about your experience with our heritage sites',
      yourName: language === 'vi' ? 'Họ và tên' : 'Your Name',
      yourEmail: language === 'vi' ? 'Email của bạn' : 'Email Address',
      selectMonument: language === 'vi' ? 'Chọn di tích (tùy chọn)' : 'Select Monument (Optional)',
      chooseMonument: language === 'vi' ? 'Chọn một di tích...' : 'Choose a monument...',
      rating: language === 'vi' ? 'Đánh giá' : 'Rating',
      yourMessage: language === 'vi' ? 'Tin nhắn của bạn' : 'Your Message',
      namePlaceholder: language === 'vi' ? 'Nhập họ tên đầy đủ' : 'Enter your full name',
      emailPlaceholder: language === 'vi' ? 'email@example.com' : 'your.email@example.com',
      messagePlaceholder: language === 'vi' ? 'Chia sẻ trải nghiệm của bạn...' : 'Share your experience...',
      submit: language === 'vi' ? 'Gửi phản hồi' : 'Submit Feedback',
      submitting: language === 'vi' ? 'Đang gửi...' : 'Submitting...',
      successTitle: language === 'vi' ? 'Cảm ơn bạn đã phản hồi!' : 'Thank you for your feedback!',
      successMessage: language === 'vi'
        ? 'Phản hồi của bạn đã được ghi nhận thành công.'
        : 'Your response has been recorded successfully.',
      ratings: {
        excellent: language === 'vi' ? 'Xuất sắc' : 'Excellent',
        veryGood: language === 'vi' ? 'Rất tốt' : 'Very Good',
        good: language === 'vi' ? 'Tốt' : 'Good',
        fair: language === 'vi' ? 'Khá' : 'Fair',
        poor: language === 'vi' ? 'Kém' : 'Poor',
      },
    },

    // Monument Detail page
    monumentDetail: {
      description: language === 'vi' ? 'Sơ lược' : 'Description',
      photoGallery: language === 'vi' ? '📸 Thư viện ảnh' : '📸 Photo Gallery',
      photosCount: (count) => language === 'vi' 
        ? `${count} ảnh - Click để xem full size`
        : `${count} photos - Click to view full size`,
      reviews: language === 'vi' ? 'Đánh giá' : 'Reviews',
      reviewsCount: (count) => language === 'vi' ? `${count} đánh giá` : `${count} reviews`,
      leaveReview: language === 'vi' ? 'Để lại đánh giá' : 'Leave a Review',
      submitReview: language === 'vi' ? 'Gửi đánh giá' : 'Submit Review',
      noReviews: language === 'vi' 
        ? 'Chưa có đánh giá nào. Hãy là người đầu tiên!'
        : 'No reviews yet. Be the first to review!',
      information: language === 'vi' ? 'Thông tin' : 'Information',
      zone: language === 'vi' ? 'Khu vực' : 'Zone',
      location: language === 'vi' ? 'Địa điểm' : 'Location',
      worldWonder: language === 'vi' ? 'Kỳ quan thế giới' : 'World Wonder',
      notFound: language === 'vi' ? 'Không tìm thấy di tích' : 'Monument Not Found',
      backToMonuments: language === 'vi' ? 'Quay lại danh sách' : 'Back to Monuments',
      loadingDetails: language === 'vi' ? 'Đang tải thông tin...' : 'Loading monument details...',
    },

    // Footer
    footer: {
      about: language === 'vi' ? 'Về chúng tôi' : 'About Us',
      aboutText: language === 'vi'
        ? 'Bảo tồn và giới thiệu các di tích lịch sử và di sản văn hóa tuyệt vời nhất thế giới cho thế hệ tương lai'
        : 'Preserving and showcasing the world\'s most magnificent historical monuments and cultural heritage sites for future generations',
      quickLinks: language === 'vi' ? 'Liên kết nhanh' : 'Quick Links',
      followUs: language === 'vi' ? 'Theo dõi chúng tôi' : 'Follow Us',
      location: language === 'vi' ? 'Vị trí' : 'Location',
      copyright: language === 'vi'
        ? '© 2025 Di sản Văn hóa. Bảo lưu mọi quyền.'
        : '© 2025 Cultural Heritage. All rights reserved.',
    },

    // Common
    common: {
      readMore: language === 'vi' ? 'Đọc thêm' : 'Read More',
      viewDetails: language === 'vi' ? 'Xem chi tiết' : 'View Details',
      close: language === 'vi' ? 'Đóng' : 'Close',
      search: language === 'vi' ? 'Tìm kiếm' : 'Search',
      filter: language === 'vi' ? 'Lọc' : 'Filter',
      sort: language === 'vi' ? 'Sắp xếp' : 'Sort',
      loading: language === 'vi' ? 'Đang tải...' : 'Loading...',
      error: language === 'vi' ? 'Đã xảy ra lỗi' : 'An error occurred',
      tryAgain: language === 'vi' ? 'Thử lại' : 'Try Again',
      noData: language === 'vi' ? 'Không có dữ liệu' : 'No data available',
    },
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

