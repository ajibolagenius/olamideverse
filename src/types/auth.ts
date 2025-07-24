/**
 * Authentication and user-related types
 */

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  shareDataForAnalytics: boolean;
  autoplay: boolean;
  audioQuality: 'low' | 'medium' | 'high';
  showExplicitContent: boolean;
  privateProfile: boolean;
}

export interface UserStats {
  totalListens: number;
  totalTimeListened: number; // in seconds
  favoriteGenres: string[];
  topArtists: string[];
  playlistsCreated: number;
  songsLiked: number;
  storiesRead: number;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  email: string;
  username: string;
  password: string;
  displayName: string;
  acceptTerms: boolean;
  acceptMarketing?: boolean;
}

export interface SocialProvider {
  id: 'google' | 'facebook' | 'twitter' | 'apple';
  name: string;
  icon: string;
  color: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  type: 'listen' | 'like' | 'playlist_create' | 'playlist_update' | 'story_read' | 'share';
  entityType: 'track' | 'album' | 'playlist' | 'story';
  entityId: string;
  metadata: Record<string, unknown>;
  timestamp: string;
}

export interface ListeningHistory {
  id: string;
  userId: string;
  trackId: string;
  albumId: string;
  playedAt: string;
  duration: number; // seconds played
  completed: boolean;
  source: 'album' | 'playlist' | 'story' | 'search';
}

export interface UserFavorite {
  id: string;
  userId: string;
  entityType: 'track' | 'album' | 'story';
  entityId: string;
  createdAt: string;
}

export interface Playlist {
  id: string;
  userId: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  isPublic: boolean;
  isCollaborative: boolean;
  tracks: PlaylistTrack[];
  collaborators: string[]; // user IDs
  createdAt: string;
  updatedAt: string;
  stats: {
    totalDuration: number;
    totalTracks: number;
    likes: number;
    plays: number;
  };
}

export interface PlaylistTrack {
  id: string;
  playlistId: string;
  trackId: string;
  position: number;
  addedBy: string; // user ID
  addedAt: string;
}

export interface PlaylistShare {
  id: string;
  playlistId: string;
  sharedBy: string; // user ID
  shareToken: string;
  expiresAt?: string;
  allowDownload: boolean;
  createdAt: string;
}
