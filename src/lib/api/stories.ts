/**
 * API functions for story-related data
 */

import { StoryChapter, MediaElement } from '@/types/models';

// Mock data for development - replace with actual API calls later
const mockStoryChapters: StoryChapter[] = [
  {
    id: '1',
    title: 'Origins and Inspiration',
    content: `
# The Beginning

<AlbumCard 
  title="YBNL Mafia Family" 
  releaseDate="2012" 
  description="Olamide's debut studio album that introduced the world to YBNL and established him as a force in Nigerian hip-hop."
/>

The story of **YBNL Mafia Family** begins in the streets of Bariga, Lagos, where a young Olamide Adedeji was crafting his unique sound that would revolutionize Nigerian rap music.

<Quote author="Olamide">
"I wanted to create something that spoke to my people, something that represented where I come from and what I believe in."
</Quote>

## The Creative Process

<TrackHighlight title="Eni Duro">
This breakout single became the anthem that launched Olamide's career, showcasing his ability to blend Yoruba lyrics with contemporary beats.
</TrackHighlight>

The album was recorded primarily at Coded Tunes studio in Lagos, with Olamide working closely with producer Pheelz to create a sound that was authentically Nigerian yet globally appealing.

<Timeline>
  <TimelineEvent date="2010">
    Olamide begins writing songs that would later appear on YBNL Mafia Family
  </TimelineEvent>
  <TimelineEvent date="2011">
    Signs with Coded Tunes and begins serious studio work
  </TimelineEvent>
  <TimelineEvent date="2012">
    Album released to critical and commercial success
  </TimelineEvent>
</Timeline>
    `,
    relatedAlbumId: 'ybnl-mafia-family',
    position: 1,
    media: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Cultural Impact and Legacy',
    content: `
# Breaking Barriers

The release of **YBNL Mafia Family** marked a pivotal moment in Nigerian music history. It wasn't just an album; it was a cultural statement that proved indigenous rap could compete on the global stage.

<AlbumOrigin 
  title="The Street Revolution"
  influences={["Fela Kuti", "2Pac", "Lagbaja", "Eedris Abdulkareem"]}
  productionNotes="Recorded at Coded Tunes with a budget of ₦2 million, the album was crafted to capture the raw energy of Lagos streets while maintaining commercial appeal."
>
The album emerged from Olamide's deep connection to his Bariga roots and his desire to represent the authentic voice of Nigerian youth. Drawing inspiration from Afrobeat legends and international hip-hop, he created a unique sound that resonated across cultural boundaries.
</AlbumOrigin>

## Street Credibility

<Quote author="Music Critic">
"Olamide brought something fresh to the table - raw, unfiltered stories from the streets, delivered with a confidence that was infectious."
</Quote>

<FeaturedArtist 
  name="Pheelz" 
  role="Producer & Co-writer"
  bio="Philip Kayode Moses, known professionally as Pheelz, was the primary architect behind the album's distinctive sound."
>
Pheelz's innovative production style, blending traditional Yoruba percussion with modern trap elements, created the sonic foundation that would define the YBNL sound for years to come. His collaboration with Olamide on this album established him as one of Nigeria's most sought-after producers.
</FeaturedArtist>

The album's success paved the way for a new generation of Nigerian rappers who weren't afraid to rap in their native languages.

## Commercial Success & Lyrical Depth

<LyricNote 
  line="Eni duro de'se gboju e ka, Won wa dupe si baba"
  interpretation="Those who stand and wait patiently, they will give thanks to God"
  context="This line from the hit single 'Eni Duro' reflects Olamide's philosophy of patience and perseverance, themes that resonate deeply with his fanbase who often face economic hardships."
/>

- **Chart Performance**: Reached #1 on multiple Nigerian music charts
- **Sales**: Over 100,000 copies sold in the first month
- **Awards**: Multiple nominations at The Headies and other prestigious awards

<TrackHighlight title="Voice of the Street">
This track became an anthem for young Nigerians who felt marginalized by mainstream society, giving them a voice and representation in popular culture. The song's hook became a rallying cry for street credibility and authentic expression.
</TrackHighlight>

<FeaturedArtist 
  name="Lil Kesh" 
  role="Protégé & Background Vocals"
  bio="Keshinro Ololade, discovered by Olamide during the album's creation, provided backing vocals and energy."
>
Though still upcoming at the time, Lil Kesh's presence on the album foreshadowed his future success and demonstrated Olamide's ability to spot and nurture talent.
</FeaturedArtist>

The album established YBNL as more than just a record label - it became a movement that championed authenticity and cultural pride in Nigerian music.

## Visual Journey: Behind the Scenes

<MediaGallery 
  title="Studio Sessions & Album Creation"
  images={[
    {
      src: "/images/stories/ybnl-studio-1.jpg",
      alt: "Olamide recording in Coded Tunes studio",
      caption: "Olamide laying down vocals for 'Eni Duro' at Coded Tunes studio in Lagos"
    },
    {
      src: "/images/stories/ybnl-studio-2.jpg", 
      alt: "Pheelz producing beats",
      caption: "Producer Pheelz crafting the distinctive beats that would define the YBNL sound"
    },
    {
      src: "/images/stories/ybnl-cover-shoot.jpg",
      alt: "Album cover photoshoot",
      caption: "Behind-the-scenes from the iconic YBNL Mafia Family album cover shoot"
    }
  ]}
  aspectRatio="16:9"
/>

<StoryVideo 
  src="/videos/stories/ybnl-documentary.mp4"
  poster="/images/stories/ybnl-doc-poster.jpg"
  caption="Exclusive documentary footage showing the making of YBNL Mafia Family"
/>

## Digital Impact & Music Videos

<StoryEmbed 
  url="https://www.youtube.com/watch?v=yqhVOeAYxuc"
  type="youtube"
  title="Eni Duro - Official Music Video"
  caption="The official music video for 'Eni Duro' that launched Olamide's career"
/>

<MediaGallery 
  title="Music Video Production"
  videos={[
    {
      src: "/videos/stories/eni-duro-bts.mp4",
      poster: "/images/stories/eni-duro-bts.jpg",
      caption: "Behind-the-scenes footage from the 'Eni Duro' music video shoot"
    }
  ]}
  embeds={[
    {
      url: "https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC",
      type: "spotify",
      title: "Voice of the Street - Spotify",
      caption: "Stream the track that became an anthem for Nigerian youth"
    }
  ]}
/>
    `,
    relatedAlbumId: 'ybnl-mafia-family',
    position: 2,
    media: [
      {
        id: 'media-1',
        type: 'image',
        url: '/images/stories/ybnl-studio-1.jpg',
        caption: 'Olamide recording in Coded Tunes studio',
        metadata: { alt: 'Olamide recording in studio' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'media-2',
        type: 'video',
        url: '/videos/stories/ybnl-documentary.mp4',
        caption: 'Making of YBNL Mafia Family documentary',
        metadata: { poster: '/images/stories/ybnl-doc-poster.jpg' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'media-3',
        type: 'embed',
        url: 'https://www.youtube.com/watch?v=yqhVOeAYxuc',
        caption: 'Eni Duro - Official Music Video',
        metadata: { embedType: 'youtube', title: 'Eni Duro Music Video' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

/**
 * Fetch story chapters for a specific album
 */
export async function getStoryChaptersByAlbum(albumId: string): Promise<StoryChapter[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // For now, return mock data for any album
  // In production, this would fetch from Supabase based on albumId
  return mockStoryChapters.filter(chapter => 
    chapter.relatedAlbumId === albumId || 
    chapter.relatedAlbumId === 'ybnl-mafia-family' // Default for demo
  );
}

/**
 * Fetch a specific story chapter by ID
 */
export async function getStoryChapterById(chapterId: string): Promise<StoryChapter | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const chapter = mockStoryChapters.find(chapter => chapter.id === chapterId);
  return chapter || null;
}

/**
 * Fetch all available story chapters
 */
export async function getAllStoryChapters(): Promise<StoryChapter[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockStoryChapters;
}

/**
 * Create a new story chapter
 */
export async function createStoryChapter(chapter: Omit<StoryChapter, 'id' | 'createdAt' | 'updatedAt'>): Promise<StoryChapter> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newChapter: StoryChapter = {
    ...chapter,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockStoryChapters.push(newChapter);
  return newChapter;
}

/**
 * Update an existing story chapter
 */
export async function updateStoryChapter(chapterId: string, updates: Partial<StoryChapter>): Promise<StoryChapter | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const chapterIndex = mockStoryChapters.findIndex(chapter => chapter.id === chapterId);
  if (chapterIndex === -1) return null;
  
  const updatedChapter = {
    ...mockStoryChapters[chapterIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  mockStoryChapters[chapterIndex] = updatedChapter;
  return updatedChapter;
}

/**
 * Delete a story chapter
 */
export async function deleteStoryChapter(chapterId: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const chapterIndex = mockStoryChapters.findIndex(chapter => chapter.id === chapterId);
  if (chapterIndex === -1) return false;
  
  mockStoryChapters.splice(chapterIndex, 1);
  return true;
}

/**
 * Get media elements for a chapter
 */
export async function getChapterMedia(chapterId: string): Promise<MediaElement[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return empty array for now - implement media fetching later
  return [];
}
