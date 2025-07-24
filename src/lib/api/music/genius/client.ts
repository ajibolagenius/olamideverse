import { apiCache } from '../cache';

interface GeniusSong {
    id: string;
    title: string;
    url: string;
    path: string;
}

interface GeniusLyrics {
    lyrics: string;
    syncedLyrics: Array<{
        text: string;
        startTime: number;
        endTime: number;
    }>;
}

class GeniusClient {
    private apiKey: string | null = null;

    constructor() {
        // In a real implementation, we would load the API key from environment variables
        this.apiKey = process.env.GENIUS_API_KEY || '';
    }

    private async fetch(url: string, options: RequestInit = {}): Promise<Response> {
        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${this.apiKey}`,
            },
        });
    }

    public async searchSong(title: string, artist: string): Promise<GeniusSong> {
        const cacheKey = `genius:search:${artist}:${title}`;

        return apiCache.getOrSet<GeniusSong>(cacheKey, async () => {
            // In a real implementation, we would fetch from Genius API
            // For now, we'll just return mock data
            return {
                id: 'genius-song-id',
                title: title,
                url: `https://genius.com/${artist.replace(' ', '-')}-${title.replace(' ', '-')}-lyrics`,
                path: `/${artist.replace(' ', '-')}-${title.replace(' ', '-')}-lyrics`,
            };
        });
    }

    public async getLyrics(songId: string): Promise<GeniusLyrics> {
        const cacheKey = `genius:lyrics:${songId}`;

        return apiCache.getOrSet<GeniusLyrics>(cacheKey, async () => {
            // In a real implementation, we would fetch from Genius API and scrape the lyrics
            // For now, we'll return enhanced mock data with proper Olamide lyrics structure
            return {
                lyrics: `[Intro]
Baddo, YBNL
Lagos to the world

[Verse 1]
Started from the bottom now we here
Every day we hustle, make it clear
From Bariga to the world stage
Writing history, turn the page

[Pre-Chorus]
They said we couldn't make it
Now they see we made it
From the streets to the top
Never gonna stop

[Chorus]
We rise up, we shine bright
Every day and every night
Lagos boy with the flow
Let the whole world know

[Verse 2]
Money coming, blessings flowing
Keep the hustle, keep it going
Family first, that's the code
Walking down this golden road

[Bridge]
Olamide, Baddo Sneh
YBNL, we no dey play
Indigenous rap, we lead the way
Nigeria to the world today

[Outro]
Baddo, YBNL
Lagos to the world
We made it!`,
                syncedLyrics: [
                    { text: '[Intro]', startTime: 0, endTime: 2 },
                    { text: 'Baddo, YBNL', startTime: 2, endTime: 4 },
                    { text: 'Lagos to the world', startTime: 4, endTime: 6 },
                    { text: '', startTime: 6, endTime: 8 },
                    { text: '[Verse 1]', startTime: 8, endTime: 10 },
                    { text: 'Started from the bottom now we here', startTime: 10, endTime: 14 },
                    { text: 'Every day we hustle, make it clear', startTime: 14, endTime: 18 },
                    { text: 'From Bariga to the world stage', startTime: 18, endTime: 22 },
                    { text: 'Writing history, turn the page', startTime: 22, endTime: 26 },
                    { text: '', startTime: 26, endTime: 28 },
                    { text: '[Pre-Chorus]', startTime: 28, endTime: 30 },
                    { text: 'They said we couldn\'t make it', startTime: 30, endTime: 34 },
                    { text: 'Now they see we made it', startTime: 34, endTime: 38 },
                    { text: 'From the streets to the top', startTime: 38, endTime: 42 },
                    { text: 'Never gonna stop', startTime: 42, endTime: 46 },
                    { text: '', startTime: 46, endTime: 48 },
                    { text: '[Chorus]', startTime: 48, endTime: 50 },
                    { text: 'We rise up, we shine bright', startTime: 50, endTime: 54 },
                    { text: 'Every day and every night', startTime: 54, endTime: 58 },
                    { text: 'Lagos boy with the flow', startTime: 58, endTime: 62 },
                    { text: 'Let the whole world know', startTime: 62, endTime: 66 },
                    { text: '', startTime: 66, endTime: 68 },
                    { text: '[Verse 2]', startTime: 68, endTime: 70 },
                    { text: 'Money coming, blessings flowing', startTime: 70, endTime: 74 },
                    { text: 'Keep the hustle, keep it going', startTime: 74, endTime: 78 },
                    { text: 'Family first, that\'s the code', startTime: 78, endTime: 82 },
                    { text: 'Walking down this golden road', startTime: 82, endTime: 86 },
                    { text: '', startTime: 86, endTime: 88 },
                    { text: '[Bridge]', startTime: 88, endTime: 90 },
                    { text: 'Olamide, Baddo Sneh', startTime: 90, endTime: 94 },
                    { text: 'YBNL, we no dey play', startTime: 94, endTime: 98 },
                    { text: 'Indigenous rap, we lead the way', startTime: 98, endTime: 102 },
                    { text: 'Nigeria to the world today', startTime: 102, endTime: 106 },
                    { text: '', startTime: 106, endTime: 108 },
                    { text: '[Outro]', startTime: 108, endTime: 110 },
                    { text: 'Baddo, YBNL', startTime: 110, endTime: 112 },
                    { text: 'Lagos to the world', startTime: 112, endTime: 114 },
                    { text: 'We made it!', startTime: 114, endTime: 116 },
                ],
            };
        });
    }
}

// Export a singleton instance
export const geniusClient = new GeniusClient();
