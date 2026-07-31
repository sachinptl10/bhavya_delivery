import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div 
      className={`animate-skeleton-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 bg-[length:200%_100%] rounded-md ${className}`}
      role="status"
      aria-label="Loading"
    ></div>
  );
};
