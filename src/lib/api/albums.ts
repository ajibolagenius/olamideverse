/**
 * API functions for album-related data
 */

import { Album, Track } from '@/types/models';

// Mock album data for development
const mockAlbums: Album[] = [
  {
    id: 'ybnl-mafia-family',
    title: 'YBNL Mafia Family',
    releaseDate: '2012-11-12',
    coverArtUrl: '/images/albums/ybnl-mafia-family.jpg',
    description: 'Olamide\'s debut studio album that established YBNL as a major force in Nigerian hip-hop.',
    tracks: [
      {
        id: 'track-1',
        albumId: 'ybnl-mafia-family',
        title: 'Eni Duro',
        duration: 210,
        audioUrl: '/audio/eni-duro.mp3',
        position: 1,
        features: [],
        metadata: {
          producer: ['Pheelz'],
          genre: ['Afrorap'],
          language: 'Yoruba/English'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'track-2',
        albumId: 'ybnl-mafia-family',
        title: 'Voice of the Street',
        duration: 195,
        audioUrl: '/audio/voice-of-the-street.mp3',
        position: 2,
        features: [],
        metadata: {
          producer: ['Pheelz'],
          genre: ['Afrorap'],
          language: 'Yoruba/English'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ],
    metadata: {
      genre: ['Afrorap'],
      recordLabel: 'Coded Tunes',
      totalTracks: 15,
      totalDuration: 3240,
      language: 'Yoruba/English',
      credits: {
        producer: ['Pheelz'],
        executiveProducer: ['Olamide'],
        mixedBy: ['Pheelz'],
        masteredBy: ['Pheelz']
      }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'baddest-guy-ever-liveth',
    title: 'Baddest Guy Ever Liveth',
    releaseDate: '2013-11-07',
    coverArtUrl: '/images/albums/baddest-guy-ever-liveth.jpg',
    description: 'Olamide\'s sophomore album showcasing his evolution as an artist and his versatility.',
    tracks: [],
    metadata: {
      genre: ['Afrorap'],
      recordLabel: 'YBNL Nation',
      totalTracks: 21,
      totalDuration: 4320,
      language: 'Yoruba/English',
      credits: {
        producer: ['Pheelz', 'Young John'],
        executiveProducer: ['Olamide'],
        mixedBy: ['Pheelz'],
        masteredBy: ['Pheelz']
      }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Fetch all albums
 */
export async function getAllAlbums(): Promise<Album[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockAlbums;
}

/**
 * Fetch a specific album by ID
 */
export async function getAlbumById(albumId: string): Promise<Album | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const album = mockAlbums.find(album => album.id === albumId);
  return album || null;
}

/**
 * Search albums by title
 */
export async function searchAlbums(query: string): Promise<Album[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return mockAlbums.filter(album => 
    album.title.toLowerCase().includes(query.toLowerCase()) ||
    album.description.toLowerCase().includes(query.toLowerCase())
  );
}

/**
 * Get albums by release year
 */
export async function getAlbumsByYear(year: number): Promise<Album[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockAlbums.filter(album => 
    new Date(album.releaseDate).getFullYear() === year
  );
}

/**
 * Get albums that have story mode content
 */
export async function getAlbumsWithStories(): Promise<Album[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // For now, return all albums - in production, this would check for story chapters
  return mockAlbums;
}

/**
 * Create a new album
 */
export async function createAlbum(album: Omit<Album, 'id' | 'createdAt' | 'updatedAt'>): Promise<Album> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newAlbum: Album = {
    ...album,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockAlbums.push(newAlbum);
  return newAlbum;
}

/**
 * Update an existing album
 */
export async function updateAlbum(albumId: string, updates: Partial<Album>): Promise<Album | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const albumIndex = mockAlbums.findIndex(album => album.id === albumId);
  if (albumIndex === -1) return null;
  
  const updatedAlbum = {
    ...mockAlbums[albumIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  mockAlbums[albumIndex] = updatedAlbum;
  return updatedAlbum;
}

/**
 * Delete an album
 */
export async function deleteAlbum(albumId: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const albumIndex = mockAlbums.findIndex(album => album.id === albumId);
  if (albumIndex === -1) return false;
  
  mockAlbums.splice(albumIndex, 1);
  return true;
}
