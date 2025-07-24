'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  PencilIcon, 
  CogIcon, 
  HeartIcon, 
  ClockIcon,
  ShareIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { UserPreferences } from '@/types/auth';

interface UserProfileProps {
  className?: string;
}

export default function UserProfile({ className = '' }: UserProfileProps) {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'favorites' | 'playlists'>('overview');

  if (!user) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <p className="text-gray-500">Please log in to view your profile.</p>
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'stats', label: 'Stats', icon: ChartBarIcon },
    { id: 'favorites', label: 'Favorites', icon: HeartIcon },
    { id: 'playlists', label: 'Playlists', icon: ShareIcon },
  ] as const;

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Profile Header */}
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.displayName}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <button className="absolute -bottom-1 -right-1 bg-primary text-white p-2 rounded-full hover:bg-primary-600 transition-colors">
              <PencilIcon className="w-4 h-4" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.displayName}
              </h1>
              {user.isVerified && (
                <span className="text-primary">✓</span>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-1">@{user.username}</p>
            {user.bio && (
              <p className="text-gray-600 dark:text-gray-300 mb-3">{user.bio}</p>
            )}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {user.location && (
                <span>📍 {user.location}</span>
              )}
              <span>🗓️ Joined {new Date(user.createdAt).getFullYear()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Edit Profile
            </button>
            <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors">
              <CogIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-secondary-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">{user.stats.totalListens}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Listens</div>
        </div>
        <div className="bg-white dark:bg-secondary-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-500">{formatDuration(user.stats.totalTimeListened)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Time Listened</div>
        </div>
        <div className="bg-white dark:bg-secondary-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-500">{user.stats.playlistsCreated}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Playlists</div>
        </div>
        <div className="bg-white dark:bg-secondary-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-500">{user.stats.songsLiked}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Liked Songs</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-lg">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Favorite Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {user.stats.favoriteGenres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Top Artists</h3>
                <div className="space-y-2">
                  {user.stats.topArtists.map((artist, index) => (
                    <div key={artist} className="flex items-center space-x-3">
                      <span className="text-gray-500">#{index + 1}</span>
                      <span className="font-medium">{artist}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Listening Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Plays</span>
                    <span className="font-medium">{user.stats.totalListens}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hours Listened</span>
                    <span className="font-medium">{Math.round(user.stats.totalTimeListened / 3600)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stories Read</span>
                    <span className="font-medium">{user.stats.storiesRead}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Collection Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Playlists Created</span>
                    <span className="font-medium">{user.stats.playlistsCreated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Songs Liked</span>
                    <span className="font-medium">{user.stats.songsLiked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Age</span>
                    <span className="font-medium">
                      {Math.round((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="text-center py-8">
              <HeartIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Your favorite tracks and albums will appear here.</p>
            </div>
          )}

          {activeTab === 'playlists' && (
            <div className="text-center py-8">
              <ShareIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Your created playlists will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
