'use client';

import React, { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { UserFavorite } from '@/types/auth';
import { Track, Album } from '@/types/models';
import { useAuth } from '@/hooks/useAuth';

interface FavoritesManagerProps {
  entityType: 'track' | 'album' | 'story';
  entityId: string;
  entity?: Track | Album;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

const FavoritesManager: React.FC<FavoritesManagerProps> = ({
  entityType,
  entityId,
  entity,
  size = 'md',
  showCount = false,
  className = '',
}) => {
  const { user, isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      checkFavoriteStatus();
      if (showCount) {
        fetchFavoriteCount();
      }
    }
  }, [entityId, entityType, isAuthenticated, user]);

  const checkFavoriteStatus = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/favorites/check`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ entityType, entityId }),
      // });
      // const data = await response.json();
      // setIsFavorited(data.isFavorited);
      
      // Mock implementation for now
      const mockFavorites = JSON.parse(localStorage.getItem('userFavorites') || '[]');
      const exists = mockFavorites.some((fav: UserFavorite) => 
        fav.entityType === entityType && fav.entityId === entityId
      );
      setIsFavorited(exists);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const fetchFavoriteCount = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/favorites/count/${entityType}/${entityId}`);
      // const data = await response.json();
      // setFavoriteCount(data.count);
      
      // Mock implementation
      const mockFavorites = JSON.parse(localStorage.getItem('allFavorites') || '[]');
      const count = mockFavorites.filter((fav: UserFavorite) => 
        fav.entityType === entityType && fav.entityId === entityId
      ).length;
      setFavoriteCount(count);
    } catch (error) {
      console.error('Error fetching favorite count:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated || !user) {
      // Show auth modal or redirect to login
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorited) {
        await removeFavorite();
      } else {
        await addFavorite();
      }
      setIsFavorited(!isFavorited);
      if (showCount) {
        setFavoriteCount(prev => isFavorited ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addFavorite = async () => {
    // TODO: Replace with actual API call
    // await fetch('/api/favorites', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ entityType, entityId }),
    // });

    // Mock implementation
    const mockFavorites = JSON.parse(localStorage.getItem('userFavorites') || '[]');
    const newFavorite: UserFavorite = {
      id: `fav_${Date.now()}`,
      userId: user!.id,
      entityType,
      entityId,
      createdAt: new Date().toISOString(),
    };
    mockFavorites.push(newFavorite);
    localStorage.setItem('userFavorites', JSON.stringify(mockFavorites));

    // Update global count
    const allFavorites = JSON.parse(localStorage.getItem('allFavorites') || '[]');
    allFavorites.push(newFavorite);
    localStorage.setItem('allFavorites', JSON.stringify(allFavorites));
  };

  const removeFavorite = async () => {
    // TODO: Replace with actual API call
    // await fetch('/api/favorites', {
    //   method: 'DELETE',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ entityType, entityId }),
    // });

    // Mock implementation
    const mockFavorites = JSON.parse(localStorage.getItem('userFavorites') || '[]');
    const filtered = mockFavorites.filter((fav: UserFavorite) => 
      !(fav.entityType === entityType && fav.entityId === entityId)
    );
    localStorage.setItem('userFavorites', JSON.stringify(filtered));

    // Update global count
    const allFavorites = JSON.parse(localStorage.getItem('allFavorites') || '[]');
    const filteredAll = allFavorites.filter((fav: UserFavorite) => 
      !(fav.entityType === entityType && fav.entityId === entityId && fav.userId === user!.id)
    );
    localStorage.setItem('allFavorites', JSON.stringify(filteredAll));
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'lg': return 'w-8 h-8';
      default: return 'w-6 h-6';
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm': return 'p-1';
      case 'lg': return 'p-3';
      default: return 'p-2';
    }
  };

  if (!isAuthenticated) {
    return (
      <button
        onClick={() => {
          // Trigger auth modal
          console.log('Please sign in to add favorites');
        }}
        className={`${getButtonSize()} text-gray-400 hover:text-gray-600 transition-colors ${className}`}
        title="Sign in to add to favorites"
      >
        <HeartIcon className={getIconSize()} />
        {showCount && favoriteCount > 0 && (
          <span className="ml-1 text-sm">{favoriteCount}</span>
        )}
      </button>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <button
        onClick={toggleFavorite}
        disabled={isLoading}
        className={`${getButtonSize()} transition-all duration-200 ${
          isFavorited
            ? 'text-red-500 hover:text-red-600'
            : 'text-gray-400 hover:text-red-500'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isLoading ? (
          <div className={`${getIconSize()} animate-spin`}>
            <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : isFavorited ? (
          <HeartIconSolid className={getIconSize()} />
        ) : (
          <HeartIcon className={getIconSize()} />
        )}
      </button>

      {showCount && favoriteCount > 0 && (
        <span className={`ml-1 text-gray-600 ${
          size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
        }`}>
          {favoriteCount}
        </span>
      )}
    </div>
  );
};

export default FavoritesManager;
