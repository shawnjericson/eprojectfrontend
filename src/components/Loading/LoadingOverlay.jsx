import React, { useState, useEffect } from 'react';

const LoadingOverlay = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Show loading on route changes
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    // Listen for navigation start
    window.addEventListener('beforeunload', handleStart);
    
    // Listen for navigation complete
    window.addEventListener('load', handleComplete);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleStart);
      window.removeEventListener('load', handleComplete);
    };
  }, []);

  // Global loading functions
  useEffect(() => {
    window.showLoading = () => setIsLoading(true);
    window.hideLoading = () => setIsLoading(false);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl text-center min-w-[200px]">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
        <div className="text-gray-600 font-medium text-lg">
          Loading...
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;


