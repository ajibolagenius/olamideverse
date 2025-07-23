# OlamideVerse Technical Stack

## Core Technologies
- **Frontend Framework**: Next.js 15.4.3 with App Router
- **UI Library**: React 19.1.0
- **Styling**: TailwindCSS 4.x
- **TypeScript**: Strict typing throughout the codebase
- **Animation Libraries**: GSAP, Framer Motion, Three.js
- **Audio Processing**: Howler.js

## API Integrations
- **Music Services**:
  - Spotify API (albums, tracks, artists)
  - YouTube API (videos, playlists)
  - Genius API (lyrics, song information)
- **Data Management**: React Query for API state management and caching

## Development Tools
- **Package Manager**: npm
- **Linting**: ESLint 9.x with Next.js configuration
- **Git Hooks**: Husky for pre-commit validation
- **Build Tool**: Turbopack (Next.js integrated)

## Common Commands
```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Performance Considerations
- Use API caching strategies (implemented in `src/lib/api/music/cache.ts`)
- Optimize media loading with proper preloading techniques
- Implement code splitting for route-based components
- Minimize JavaScript bundle size for faster initial load

## Authentication
- Authentication is handled through the AuthProvider context
- User sessions should be properly managed and secured

## Analytics
- Analytics tracking is implemented through the AnalyticsContext
- Track user interactions with music content for insights
