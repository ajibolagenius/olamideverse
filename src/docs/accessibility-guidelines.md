# Accessibility Guidelines for OlamideVerse

## Overview

This document outlines accessibility standards and best practices for the OlamideVerse project. Following these guidelines ensures our platform is usable by people with various disabilities and meets WCAG 2.1 AA compliance.

## General Principles

### 1. Semantic HTML

- Use appropriate HTML elements for their intended purpose
- Maintain proper heading hierarchy (h1 → h2 → h3)
- Use landmarks like `<main>`, `<nav>`, `<header>`, `<footer>`, `<aside>`

### 2. Keyboard Navigation

- Ensure all interactive elements are keyboard accessible
- Maintain a logical tab order
- Provide visible focus indicators
- Implement proper focus management for modals and dynamic content

### 3. ARIA Attributes

- Use ARIA attributes only when necessary
- Ensure proper relationships with `aria-labelledby`, `aria-describedby`
- Use appropriate ARIA roles when HTML semantics are insufficient
- Test with screen readers to verify ARIA implementation

### 4. Images and Media

- Provide descriptive alt text for all images
- Include captions and transcripts for audio/video content
- Ensure media controls are keyboard accessible

### 5. Color and Contrast

- Maintain minimum contrast ratio of 4.5:1 for normal text
- Don't rely on color alone to convey information
- Test with color blindness simulators

## MDX Content Guidelines

When creating MDX content for the story mode:

1. **Headings**: Use proper heading hierarchy starting with h1
2. **Images**: Always include descriptive alt text
3. **Links**: Clearly indicate external links
4. **Custom Components**: Use the accessible components provided in MDXContent.tsx

### Example of Accessible MDX Content

```mdx
# Album Story: YBNL Nation Vol. 1

![YBNL Nation album cover](path/to/cover.jpg)

## Background

This album represents a pivotal moment in Olamide's career...

<AlbumCard
  title="YBNL Nation Vol. 1"
  releaseDate="2012"
  coverArt="/albums/ybnl-cover.jpg"
  description="The debut album under YBNL label"
/>

<TrackHighlight title="First Love">
  This track showcases Olamide's versatility...
</TrackHighlight>

<Quote author="Olamide">
  I wanted to create something that represented the streets but could also be
  appreciated globally.
</Quote>

<Timeline>
  <TimelineEvent date="January 2012">
    Recording begins at Lagos studio
  </TimelineEvent>
  <TimelineEvent date="March 2012">First single released</TimelineEvent>
</Timeline>
```

## Testing Accessibility

### Automated Testing

- Run Jest tests with jest-axe
- Use ESLint with jsx-a11y plugin
- Integrate accessibility checks in CI/CD pipeline

### Manual Testing

- Test with keyboard navigation
- Test with screen readers (NVDA, VoiceOver)
- Test with browser extensions (axe, WAVE)

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [React Accessibility](https://reactjs.org/docs/accessibility.html)
- [Inclusive Components](https://inclusive-components.design/)
