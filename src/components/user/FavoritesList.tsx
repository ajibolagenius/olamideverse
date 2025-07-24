'use client';

import React, { useState, useEffect } from 'react';
import { HeartIcon, MusicalNoteIcon, RectangleStackIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { UserFavorite } from '@/types/auth';
import { Track, Album } from '@/types/models';
import { useAuth } from '@/hooks/useAuth';

interface FavoritesListProps {
  filter?: 'all' | 'track' | 'album' | 'story';
  limit?: number;
  showFilter?: boolean;
}

const FavoritesList: React.FC<FavoritesListProps> = ({
  filter = 'all',
  limit,
  showFilter = true,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [activeFilter, setActiveFilter] = useState(filter);
  const [isLoading, setIsLoading] = useState(true);
  const [entities, setEntities] = useState<Record<string, Track | Album>>({});

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchFavorites();
    }
  }, [isAuthenticated, user, activeFilter]);

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/favorites?filter=${activeFilter}`);
      // const data = await response.json();
      // setFavorites(data.favorites);

      // Mock implementation
      const mockFavorites = JSON.parse(localStorage.getItem('userFavorites') || '[]');
      let filteredFavorites = mockFavorites;

      if (activeFilter !== 'all') {
        filteredFavorites = mockFavorites.filter((fav: UserFavorite) => 
          fav.entityType === activeFilter
        );
      }

      if (limit) {
        filteredFavorites = filteredFavorites.slice(0, limit);
      }

      setFavorites(filteredFavorites);

      // Fetch entity details for display
      await fetchEntityDetails(filteredFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEntityDetails = async (favorites: UserFavorite[]) => {
    const entityMap: Record<string, Track | Album> = {};

    // TODO: Replace with actual API calls
    for (const favorite of favorites) {
      try {
        // Mock data for demonstration
        if (favorite.entityType === 'track') {
          entityMap[favorite.entityId] = {
            id: favorite.entityId,
            albumId: 'album1',
            title: `Track ${favorite.entityId}`,
            duration: 210,
            audioUrl: '',
            position: 1,
            metadata: {
              genre: ['Afrobeats'],
              mood: ['Energetic'],
              bpm: 120,
              producer: ['Pheelz'],
            },
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          } as Track;
        } else if (favorite.entityType === 'album') {
          entityMap[favorite.entityId] = {
            id: favorite.entityId,
            title: `Album ${favorite.entityId}`,
            releaseDate: '2023-01-01',
            coverArtUrl: '/images/album-placeholder.jpg',
            description: 'An amazing album',
            tracks: [],
            metadata: {
              genre: ['Afrobeats'],
              mood: ['Energetic'],
              era: '2020s',
              producer: ['Pheelz', 'P.Prime'],
              recordLabel: 'YBNL',
              totalTracks: 10,
              totalDuration: 3600,
              language: 'English',
            },
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          } as Album;
        }
      } catch (error) {
        console.error(`Error fetching ${favorite.entityType} ${favorite.entityId}:`, error);
      }
    }

    setEntities(entityMap);
  };

  const removeFavorite = async (favoriteId: string, entityType: string, entityId: string) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/favorites/${favoriteId}`, { method: 'DELETE' });

      // Mock implementation
      const mockFavorites = JSON.parse(localStorage.getItem('userFavorites') || '[]');
      const filtered = mockFavorites.filter((fav: UserFavorite) => fav.id !== favoriteId);
      localStorage.setItem('userFavorites', JSON.stringify(filtered));

      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'track': return <MusicalNoteIcon className="w-5 h-5" />;
      case 'album': return <RectangleStackIcon className="w-5 h-5" />;
      case 'story': return <BookOpenIcon className="w-5 h-5" />;
      default: return <HeartIcon className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="favorites-list-unauthenticated text-center py-8">
        <HeartIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in to view your favorites</h3>
        <p className="text-gray-600 mb-4">Keep track of your favorite tracks, albums, and stories</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="favorites-list">
      {/* Filter Tabs */}
      {showFilter && (
        <div className="filter-tabs mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'all', label: 'All', icon: HeartIcon },
              { key: 'track', label: 'Tracks', icon: MusicalNoteIcon },
              { key: 'album', label: 'Albums', icon: RectangleStackIcon },
              { key: 'story', label: 'Stories', icon: BookOpenIcon },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key as typeof activeFilter)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeFilter === key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="loading-state py-8">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && favorites.length === 0 && (
        <div className="empty-state text-center py-8">
          <HeartIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No favorites yet
          </h3>
          <p className="text-gray-600">
            Start exploring and heart the content you love
          </p>
        </div>
      )}

      {/* Favorites List */}
      {!isLoading && favorites.length > 0 && (
        <div className="favorites-grid space-y-4">
          {favorites.map((favorite) => {
            const entity = entities[favorite.entityId];
            if (!entity) return null;

            return (
              <div
                key={favorite.id}
                className="favorite-item flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                {/* Entity Icon/Image */}
                <div className="flex-shrink-0">
                  {favorite.entityType === 'album' && 'coverArtUrl' in entity ? (
                    <img
                      src={(entity as Album).coverArtUrl || '/images/album-placeholder.jpg'}
                      alt={entity.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getEntityIcon(favorite.entityType)}
                    </div>
                  )}
                </div>

                {/* Entity Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {entity.title}
                  </h4>
                  <p className="text-sm text-gray-600 truncate">
                    Olamide
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                      {getEntityIcon(favorite.entityType)}
                      <span className="ml-1 capitalize">{favorite.entityType}</span>
                    </span>
                    <span className="text-xs text-gray-500">
                      Added {formatDate(favorite.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      // Navigate to entity
                      if (favorite.entityType === 'album') {
                        window.location.href = `/albums/${favorite.entityId}`;
                      } else if (favorite.entityType === 'track') {
                        // Play track or navigate to album
                        console.log('Play track:', favorite.entityId);
                      }
                    }}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    {favorite.entityType === 'album' ? 'View' : 'Play'}
                  </button>
                  
                  <button
                    onClick={() => removeFavorite(favorite.id, favorite.entityType, favorite.entityId)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove from favorites"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
