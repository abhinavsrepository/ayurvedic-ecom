'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getActiveBanners, incrementBannerImpressions, incrementBannerClicks, type Banner } from '@/lib/mocks/banners';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerDisplayProps {
  position: 'hero' | 'middle' | 'footer' | 'popup';
  autoPlay?: boolean;
  interval?: number;
}

export default function BannerDisplay({ position, autoPlay = true, interval = 5000 }: BannerDisplayProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadBanners();
  }, [position]);

  useEffect(() => {
    if (banners.length > 0) {
      
      incrementBannerImpressions(banners[currentIndex].id);
    }
  }, [currentIndex, banners]);

  useEffect(() => {
    if (autoPlay && banners.length > 1 && position !== 'popup') {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, interval);
      return () => clearInterval(timer);
    }
  }, [autoPlay, banners.length, interval, position]);

  useEffect(() => {
    if (position === 'popup' && banners.length > 0 && mounted) {
      const popupShown = sessionStorage.getItem('popup_shown');
      if (!popupShown) {
        setTimeout(() => {
          setShowPopup(true);
          sessionStorage.setItem('popup_shown', 'true');
        }, 3000);
      }
    }
  }, [position, banners, mounted]);

  const loadBanners = () => {
    const activeBanners = getActiveBanners(position);
    setBanners(activeBanners);
  };

  const handleBannerClick = (banner: Banner) => {
    incrementBannerClicks(banner.id);
  };

  const nextBanner = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (!mounted || banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  // Popup Banner
  if (position === 'popup') {
    if (!showPopup) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden">
          <button
            onClick={() => setShowPopup(false)}
            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="relative">
            <img
              src={currentBanner.imageUrl}
              alt={currentBanner.title}
              className="w-full h-64 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Banner';
              }}
            />
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
              style={{
                backgroundColor: currentBanner.backgroundColor ? `${currentBanner.backgroundColor}cc` : '#10b981cc',
                color: currentBanner.textColor || '#ffffff',
              }}
            >
              <h2 className="text-3xl font-bold mb-2">{currentBanner.title}</h2>
              {currentBanner.subtitle && (
                <p className="text-xl mb-4">{currentBanner.subtitle}</p>
              )}
              {currentBanner.description && (
                <p className="text-sm mb-6 max-w-lg">{currentBanner.description}</p>
              )}
              {currentBanner.ctaText && currentBanner.ctaLink && (
                <Link
                  href={currentBanner.ctaLink}
                  onClick={() => {
                    handleBannerClick(currentBanner);
                    setShowPopup(false);
                  }}
                  className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  {currentBanner.ctaText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Hero/Middle/Footer Banners
  const getAnimationClass = () => {
    switch (currentBanner.animation) {
      case 'fade':
        return 'animate-fadeIn';
      case 'slide':
        return 'animate-slideIn';
      case 'zoom':
        return 'animate-zoomIn';
      default:
        return '';
    }
  };

  const containerClass = currentBanner.displayType === 'full-width'
    ? 'w-full'
    : currentBanner.displayType === 'centered'
    ? 'max-w-7xl mx-auto'
    : 'max-w-md';

  return (
    <div className={`relative ${containerClass} overflow-hidden rounded-lg group`}>
      <div key={currentIndex} className={getAnimationClass()}>
        <div className="relative">
          {/* Image with responsive handling */}
          <picture>
            {currentBanner.mobileImageUrl && (
              <source media="(max-width: 768px)" srcSet={currentBanner.mobileImageUrl} />
            )}
            <img
              src={currentBanner.imageUrl}
              alt={currentBanner.title}
              className="w-full h-auto object-cover"
              style={{
                minHeight: position === 'hero' ? '400px' : '200px',
                maxHeight: position === 'hero' ? '600px' : '300px',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1920x600?text=Banner';
              }}
            />
          </picture>

          {/* Overlay Content */}
          <div
            className="absolute inset-0 flex flex-col items-start justify-center p-8 md:p-12"
            style={{
              backgroundColor: currentBanner.backgroundColor ? `${currentBanner.backgroundColor}cc` : 'transparent',
              color: currentBanner.textColor || '#ffffff',
            }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-2 max-w-2xl">
              {currentBanner.title}
            </h2>
            {currentBanner.subtitle && (
              <p className="text-lg md:text-2xl mb-4 max-w-xl">
                {currentBanner.subtitle}
              </p>
            )}
            {currentBanner.description && (
              <p className="text-sm md:text-base mb-6 max-w-lg">
                {currentBanner.description}
              </p>
            )}
            {currentBanner.ctaText && currentBanner.ctaLink && (
              <Link
                href={currentBanner.ctaLink}
                onClick={() => handleBannerClick(currentBanner)}
                className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                {currentBanner.ctaText}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevBanner}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <button
            onClick={nextBanner}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-6 h-6 text-gray-900" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
