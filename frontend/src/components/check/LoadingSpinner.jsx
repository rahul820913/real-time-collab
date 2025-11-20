import React from 'react';

const LoadingSpinner = () => {
  return (
    // This centers the spinner on the whole screen
    <div className="flex flex-col justify-center items-center h-screen bg-slate-900 text-white select-none cursor-default">
      {/* This is the spinner itself */}
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-3 mt-3 text-lg">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;