import { z } from 'zod';
import type {
    Album,
    Track,
    Artist,
    Lyrics,
    User,
    Playlist,
    StoryChapter,
    MediaElement
} from '@/types/models';

/**
 * Zod schema for Album validation
 */
export const albumSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1, 'Title is required'),
    releaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    coverArtUrl: z.string().url('Invalid cover art URL'),
    description: z.string(),
    tracks: z.array(z.lazy(() => trackSchema)),
    metadata: z.record(z.any()),
    createdAt: z.string(),
    updatedAt: z.string(),
});

/**
 * Zod schema for Track validation
 */
export const trackSchema = z.object({
    id: z.string().uuid(),
    albumId: z.string().uuid(),
    title: z.string().min(1, 'Title is required'),
    duration: z.number().positive('Duration must be positive'),
    audioUrl: z.string().url('Invalid audio URL'),
    position: z.number().int().nonnegative('Position must be non-negative'),
    lyrics: z.lazy(() => lyricsSchema).optional(),
    features: z.array(z.lazy(() => artistSchema)).optional(),
    metadata: z.record(z.any()),
    createdAt: z.string(),
    updatedAt: z.string(),
});

/**
 * Zod schema for Artist validation
 */
export const artistSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, 'Name is required'),
    imageUrl: z.string().url('Invalid image URL').optional(),
    bio: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

/**
 * Zod schema for Lyrics validation
 */
export const lyricsSchema = z.object({
    id: z.string().uuid(),
    trackId: z.string().uuid(),
    text: z.string(),
    synced: z.array(z.object({
        text: z.string(),
        startTime: z.number().nonnegative('Start time must be non-negative'),
        endTime: z.number().nonnegative('End time must be non-negative'),
    })),
    source: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

/**
 * Zod schema for User validation
 */
export const userSchema = z.object({
    id: z.string().uuid(),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    preferences: z.object({
        userId: z.string().uuid(),
        theme: z.enum(['light', 'dark', 'system']),
        language: z.string(),
        playbackQuality: z.enum(['low', 'medium', 'high', 'auto']),
        notificationsEnabled: z.boolean(),
        createdAt: z.string(),
        updatedAt: z.string(),
    }),
    playlists: z.array(z.lazy(() => playlistSchema)),
    createdAt: z.string(),
    updatedAt: z.string(),
});

/**
 * Zod schema for Playlist validation
 */
export const playlistSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    name: z.string().min(1, 'Playlist name is required'),
    description: z.string().optional(),
    isPublic: z.boolean(),
    tracks: z.array(z.object({
        playlistId: z.string().uuid(),
        trackId: z.string().uuid(),
        position: z.number().int().nonnegative(),
    })),
    createdAt: z.string(),
    updatedAt: z.string(),
});

/**
 * Zod schema for StoryChapter validation
 */
export const storyChapterSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1, 'Title is required'),
    content: z.string(),
    relatedAlbumId: z.string().uuid().optional(),
    position: z.number().int().nonnegative(),
    media: z.array(z.lazy(() => mediaElementSchema)),
    createdAt: z.string(),
    updatedAt: z.string(),
});

/**
 * Zod schema for MediaElement validation
 */
export const mediaElementSchema = z.object({
    id: z.string().uuid(),
    type: z.enum(['image', 'video', 'audio', 'embed']),
    url: z.string().url('Invalid media URL'),
    caption: z.string().optional(),
    metadata: z.record(z.any()),
    createdAt: z.string(),
    updatedAt: z.string(),
});

/**
 * Validate an album object against the schema
 * @param album Album object to validate
 * @returns Validated album or throws error
 */
export function validateAlbum(album: unknown): Album {
    return albumSchema.parse(album);
}

/**
 * Validate a track object against the schema
 * @param track Track object to validate
 * @returns Validated track or throws error
 */
export function validateTrack(track: unknown): Track {
    return trackSchema.parse(track);
}

/**
 * Validate an artist object against the schema
 * @param artist Artist object to validate
 * @returns Validated artist or throws error
 */
export function validateArtist(artist: unknown): Artist {
    return artistSchema.parse(artist);
}

/**
 * Validate a lyrics object against the schema
 * @param lyrics Lyrics object to validate
 * @returns Validated lyrics or throws error
 */
export function validateLyrics(lyrics: unknown): Lyrics {
    return lyricsSchema.parse(lyrics);
}

/**
 * Validate a user object against the schema
 * @param user User object to validate
 * @returns Validated user or throws error
 */
export function validateUser(user: unknown): User {
    return userSchema.parse(user);
}

/**
 * Validate a playlist object against the schema
 * @param playlist Playlist object to validate
 * @returns Validated playlist or throws error
 */
export function validatePlaylist(playlist: unknown): Playlist {
    return playlistSchema.parse(playlist);
}

/**
 * Validate a story chapter object against the schema
 * @param chapter StoryChapter object to validate
 * @returns Validated chapter or throws error
 */
export function validateStoryChapter(chapter: unknown): StoryChapter {
    return storyChapterSchema.parse(chapter);
}

/**
 * Validate a media element object against the schema
 * @param media MediaElement object to validate
 * @returns Validated media element or throws error
 */
export function validateMediaElement(media: unknown): MediaElement {
    return mediaElementSchema.parse(media);
}
