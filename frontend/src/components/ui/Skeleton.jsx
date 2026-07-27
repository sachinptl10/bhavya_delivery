import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div className={`animate-skeleton-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded-md ${className}`}></div>
  );
};
