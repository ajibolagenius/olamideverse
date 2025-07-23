# OlamideVerse Project Structure

## Directory Organization

### `/src` - Application Source Code
- **`/app`**: Next.js App Router pages and layouts
  - Root layout and page components
  - Global CSS styles

- **`/components`**: Reusable React components
  - `/player`: Music player components
  - `/story`: Story mode presentation components

- **`/context`**: React context providers
  - `AppContext.tsx`: Main application context wrapper
  - `QueryContext.tsx`: React Query provider setup
  - `AuthContext.tsx`: Authentication state management
  - `AnalyticsContext.tsx`: Analytics tracking

- **`/hooks`**: Custom React hooks
  - `useMusicApi.ts`: Hooks for music API integration
  - `usePlayer.ts`: Player state and control hooks

- **`/lib`**: Core utilities and services
  - `/animations`: Animation utilities
  - `/api`: API client implementations
    - `/music`: Music service integrations
      - `/spotify`: Spotify API client
      - `/genius`: Genius API client
      - `/youtube`: YouTube API client
  - `/helpers`: Utility functions
  - `/player`: Player implementation (Howler.js)

- **`/styles`**: Global styles and theme definitions

### `/content` - Content Management
- **`/albums`**: Album metadata and descriptions
- **`/artists`**: Artist information
- **`/stories`**: Story mode content in MDX format

### `/public` - Static Assets
- **`/fonts`**: Custom font files
- **`/icons`**: UI icons and SVGs
- **`/images`**: Static images

### `/data` - Documentation and Data
- **`/doc`**: Project documentation

## Code Organization Patterns

### Component Structure
- Components should be organized in their own directories with index files
- Each component directory may include:
  - Main component file
  - Associated styles
  - Unit tests
  - Type definitions

### API Integration Pattern
- API clients are isolated by service provider
- Unified through the `musicService.ts` facade
- Caching layer implemented in `cache.ts`

### State Management
- React Context for global state
- React Query for server state
- Local component state for UI-specific state

### File Naming Conventions
- React components: PascalCase (e.g., `AlbumCard.tsx`)
- Hooks: camelCase with 'use' prefix (e.g., `usePlayer.ts`)
- Utilities: camelCase (e.g., `formatDuration.ts`)
- Context providers: PascalCase with 'Context' suffix (e.g., `PlayerContext.tsx`)
