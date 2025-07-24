# AGENT.md - OlamideVerse Codebase Guide

## Build/Lint/Test Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run lint` - ESLint for code issues
- `npm run lint:a11y` - Accessibility-specific linting
- `npm run test` - Run all Jest tests
- `npm run test:watch` - Run Jest in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run test:a11y` - Run accessibility tests only
- `npm run format` - Format code with Prettier

## Architecture & Structure
- **Next.js 15 app** with React 18, TypeScript, Tailwind CSS
- **App Router**: `/src/app` - pages and layouts using Next.js 13+ structure
- **Components**: `/src/components/{ui,layout,player,story}` - organized by feature
- **Backend**: Supabase for data storage and APIs
- **Content**: `/content` - MDX files for albums/stories, `/data` for structured data
- **Animation**: GSAP, Three.js, Framer Motion for immersive experiences
- **Audio**: Howler.js for music playback, Konva.js for canvas interactions

## Code Style & Conventions
- **Components**: Start with `'use client';`, use PascalCase names, TypeScript interfaces end with `Props`
- **Files**: Match component names exactly (`AlbumCard.tsx`)
- **Imports**: React first, Next.js, third-party, then internal (hooks, context, components, lib, types)
- **Path aliases**: `@/*` maps to `src/*`
- **Formatting**: Prettier config - single quotes, 2 spaces, trailing commas, 80 char width
- **Accessibility**: Required - ARIA labels, semantic HTML, keyboard navigation
- **Error handling**: Use proper TypeScript types, handle loading/error states
