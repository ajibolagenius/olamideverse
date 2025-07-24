'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShareIcon, 
  LinkIcon, 
  QrCodeIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { Playlist, PlaylistShare as PlaylistShareType } from '@/types/auth';
import { useAuth } from '@/hooks/useAuth';

interface PlaylistShareProps {
  playlist: Playlist;
  onClose?: () => void;
}

const PlaylistShare: React.FC<PlaylistShareProps> = ({
  playlist,
  onClose,
}) => {
  const { user } = useAuth();
  const [shareData, setShareData] = useState<PlaylistShareType | null>(null);
  const [shareSettings, setShareSettings] = useState({
    allowDownload: false,
    expiresIn: 0, // 0 = never, 1 = 1 day, 7 = 1 week, 30 = 1 month
  });
  const [shareUrl, setShareUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateShareData();
  }, [playlist.id, shareSettings]);

  const generateShareData = async () => {
    setIsGenerating(true);
    try {
      // Calculate expiration date
      let expiresAt: string | undefined;
      if (shareSettings.expiresIn > 0) {
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + shareSettings.expiresIn);
        expiresAt = expireDate.toISOString();
      }

      // Create share data
      const newShareData: PlaylistShareType = {
        id: `share_${Date.now()}`,
        playlistId: playlist.id,
        sharedBy: user!.id,
        shareToken: generateShareToken(),
        expiresAt,
        allowDownload: shareSettings.allowDownload,
        createdAt: new Date().toISOString(),
      };

      // TODO: Replace with actual API call
      // const response = await fetch('/api/playlists/share', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newShareData),
      // });
      // const result = await response.json();

      // Mock implementation
      const existingShares = JSON.parse(localStorage.getItem('playlistShares') || '[]');
      existingShares.push(newShareData);
      localStorage.setItem('playlistShares', JSON.stringify(existingShares));

      setShareData(newShareData);
      
      // Generate share URL
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/playlist/shared/${newShareData.shareToken}`;
      setShareUrl(url);

      // Generate QR code (using a simple QR code API)
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Error generating share data:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateShareToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const shareToSocial = (platform: string) => {
    const title = `Check out "${playlist.title}" playlist`;
    const text = playlist.description || `A playlist by ${user?.displayName}`;
    
    let url = '';
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title} - ${text}`)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(`${title} - ${text} ${shareUrl}`)}`;
        break;
      case 'telegram':
        url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`${title} - ${text}`)}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: playlist.title,
          text: playlist.description || `A playlist by ${user?.displayName}`,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const downloadPlaylistData = () => {
    const playlistData = {
      title: playlist.title,
      description: playlist.description,
      tracks: playlist.tracks,
      stats: playlist.stats,
      createdAt: playlist.createdAt,
    };

    const dataStr = JSON.stringify(playlistData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${playlist.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_playlist.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="playlist-share bg-white rounded-lg shadow-lg max-w-md w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <ShareIcon className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Share Playlist</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Playlist Info */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {playlist.coverImageUrl ? (
              <img
                src={playlist.coverImageUrl}
                alt={playlist.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShareIcon className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{playlist.title}</h3>
            <p className="text-sm text-gray-600">
              {playlist.stats.totalTracks} tracks • By {user?.displayName}
            </p>
          </div>
        </div>

        {/* Share Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Share Settings</h4>
          
          {/* Expiration */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Link expires</label>
            <select
              value={shareSettings.expiresIn}
              onChange={(e) => setShareSettings(prev => ({
                ...prev,
                expiresIn: parseInt(e.target.value)
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={0}>Never</option>
              <option value={1}>1 day</option>
              <option value={7}>1 week</option>
              <option value={30}>1 month</option>
            </select>
          </div>

          {/* Download Permission */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Allow download</p>
              <p className="text-xs text-gray-500">Let others download playlist data</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={shareSettings.allowDownload}
                onChange={(e) => setShareSettings(prev => ({
                  ...prev,
                  allowDownload: e.target.checked
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Share URL */}
        {shareUrl && !isGenerating && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Share Link</h4>
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm bg-gray-50"
                />
                <LinkIcon className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              <button
                onClick={copyToClipboard}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  copied
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {copied ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  'Copy'
                )}
              </button>
            </div>

            {/* Expiration Info */}
            {shareData?.expiresAt && (
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <ClockIcon className="w-4 h-4" />
                <span>
                  Expires on {new Date(shareData.expiresAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* QR Code */}
        {qrCodeUrl && !isGenerating && (
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-900 mb-3">QR Code</h4>
            <div className="inline-block p-3 bg-white border border-gray-200 rounded-lg">
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-32 h-32"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Scan with your phone to share
            </p>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-sm text-gray-600">Generating share link...</p>
          </div>
        )}

        {/* Social Share Buttons */}
        {shareUrl && !isGenerating && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Share to</h4>
            <div className="grid grid-cols-2 gap-2">
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={nativeShare}
                  className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
                >
                  <ShareIcon className="w-4 h-4" />
                  <span>Share</span>
                </button>
              )}
              
              <button
                onClick={() => shareToSocial('twitter')}
                className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors"
              >
                <span>𝕏</span>
                <span>Twitter</span>
              </button>
              
              <button
                onClick={() => shareToSocial('facebook')}
                className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md text-sm font-medium transition-colors"
              >
                <span>f</span>
                <span>Facebook</span>
              </button>
              
              <button
                onClick={() => shareToSocial('whatsapp')}
                className="flex items-center justify-center space-x-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors"
              >
                <span>📱</span>
                <span>WhatsApp</span>
              </button>
              
              <button
                onClick={() => shareToSocial('telegram')}
                className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-md text-sm font-medium transition-colors"
              >
                <span>✈️</span>
                <span>Telegram</span>
              </button>
            </div>
          </div>
        )}

        {/* Download Option */}
        {shareSettings.allowDownload && (
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={downloadPlaylistData}
              className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>Download Playlist Data</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistShare;
