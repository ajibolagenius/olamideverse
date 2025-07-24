'use client';

import React, { useState, useEffect } from 'react';
import { ClockIcon, MusicalNoteIcon, PlayIcon } from '@heroicons/react/24/outline';
import { ListeningHistory as ListeningHistoryType } from '@/types/auth';
import { Track, Album } from '@/types/models';
import { useAuth } from '@/hooks/useAuth';

interface ListeningHistoryProps {
  limit?: number;
  showDateHeaders?: boolean;
  showPlayButton?: boolean;
}

const ListeningHistory: React.FC<ListeningHistoryProps> = ({
  limit = 50,
  showDateHeaders = true,
  showPlayButton = true,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [history, setHistory] = useState<ListeningHistoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [entities, setEntities] = useState<Record<string, { track: Track; album: Album }>>({});

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchListeningHistory();
    }
  }, [isAuthenticated, user, limit]);

  const fetchListeningHistory = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/listening-history?limit=${limit}`);
      // const data = await response.json();
      // setHistory(data.history);

      // Mock implementation
      const mockHistory: ListeningHistoryType[] = Array.from({ length: Math.min(limit, 20) }, (_, i) => ({
        id: `history_${i}`,
        userId: user!.id,
        trackId: `track_${i % 5}`,
        albumId: `album_${Math.floor(i / 5)}`,
        playedAt: new Date(Date.now() - i * 3600000).toISOString(), // Hours ago
        duration: Math.floor(Math.random() * 200) + 30, // 30-230 seconds
        completed: Math.random() > 0.3, // 70% completion rate
        source: ['album', 'playlist', 'story', 'search'][Math.floor(Math.random() * 4)] as any,
      }));

      setHistory(mockHistory);
      await fetchEntityDetails(mockHistory);
    } catch (error) {
      console.error('Error fetching listening history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEntityDetails = async (historyItems: ListeningHistoryType[]) => {
    const entityMap: Record<string, { track: Track; album: Album }> = {};

    // Mock data for demonstration
    for (const item of historyItems) {
      if (!entityMap[item.trackId]) {
        const trackNumber = parseInt(item.trackId.split('_')[1]) + 1;
        const albumNumber = parseInt(item.albumId.split('_')[1]) + 1;

        entityMap[item.trackId] = {
          track: {
            id: item.trackId,
            albumId: item.albumId,
            title: `Track ${trackNumber}`,
            duration: 210,
            audioUrl: '',
            position: trackNumber,
            metadata: {
              genre: ['Afrobeats'],
              mood: ['Energetic'],
              bpm: 120,
              producer: ['Pheelz'],
            },
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
          album: {
            id: item.albumId,
            title: `Album ${albumNumber}`,
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
          },
        };
      }
    }

    setEntities(entityMap);
  };

  const groupHistoryByDate = (history: ListeningHistoryType[]) => {
    const grouped: Record<string, ListeningHistoryType[]> = {};

    history.forEach(item => {
      const date = new Date(item.playedAt).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });

    return grouped;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'playlist': return '📋';
      case 'story': return '📖';
      case 'search': return '🔍';
      default: return '💿';
    }
  };

  const clearHistory = async () => {
    if (!confirm('Are you sure you want to clear your listening history?')) {
      return;
    }

    try {
      // TODO: Replace with actual API call
      // await fetch('/api/listening-history', { method: 'DELETE' });
      
      // Mock implementation
      localStorage.removeItem('listeningHistory');
      setHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="listening-history-unauthenticated text-center py-8">
        <ClockIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in to view your listening history</h3>
        <p className="text-gray-600 mb-4">Keep track of what you've been listening to</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Sign In
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="listening-history-loading py-8">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="animate-pulse flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
              <div className="h-3 bg-gray-300 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="listening-history-empty text-center py-8">
        <MusicalNoteIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No listening history yet</h3>
        <p className="text-gray-600">Start playing some music to see your history here</p>
      </div>
    );
  }

  const groupedHistory = showDateHeaders ? groupHistoryByDate(history) : { 'All': history };

  return (
    <div className="listening-history">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <ClockIcon className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Listening History</h2>
        </div>
        
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            Clear History
          </button>
        )}
      </div>

      {/* History Groups */}
      <div className="space-y-6">
        {Object.entries(groupedHistory).map(([date, items]) => (
          <div key={date}>
            {/* Date Header */}
            {showDateHeaders && (
              <h3 className="text-sm font-medium text-gray-900 mb-3 sticky top-0 bg-white py-2 border-b border-gray-200">
                {formatDate(items[0].playedAt)}
              </h3>
            )}

            {/* History Items */}
            <div className="space-y-2">
              {items.map((item) => {
                const entity = entities[item.trackId];
                if (!entity) return null;

                return (
                  <div
                    key={item.id}
                    className="history-item flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {/* Album Cover */}
                    <div className="flex-shrink-0 relative">
                      <img
                        src={entity.album.coverArtUrl || '/images/album-placeholder.jpg'}
                        alt={entity.album.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      {showPlayButton && (
                        <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-50 rounded-lg transition-all group">
                          <PlayIcon className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      )}
                    </div>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {entity.track.title}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        Olamide • {entity.album.title}
                      </p>
                      
                      {/* Metadata */}
                      <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <span>{getSourceIcon(item.source)}</span>
                          <span className="capitalize">{item.source}</span>
                        </span>
                        
                        <span>•</span>
                        
                        <span>
                          Played {formatDuration(item.duration)}
                          {!item.completed && ' (partial)'}
                        </span>
                        
                        {!item.completed && (
                          <span className="text-yellow-600">⚠️</span>
                        )}
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex-shrink-0 text-sm text-gray-500">
                      {formatTime(item.playedAt)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {history.length >= limit && (
        <div className="text-center py-6">
          <button
            onClick={() => {
              // Load more history
              console.log('Load more history');
            }}
            className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 hover:border-blue-800 rounded-md transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default ListeningHistory;
