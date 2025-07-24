'use client';

import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  RectangleStackIcon, 
  PlayIcon, 
  PencilIcon, 
  TrashIcon,
  ShareIcon,
  EllipsisHorizontalIcon,
  LockClosedIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { Playlist } from '@/types/auth';
import { useAuth } from '@/hooks/useAuth';
import PlaylistCreator from './PlaylistCreator';

interface PlaylistManagerProps {
  showCreateButton?: boolean;
  limit?: number;
  onPlaylistSelect?: (playlist: Playlist) => void;
}

const PlaylistManager: React.FC<PlaylistManagerProps> = ({
  showCreateButton = true,
  limit,
  onPlaylistSelect,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreator, setShowCreator] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchPlaylists();
    }
  }, [isAuthenticated, user]);

  const fetchPlaylists = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/playlists');
      // const data = await response.json();
      // setPlaylists(data.playlists);

      // Mock implementation
      const mockPlaylists = JSON.parse(localStorage.getItem('userPlaylists') || '[]');
      let filteredPlaylists = mockPlaylists;

      if (limit) {
        filteredPlaylists = mockPlaylists.slice(0, limit);
      }

      setPlaylists(filteredPlaylists);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaylistCreated = (playlist: Playlist) => {
    setPlaylists(prev => [playlist, ...prev]);
    setShowCreator(false);
  };

  const handlePlaylistUpdated = (updatedPlaylist: Playlist) => {
    setPlaylists(prev => prev.map(p => 
      p.id === updatedPlaylist.id ? updatedPlaylist : p
    ));
    setEditingPlaylist(null);
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    if (!confirm('Are you sure you want to delete this playlist? This action cannot be undone.')) {
      return;
    }

    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/playlists/${playlistId}`, { method: 'DELETE' });

      // Mock implementation
      const mockPlaylists = JSON.parse(localStorage.getItem('userPlaylists') || '[]');
      const filtered = mockPlaylists.filter((p: Playlist) => p.id !== playlistId);
      localStorage.setItem('userPlaylists', JSON.stringify(filtered));

      setPlaylists(prev => prev.filter(p => p.id !== playlistId));
      setMenuOpenFor(null);
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  const handleSharePlaylist = (playlist: Playlist) => {
    // TODO: Implement sharing functionality
    const shareUrl = `${window.location.origin}/playlist/${playlist.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: playlist.title,
        text: `Check out my playlist "${playlist.title}" on OlamideVerse`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      // Show toast notification
      console.log('Playlist link copied to clipboard');
    }
    
    setMenuOpenFor(null);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
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
      <div className="playlist-manager-unauthenticated text-center py-8">
        <RectangleStackIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in to create playlists</h3>
        <p className="text-gray-600 mb-4">Organize your favorite tracks into custom playlists</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Sign In
        </button>
      </div>
    );
  }

  if (showCreator || editingPlaylist) {
    return (
      <PlaylistCreator
        onPlaylistCreated={handlePlaylistCreated}
        onCancel={() => {
          setShowCreator(false);
          setEditingPlaylist(null);
        }}
        isModal={true}
      />
    );
  }

  return (
    <div className="playlist-manager">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <RectangleStackIcon className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Your Playlists</h2>
        </div>
        
        {showCreateButton && (
          <button
            onClick={() => setShowCreator(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Create Playlist</span>
          </button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="playlist-loading space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && playlists.length === 0 && (
        <div className="playlist-empty text-center py-12">
          <RectangleStackIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No playlists yet</h3>
          <p className="text-gray-600 mb-6">Create your first playlist to organize your favorite tracks</p>
          <button
            onClick={() => setShowCreator(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Create Your First Playlist</span>
          </button>
        </div>
      )}

      {/* Playlists Grid */}
      {!isLoading && playlists.length > 0 && (
        <div className="playlist-grid space-y-4">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="playlist-item group relative flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => onPlaylistSelect?.(playlist)}
            >
              {/* Cover Image */}
              <div className="flex-shrink-0 relative">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  {playlist.coverImageUrl ? (
                    <img
                      src={playlist.coverImageUrl}
                      alt={playlist.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <RectangleStackIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Play Button Overlay */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle play playlist
                    console.log('Play playlist:', playlist.id);
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <PlayIcon className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Playlist Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-base font-medium text-gray-900 truncate">
                    {playlist.title}
                  </h3>
                  
                  {/* Privacy Icon */}
                  {playlist.isPublic ? (
                    <GlobeAltIcon className="w-4 h-4 text-green-600" title="Public playlist" />
                  ) : (
                    <LockClosedIcon className="w-4 h-4 text-gray-500" title="Private playlist" />
                  )}
                  
                  {/* Collaborative Badge */}
                  {playlist.isCollaborative && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Collaborative
                    </span>
                  )}
                </div>

                {playlist.description && (
                  <p className="text-sm text-gray-600 truncate mb-1">
                    {playlist.description}
                  </p>
                )}

                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>
                    {playlist.stats.totalTracks} {playlist.stats.totalTracks === 1 ? 'track' : 'tracks'}
                  </span>
                  
                  {playlist.stats.totalDuration > 0 && (
                    <>
                      <span>•</span>
                      <span>{formatDuration(playlist.stats.totalDuration)}</span>
                    </>
                  )}
                  
                  <span>•</span>
                  <span>Created {formatDate(playlist.createdAt)}</span>
                  
                  {playlist.stats.plays > 0 && (
                    <>
                      <span>•</span>
                      <span>{playlist.stats.plays} plays</span>
                    </>
                  )}
                </div>
              </div>

              {/* Menu Button */}
              <div className="flex-shrink-0 relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenFor(menuOpenFor === playlist.id ? null : playlist.id);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <EllipsisHorizontalIcon className="w-5 h-5" />
                </button>

                {/* Dropdown Menu */}
                {menuOpenFor === playlist.id && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPlaylist(playlist);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <PencilIcon className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSharePlaylist(playlist);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <ShareIcon className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                      
                      <div className="border-t border-gray-100"></div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePlaylist(playlist.id);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <TrashIcon className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {!isLoading && playlists.length >= (limit || 0) && limit && (
        <div className="text-center py-6">
          <button
            onClick={() => {
              // Load more playlists
              console.log('Load more playlists');
            }}
            className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 hover:border-blue-800 rounded-md transition-colors"
          >
            Load More
          </button>
        </div>
      )}

      {/* Click outside to close menu */}
      {menuOpenFor && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setMenuOpenFor(null)}
        />
      )}
    </div>
  );
};

export default PlaylistManager;
