'use client';

import React, { useState } from 'react';
import { PlusIcon, PhotoIcon, GlobeAltIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { Playlist } from '@/types/auth';
import { useAuth } from '@/hooks/useAuth';

interface PlaylistCreatorProps {
  onPlaylistCreated?: (playlist: Playlist) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

const PlaylistCreator: React.FC<PlaylistCreatorProps> = ({
  onPlaylistCreated,
  onCancel,
  isModal = false,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublic: true,
    isCollaborative: false,
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, coverImage: 'Please select an image file' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, coverImage: 'Image must be less than 5MB' }));
      return;
    }

    setCoverImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setCoverImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Clear error
    if (errors.coverImage) {
      setErrors(prev => ({ ...prev, coverImage: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Playlist title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload cover image if provided
      let coverImageUrl = null;
      if (coverImage) {
        // TODO: Replace with actual image upload
        // const formData = new FormData();
        // formData.append('image', coverImage);
        // const uploadResponse = await fetch('/api/upload/playlist-cover', {
        //   method: 'POST',
        //   body: formData,
        // });
        // const uploadData = await uploadResponse.json();
        // coverImageUrl = uploadData.url;
        
        // Mock implementation
        coverImageUrl = coverImagePreview;
      }

      // Create playlist
      const newPlaylist: Playlist = {
        id: `playlist_${Date.now()}`,
        userId: user.id,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        coverImageUrl: coverImageUrl || undefined,
        isPublic: formData.isPublic,
        isCollaborative: formData.isCollaborative,
        tracks: [],
        collaborators: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stats: {
          totalDuration: 0,
          totalTracks: 0,
          likes: 0,
          plays: 0,
        },
      };

      // TODO: Replace with actual API call
      // const response = await fetch('/api/playlists', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newPlaylist),
      // });
      // const playlist = await response.json();

      // Mock implementation
      const existingPlaylists = JSON.parse(localStorage.getItem('userPlaylists') || '[]');
      existingPlaylists.push(newPlaylist);
      localStorage.setItem('userPlaylists', JSON.stringify(existingPlaylists));

      onPlaylistCreated?.(newPlaylist);

      // Reset form
      setFormData({
        title: '',
        description: '',
        isPublic: true,
        isCollaborative: false,
      });
      setCoverImage(null);
      setCoverImagePreview(null);
    } catch (error) {
      console.error('Error creating playlist:', error);
      setErrors({ submit: 'Failed to create playlist. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerClass = isModal
    ? 'playlist-creator-modal p-6'
    : 'playlist-creator bg-white border border-gray-200 rounded-lg p-6';

  return (
    <div className={containerClass}>
      <div className="flex items-center space-x-3 mb-6">
        <PlusIcon className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Create New Playlist</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cover Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image (Optional)
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
              {coverImagePreview ? (
                <img
                  src={coverImagePreview}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <PhotoIcon className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <input
                type="file"
                id="coverImage"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
              />
              <label
                htmlFor="coverImage"
                className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Choose Image
              </label>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG up to 5MB
              </p>
            </div>
          </div>
          {errors.coverImage && (
            <p className="mt-1 text-sm text-red-600">{errors.coverImage}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Playlist Name *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="My Awesome Playlist"
            maxLength={100}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          <div className="flex justify-between mt-1">
            {errors.title ? (
              <p className="text-sm text-red-600">{errors.title}</p>
            ) : (
              <div />
            )}
            <p className="text-xs text-gray-500">
              {formData.title.length}/100
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your playlist..."
            rows={3}
            maxLength={500}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          <div className="flex justify-between mt-1">
            {errors.description ? (
              <p className="text-sm text-red-600">{errors.description}</p>
            ) : (
              <div />
            )}
            <p className="text-xs text-gray-500">
              {formData.description.length}/500
            </p>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Privacy Settings</h3>
          
          <div className="space-y-3">
            {/* Public/Private */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {formData.isPublic ? (
                  <GlobeAltIcon className="w-5 h-5 text-green-600" />
                ) : (
                  <LockClosedIcon className="w-5 h-5 text-gray-600" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {formData.isPublic ? 'Public' : 'Private'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formData.isPublic 
                      ? 'Anyone can view and follow this playlist'
                      : 'Only you can view this playlist'
                    }
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Collaborative */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-sm">👥</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Collaborative
                  </p>
                  <p className="text-xs text-gray-500">
                    Let others add tracks to this playlist
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isCollaborative"
                  checked={formData.isCollaborative}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !formData.title.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Playlist'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlaylistCreator;
