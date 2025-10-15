import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const MaintenancePage = () => {
  const { language } = useLanguage();

  const content = {
    vi: {
      title: 'Bảo trì website',
      subtitle: 'Chúng tôi đang thực hiện bảo trì website để cải thiện trải nghiệm người dùng. Vui lòng quay lại sau ít phút.',
      features: [
        { text: 'Bảo mật và độ tin cậy cao' },
        { text: 'Hiệu suất được tối ưu hóa' },
        { text: 'Trải nghiệm người dùng tốt hơn' }
      ],
      infoTitle: 'Thông tin bảo trì',
      infoText: 'Website sẽ hoạt động trở lại trong thời gian sớm nhất. Chúng tôi xin lỗi vì sự bất tiện này và cảm ơn sự kiên nhẫn của bạn.'
    },
    en: {
      title: 'Website Maintenance',
      subtitle: 'We are currently performing website maintenance to improve your experience. Please check back in a few minutes.',
      features: [
        { text: 'Enhanced Security & Reliability' },
        { text: 'Optimized Performance' },
        { text: 'Better User Experience' }
      ],
      infoTitle: 'Maintenance Information',
      infoText: 'The website will be back online shortly. We apologize for any inconvenience and thank you for your patience.'
    }
  };

  const currentContent = content[language] || content.en;

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gray-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg text-center shadow-lg border border-gray-200">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {currentContent.title}
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 mb-8">
          {currentContent.subtitle}
        </p>

        {/* Features */}
        <div className="mb-8 space-y-6">
          {currentContent.features.map((feature, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <p className="text-gray-700">{feature.text}</p>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-blue-600 mb-2">{currentContent.infoTitle}</h3>
          <p className="text-gray-700">{currentContent.infoText}</p>
        </div>

        {/* Auto Refresh Notice */}
        <div className="mt-6 text-sm text-gray-500">
          <p>🔄 {language === 'vi' ? 'Trang sẽ tự động kiểm tra và cập nhật khi website hoạt động trở lại' : 'This page will automatically check and update when the website is back online'}</p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
