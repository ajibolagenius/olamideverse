import type { Album, Track, Artist, Lyrics } from '@/types/models';

/**
 * Mock data for development purposes
 * This provides sample data for testing and development without requiring API calls
 */

// Mock Artists
export const mockArtists: Artist[] = [
    {
        id: '1',
        name: 'Olamide',
        imageUrl: 'https://example.com/olamide.jpg',
        bio: 'Olamide Adedeji, known mononymously as Olamide, is a Nigerian hip hop recording artist and record label owner.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Phyno',
        imageUrl: 'https://example.com/phyno.jpg',
        bio: 'Chibuzor Nelson Azubuike, better known by his stage name Phyno, is a Nigerian rapper, singer, songwriter and record producer.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '3',
        name: 'Wizkid',
        imageUrl: 'https://example.com/wizkid.jpg',
        bio: 'Ayodeji Ibrahim Balogun, known professionally as Wizkid, is a Nigerian singer and songwriter.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '4',
        name: 'Fireboy DML',
        imageUrl: 'https://example.com/fireboy.jpg',
        bio: 'Adedamola Adefolahan, known professionally as Fireboy DML, is a Nigerian singer and songwriter.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

// Mock Lyrics
export const mockLyrics: Lyrics[] = [
    {
        id: '1',
        trackId: '1',
        text: 'Baddo sneh, Olamide Baddo\nYou know say money good eh\nMoney good eh\nMoney good eh...',
        synced: [
            { text: 'Baddo sneh, Olamide Baddo', startTime: 0, endTime: 4 },
            { text: 'You know say money good eh', startTime: 4, endTime: 8 },
            { text: 'Money good eh', startTime: 8, endTime: 12 },
            { text: 'Money good eh...', startTime: 12, endTime: 16 },
        ],
        source: 'Genius',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        trackId: '2',
        text: 'Wo! Kosi wahala o\nKosi wahala o\nKosi wahala o\nKosi wahala o...',
        synced: [
            { text: 'Wo! Kosi wahala o', startTime: 0, endTime: 4 },
            { text: 'Kosi wahala o', startTime: 4, endTime: 8 },
            { text: 'Kosi wahala o', startTime: 8, endTime: 12 },
            { text: 'Kosi wahala o...', startTime: 12, endTime: 16 },
        ],
        source: 'Genius',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

// Mock Tracks
export const mockTracks: Track[] = [
    {
        id: '1',
        albumId: '1',
        title: 'Science Student',
        duration: 231,
        audioUrl: 'https://example.com/science-student.mp3',
        position: 1,
        lyrics: mockLyrics[0],
        features: [],
        metadata: {
            genre: ['Afrobeats', 'Hip-Hop'],
            mood: ['Energetic', 'Party'],
            producer: ['Young John'],
            spotifyId: 'spotify:track:123',
            youtubeId: 'youtube:123',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        albumId: '1',
        title: 'Wo!!',
        duration: 219,
        audioUrl: 'https://example.com/wo.mp3',
        position: 2,
        lyrics: mockLyrics[1],
        features: [],
        metadata: {
            genre: ['Afrobeats', 'Hip-Hop'],
            mood: ['Energetic', 'Street'],
            producer: ['Young John'],
            spotifyId: 'spotify:track:456',
            youtubeId: 'youtube:456',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '3',
        albumId: '1',
        title: 'Lagos Nawa',
        duration: 198,
        audioUrl: 'https://example.com/lagos-nawa.mp3',
        position: 3,
        features: [],
        metadata: {
            genre: ['Afrobeats', 'Hip-Hop'],
            mood: ['Chill', 'Reflective'],
            producer: ['Pheelz'],
            spotifyId: 'spotify:track:789',
            youtubeId: 'youtube:789',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '4',
        albumId: '2',
        title: 'Motigbana',
        duration: 224,
        audioUrl: 'https://example.com/motigbana.mp3',
        position: 1,
        features: [],
        metadata: {
            genre: ['Afrobeats', 'Hip-Hop'],
            mood: ['Energetic', 'Street'],
            producer: ['Pheelz'],
            spotifyId: 'spotify:track:101112',
            youtubeId: 'youtube:101112',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '5',
        albumId: '2',
        title: 'Bugle',
        duration: 212,
        audioUrl: 'https://example.com/bugle.mp3',
        position: 2,
        features: [mockArtists[1]],
        metadata: {
            genre: ['Afrobeats', 'Hip-Hop'],
            mood: ['Energetic', 'Hype'],
            producer: ['Pheelz'],
            spotifyId: 'spotify:track:131415',
            youtubeId: 'youtube:131415',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

// Mock Albums
export const mockAlbums: Album[] = [
    {
        id: '1',
        title: 'Lagos Nawa',
        releaseDate: '2017-11-17',
        coverArtUrl: 'https://example.com/lagos-nawa.jpg',
        description: 'Lagos Nawa is the seventh studio album by Nigerian rapper Olamide. It was released on November 17, 2017.',
        tracks: mockTracks.filter(track => track.albumId === '1'),
        metadata: {
            genre: ['Afrobeats', 'Hip-Hop'],
            mood: ['Energetic', 'Street'],
            era: '2017',
            producer: ['Young John', 'Pheelz'],
            recordLabel: 'YBNL Nation',
            spotifyId: 'spotify:album:123',
            youtubeId: 'youtube:playlist:123',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        title: 'YBNL',
        releaseDate: '2012-11-12',
        coverArtUrl: 'https://example.com/ybnl.jpg',
        description: 'YBNL is the second studio album by Nigerian rapper Olamide. It was released on November 12, 2012.',
        tracks: mockTracks.filter(track => track.albumId === '2'),
        metadata: {
            genre: ['Afrobeats', 'Hip-Hop'],
            mood: ['Energetic', 'Street'],
            era: '2012',
            producer: ['Pheelz', 'ID Cabasa'],
            recordLabel: 'YBNL Nation',
            spotifyId: 'spotify:album:456',
            youtubeId: 'youtube:playlist:456',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '3',
        title: 'Carpe Diem',
        releaseDate: '2020-10-08',
        coverArtUrl: 'https://example.com/carpe-diem.jpg',
        description: 'Carpe Diem is the eleventh studio album by Nigerian rapper Olamide. It was released on October 8, 2020.',
        tracks: [],
        metadata: {
            genre: ['Afrobeats', 'Hip-Hop', 'Afro-fusion'],
            mood: ['Chill', 'Reflective', 'Party'],
            era: '2020',
            producer: ['Pheelz', 'P.Prime', 'ID Cabasa', 'VStix'],
            recordLabel: 'YBNL Nation/Empire',
            spotifyId: 'spotify:album:789',
            youtubeId: 'youtube:playlist:789',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

/**
 * Get all mock albums
 * @returns Array of mock albums
 */
export function getMockAlbums(): Album[] {
    return mockAlbums;
}

/**
 * Get a mock album by ID
 * @param id Album ID
 * @returns Album or undefined if not found
 */
export function getMockAlbumById(id: string): Album | undefined {
    return mockAlbums.find(album => album.id === id);
}

/**
 * Get all mock tracks
 * @returns Array of mock tracks
 */
export function getMockTracks(): Track[] {
    return mockTracks;
}

/**
 * Get a mock track by ID
 * @param id Track ID
 * @returns Track or undefined if not found
 */
export function getMockTrackById(id: string): Track | undefined {
    return mockTracks.find(track => track.id === id);
}

/**
 * Get all mock artists
 * @returns Array of mock artists
 */
export function getMockArtists(): Artist[] {
    return mockArtists;
}

/**
 * Get a mock artist by ID
 * @param id Artist ID
 * @returns Artist or undefined if not found
 */
export function getMockArtistById(id: string): Artist | undefined {
    return mockArtists.find(artist => artist.id === id);
}
