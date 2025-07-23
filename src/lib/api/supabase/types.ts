/**
 * Supabase database types
 * These types represent the structure of the Supabase database tables
 */
export type Database = {
    public: {
        Tables: {
            albums: {
                Row: {
                    id: string;
                    title: string;
                    release_date: string;
                    cover_art_url: string;
                    description: string;
                    metadata: Record<string, any>;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    release_date: string;
                    cover_art_url: string;
                    description: string;
                    metadata?: Record<string, any>;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    release_date?: string;
                    cover_art_url?: string;
                    description?: string;
                    metadata?: Record<string, any>;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            tracks: {
                Row: {
                    id: string;
                    album_id: string;
                    title: string;
                    duration: number;
                    audio_url: string;
                    lyrics_id: string | null;
                    position: number;
                    metadata: Record<string, any>;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    album_id:
                    title: string;
                    duration: number;
                    audio_url: string;
                    lyrics_id?: string | null;
                    position: number;
                    metadata?: Record<string, any>;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    album_id?: string;
                    title?: string;
                    duration?: number;
                    audio_url?: string;
                    lyrics_id?: string | null;
                    position?: number;
                    metadata?: Record<string, any>;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            lyrics: {
                Row: {
                    id: string;
                    track_id: string;
                    text: string;
                    synced_lyrics: Array<{
                        text: string;
                        start_time: number;
                        end_time: number;
                    }>;
                    source: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    track_id: string;
                    text: string;
                    synced_lyrics?: Array<{
                        text: string;
                        start_time: number;
                        end_time: number;
                    }>;
                    source: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    track_id?: string;
                    text?: string;
                    synced_lyrics?: Array<{
                        text: string;
                        start_time: number;
                        end_time: number;
                    }>;
                    source?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            artists: {
                Row: {
                    id: string;
                    name: string;
                    image_url: string | null;
                    bio: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    image_url?: string | null;
                    bio?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    image_url?: string | null;
                    bio?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            track_artists: {
                Row: {
                    track_id: string;
                    artist_id: string;
                    role: 'primary' | 'feature' | 'producer';
                };
                Insert: {
                    track_id: string;
                    artist_id: string;
                    role: 'primary' | 'feature' | 'producer';
                };
                Update: {
                    track_id?: string;
                    artist_id?: string;
                    role?: 'primary' | 'feature' | 'producer';
                };
            };
            users: {
                Row: {
                    id: string;
                    email: string;
                    username: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    email: string;
                    username: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    username?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            user_preferences: {
                Row: {
                    user_id: string;
                    theme: 'light' | 'dark' | 'system';
                    language: string;
                    playback_quality: 'low' | 'medium' | 'high' | 'auto';
                    notifications_enabled: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    user_id: string;
                    theme?: 'light' | 'dark' | 'system';
                    language?: string;
                    playback_quality?: 'low' | 'medium' | 'high' | 'auto';
                    notifications_enabled?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    user_id?: string;
                    theme?: 'light' | 'dark' | 'system';
                    language?: string;
                    playback_quality?: 'low' | 'medium' | 'high' | 'auto';
                    notifications_enabled?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            playlists: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    description: string | null;
                    is_public: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    description?: string | null;
                    is_public?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    name?: string;
                    description?: string | null;
                    is_public?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            playlist_tracks: {
                Row: {
                    playlist_id: string;
                    track_id: string;
                    position: number;
                };
                Insert: {
                    playlist_id: string;
                    track_id: string;
                    position: number;
                };
                Update: {
                    playlist_id?: string;
                    track_id?: string;
                    position?: number;
                };
            };
            story_chapters: {
                Row: {
                    id: string;
                    title: string;
                    content: string;
                    related_album_id: string | null;
                    position: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    content: string;
                    related_album_id?: string | null;
                    position: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    content?: string;
                    related_album_id?: string | null;
                    position?: number;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            media: {
                Row: {
                    id: string;
                    type: 'image' | 'video' | 'audio' | 'embed';
                    url: string;
                    caption: string | null;
                    metadata: Record<string, any>;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    type: 'image' | 'video' | 'audio' | 'embed';
                    url: string;
                    caption?: string | null;
                    metadata?: Record<string, any>;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    type?: 'image' | 'video' | 'audio' | 'embed';
                    url?: string;
                    caption?: string | null;
                    metadata?: Record<string, any>;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            chapter_media: {
                Row: {
                    chapter_id: string;
                    media_id: string;
                    position: number;
                };
                Insert: {
                    chapter_id: string;
                    media_id: string;
                    position: number;
                };
                Update: {
                    chapter_id?: string;
                    media_id?: string;
                    position?: number;
                };
            };
            analytics_events: {
                Row: {
                    id: string;
                    user_id: string | null;
                    event_type: string;
                    event_data: Record<string, any>;
                    created_at: string;
                    session_id: string;
                    page_url: string;
                };
                Insert: {
                    id?: string;
                    user_id?: string | null;
                    event_type: string;
                    event_data?: Record<string, any>;
                    created_at?: string;
                    session_id: string;
                    page_url: string;
                };
                Update: {
                    id?: string;
                    user_id?: string | null;
                    event_type?: string;
                    event_data?: Record<string, any>;
                    created_at?: string;
                    session_id?: string;
                    page_url?: string;
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
    };
};
