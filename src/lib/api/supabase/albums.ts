import { supabase, handleSupabaseError } from './client';
import type { Album, Track } from '@/types/models';
import { validateAlbum } from '@/lib/validation/modelValidation';

/**
 * Type for Supabase album row
 */
interface SupabaseAlbumRow {
    id: string;
    title: string;
    release_date: string;
    cover_art_url: string;
    description: string;
    metadata?: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

/**
 * Convert Supabase album row to Album model
 * @param albumRow Album row from Supabase
 * @param tracks Optional tracks to include with the album
 * @returns Album model
 */
function mapAlbumRowToModel(albumRow: SupabaseAlbumRow, tracks: Track[] = []): Album {
    return {
        id: albumRow.id,
        title: albumRow.title,
        releaseDate: albumRow.release_date,
        coverArtUrl: albumRow.cover_art_url,
        description: albumRow.description,
        tracks: tracks,
        metadata: albumRow.metadata || {},
        createdAt: albumRow.created_at,
        updatedAt: albumRow.updated_at,
    };
}

/**
 * Get all albums from the database
 * @returns Promise resolving to an array of albums
 */
export async function getAlbums(): Promise<Album[]> {
    try {
        const { data: albumRows, error } = await supabase
            .from('albums')
            .select('*')
            .order('release_date', { ascending: false });

        if (error) {
            throw handleSupabaseError(error, 'Failed to fetch albums');
        }

        // Map the album rows to Album models (without tracks for now)
        const albums = albumRows.map(row => mapAlbumRowToModel(row));

        return albums;
    } catch (error) {
        console.error('Error fetching albums:', error);
        throw error;
    }
}

/**
 * Get an album by ID, including its tracks
 * @param id Album ID
 * @returns Promise resolving to an album with tracks
 */
export async function getAlbumById(id: string): Promise<Album | null> {
    try {
        // Fetch the album
        const { data: albumRow, error: albumError } = await supabase
            .from('albums')
            .select('*')
            .eq('id', id)
            .single();

        if (albumError) {
            throw handleSupabaseError(albumError, 'Failed to fetch album');
        }

        if (!albumRow) {
            return null;
        }

        // Fetch the album's tracks
        const { data: trackRows, error: tracksError } = await supabase
            .from('tracks')
            .select(`
        *,
        lyrics (*)
      `)
            .eq('album_id', id)
            .order('position');

        if (tracksError) {
            throw handleSupabaseError(tracksError, 'Failed to fetch album tracks');
        }

        // Define type for track row with lyrics
        interface SupabaseTrackRow {
            id: string;
            album_id: string;
            title: string;
            duration: number;
            audio_url: string;
            position: number;
            metadata: Record<string, unknown>;
            created_at: string;
            updated_at: string;
            lyrics?: {
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
        }

        // Map track rows to Track models
        const tracks: Track[] = trackRows.map((row: SupabaseTrackRow) => ({
            id: row.id,
            albumId: row.album_id,
            title: row.title,
            duration: row.duration,
            audioUrl: row.audio_url,
            position: row.position,
            lyrics: row.lyrics ? {
                id: row.lyrics.id,
                trackId: row.lyrics.track_id,
                text: row.lyrics.text,
                synced: (row.lyrics.synced_lyrics || []).map((line: { text: string; start_time: number; end_time: number }) => ({
                    text: line.text,
                    startTime: line.start_time,
                    endTime: line.end_time,
                })),
                source: row.lyrics.source,
                createdAt: row.lyrics.created_at,
                updatedAt: row.lyrics.updated_at,
            } : undefined,
            features: [], // We'll fetch these separately if needed
            metadata: row.metadata || {},
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        }));

        // Create the album with tracks
        const album = mapAlbumRowToModel(albumRow, tracks);

        // Validate the album before returning
        return validateAlbum(album);
    } catch (error) {
        console.error(`Error fetching album with ID ${id}:`, error);
        throw error;
    }
}

/**
 * Create a new album in the database
 * @param album Album to create
 * @returns Promise resolving to the created album
 */
export async function createAlbum(album: Omit<Album, 'id' | 'createdAt' | 'updatedAt'>): Promise<Album> {
    try {
        const now = new Date().toISOString();

        // Prepare the album data for insertion
        const albumData = {
            title: album.title,
            release_date: album.releaseDate,
            cover_art_url: album.coverArtUrl,
            description: album.description,
            metadata: album.metadata,
            created_at: now,
            updated_at: now,
        };

        // Insert the album
        const { data: createdAlbum, error } = await supabase
            .from('albums')
            .insert(albumData)
            .select()
            .single();

        if (error) {
            throw handleSupabaseError(error, 'Failed to create album');
        }

        // Return the created album (without tracks)
        return mapAlbumRowToModel(createdAlbum);
    } catch (error) {
        console.error('Error creating album:', error);
        throw error;
    }
}

/**
 * Update an existing album in the database
 * @param id Album ID
 * @param album Album data to update
 * @returns Promise resolving to the updated album
 */
export async function updateAlbum(id: string, album: Partial<Album>): Promise<Album> {
    try {
        // Prepare the album data for update
        const albumData: {
            updated_at: string;
            title?: string;
            release_date?: string;
            cover_art_url?: string;
            description?: string;
            metadata?: Record<string, unknown>;
        } = {
            updated_at: new Date().toISOString(),
        };

        if (album.title !== undefined) albumData.title = album.title;
        if (album.releaseDate !== undefined) albumData.release_date = album.releaseDate;
        if (album.coverArtUrl !== undefined) albumData.cover_art_url = album.coverArtUrl;
        if (album.description !== undefined) albumData.description = album.description;
        if (album.metadata !== undefined) albumData.metadata = album.metadata;

        // Update the album
        const { data: updatedAlbum, error } = await supabase
            .from('albums')
            .update(albumData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw handleSupabaseError(error, 'Failed to update album');
        }

        // Return the updated album (without tracks)
        return mapAlbumRowToModel(updatedAlbum);
    } catch (error) {
        console.error(`Error updating album with ID ${id}:`, error);
        throw error;
    }
}

/**
 * Delete an album from the database
 * @param id Album ID
 * @returns Promise resolving to true if successful
 */
export async function deleteAlbum(id: string): Promise<boolean> {
    try {
        // Delete the album
        const { error } = await supabase
            .from('albums')
            .delete()
            .eq('id', id);

        if (error) {
            throw handleSupabaseError(error, 'Failed to delete album');
        }

        return true;
    } catch (error) {
        console.error(`Error deleting album with ID ${id}:`, error);
        throw error;
    }
}
