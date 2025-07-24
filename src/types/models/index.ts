/**
 * Core data models for OlamideVerse
 * These interfaces define the structure of the main entities in the application
 */

/**
 * Album model representing a music album
 */
export interface Album {
    id: string;
    title: string;
    releaseDate: string;
    coverArtUrl: string;
    description: string;
    tracks: Track[];
    metadata: AlbumMetadata;
    createdAt: string;
    updatedAt: string;
}

/**
 * Track model representing a music track
 */
export interface Track {
    id: string;
    albumId: string;
    title: string;
    duration: number;
    audioUrl: string;
    position: number;
    lyrics?: Lyrics;
    features?: Artist[];
    metadata: TrackMetadata;
    createdAt: string;
    updatedAt: string;
}

/**
 * Artist model representing a music artist
 */
export interface Artist {
    id: string;
    name: string;
    imageUrl?: string;
    bio?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Lyrics model for track lyrics
 */
export interface Lyrics {
    id: string;
    trackId: string;
    text: string;
    synced: LyricLine[];
    source: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * LyricLine model for synchronized lyrics
 */
export interface LyricLine {
    text: string;
    startTime: number;
    endTime: number;
}

/**
 * User model representing an application user
 */
export interface User {
    id: string;
    username: string;
    email: string;
    preferences: UserPreferences;
    playlists: Playlist[];
    createdAt: string;
    updatedAt: string;
}

/**
 * UserPreferences model for user settings
 */
export interface UserPreferences {
    userId: string;
    theme: 'light' | 'dark' | 'system';
    language: string;
    playbackQuality: 'low' | 'medium' | 'high' | 'auto';
    notificationsEnabled: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Playlist model for user-created playlists
 */
export interface Playlist {
    id: string;
    userId: string;
    name: string;
    description?: string;
    isPublic: boolean;
    tracks: PlaylistTrack[];
    createdAt: string;
    updatedAt: string;
}

/**
 * PlaylistTrack model for tracks in a playlist
 */
export interface PlaylistTrack {
    playlistId: string;
    trackId: string;
    position: number;
}

/**
 * StoryChapter model for story mode content
 */
export interface StoryChapter {
    id: string;
    title: string;
    content: string; // MDX content
    relatedAlbumId?: string;
    position: number;
    media: MediaElement[];
    createdAt: string;
    updatedAt: string;
}

/**
 * MediaElement model for media in story chapters
 */
export interface MediaElement {
    id: string;
    type: 'image' | 'video' | 'audio' | 'embed';
    url: string;
    caption?: string;
    metadata: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

/**
 * ChapterMedia junction model
 */
export interface ChapterMedia {
    chapterId: string;
    mediaId: string;
    position: number;
}

/**
 * AlbumMetadata for additional album information
 */
export interface AlbumMetadata {
    genre?: string[];
    mood?: string[];
    era?: string;
    producer?: string[];
    recordLabel?: string;
    totalTracks?: number;
    totalDuration?: number;
    language?: string;
    credits?: {
        producer?: string[];
        executiveProducer?: string[];
        mixedBy?: string[];
        masteredBy?: string[];
    };
    spotifyId?: string;
    youtubeId?: string;
    appleMusicId?: string;
    audiomackId?: string;
    [key: string]: unknown;
}

/**
 * TrackMetadata for additional track information
 */
export interface TrackMetadata {
    genre?: string[];
    mood?: string[];
    bpm?: number;
    producer?: string[];
    spotifyId?: string;
    youtubeId?: string;
    appleMusicId?: string;
    audiomackId?: string;
    [key: string]: unknown;
}

/**
 * TrackArtist junction model
 */
export interface TrackArtist {
    trackId: string;
    artistId: string;
    role: 'primary' | 'feature' | 'producer';
}
