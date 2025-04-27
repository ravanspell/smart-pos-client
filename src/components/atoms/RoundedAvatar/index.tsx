'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface RoundedAvatarProps {
  imageUrl: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  alt?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};
/**
 * RoundedAvatar component
 * 
 * This component displays a rounded avatar image with a loading state and error handling.
 * 
 * @param {Object} props - The component props
 */
export const RoundedAvatar = ({
  imageUrl,
  className,
  size = 'md',
  alt,
}: RoundedAvatarProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={cn('relative rounded-full overflow-hidden', sizeClasses[size], className)}>
      <div className={cn(
        'absolute inset-0 bg-gray-200 transition-opacity duration-500',
        isLoading ? 'opacity-100' : 'opacity-0'
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
      </div>
      {!hasError ? (
        <Image
          src={imageUrl}
          alt={alt || 'Avatar'}
          fill
          className={cn(
            'object-cover transition-all duration-500',
            isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          )}
          onLoadingComplete={handleImageLoad}
          onError={handleImageError}
        />
      ) : (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center transition-opacity duration-500">
          <span className="text-gray-400 text-xs">No Image</span>
        </div>
      )}
    </div>
  );
}; 