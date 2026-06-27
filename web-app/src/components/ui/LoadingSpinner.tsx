import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-3 text-lg font-medium text-gray-700">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
