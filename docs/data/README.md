# LyricsDisplay Component - Accessibility Guide

## Overview

The LyricsDisplay component has been enhanced with comprehensive accessibility features to ensure WCAG AA compliance and provide an excellent experience for all users, including those using assistive technologies.

## Accessibility Features

### 🎯 **ARIA Support**

- **Live Regions**: Announces current line changes and auto-scroll status
- **Proper Roles**: Uses `region` for main container, `button` for interactive lines
- **Descriptive Labels**: Each lyric line includes content and timing information
- **Status Indicators**: Auto-scroll pause/resume announcements

### ⌨️ **Keyboard Navigation**

- **Arrow Keys**: Navigate between lyric lines (Up/Down)
- **Home/End**: Jump to first/last line
- **Enter/Space**: Seek to selected line's timestamp
- **Tab Navigation**: Proper focus management throughout component
- **Skip Links**: Quick access to current playing line

### 🎨 **Visual Accessibility**

- **High Contrast**: Enhanced color contrast for current line highlighting
- **Focus Indicators**: Clear visual focus rings for keyboard navigation
- **Reduced Motion**: Respects `prefers-reduced-motion` user preference
- **Clear Visual Hierarchy**: Proper spacing and typography

### 📢 **Screen Reader Support**

- **Live Announcements**: Current line content announced during playback
- **Comprehensive Instructions**: Detailed usage instructions for screen readers
- **Status Updates**: Auto-scroll state changes announced
- **Semantic Structure**: Proper heading hierarchy and landmarks

## Usage Examples

### Basic Implementation

```tsx
import LyricsDisplay from '@/components/player/LyricsDisplay';

<LyricsDisplay
  lyrics={trackLyrics}
  currentTime={playerTime}
  isPlaying={isPlaying}
  onSeek={handleSeek}
  showAttribution={true}
/>;
```

### With Custom Styling

```tsx
<LyricsDisplay
  lyrics={trackLyrics}
  currentTime={playerTime}
  isPlaying={isPlaying}
  onSeek={handleSeek}
  className="custom-lyrics-container"
  showAttribution={false}
/>
```

## Keyboard Shortcuts

| Key               | Action                                 |
| ----------------- | -------------------------------------- |
| `↑` / `↓`         | Navigate between lyric lines           |
| `Home`            | Jump to first line                     |
| `End`             | Jump to last line                      |
| `Enter` / `Space` | Seek to selected line                  |
| `Tab`             | Navigate to skip link (when available) |

## Testing

### Automated Testing

```bash
# Run accessibility tests
npm test -- LyricsDisplay.accessibility.test.tsx

# Run with coverage
npm test -- --coverage LyricsDisplay.accessibility.test.tsx
```

### Manual Testing Checklist

- [ ] Test with keyboard-only navigation
- [ ] Test with VoiceOver (macOS) or NVDA (Windows)
- [ ] Verify color contrast ratios meet WCAG AA standards
- [ ] Test focus management during playback
- [ ] Verify ARIA announcements work correctly
- [ ] Test with reduced motion preferences enabled

### Screen Reader Testing

1. **VoiceOver (macOS)**:

   ```bash
   # Enable VoiceOver
   cmd + F5
   ```

2. **NVDA (Windows)**:
   - Download and install NVDA
   - Use Ctrl+Alt+N to start

3. **Testing Steps**:
   - Navigate to lyrics component
   - Verify region is announced properly
   - Test line-by-line navigation
   - Confirm current line announcements
   - Test seeking functionality

## Performance Considerations

### Reduced Motion Support

The component automatically detects and respects the user's motion preferences:

```css
/* CSS media query equivalent */
@media (prefers-reduced-motion: reduce) {
  /* Animations are simplified or disabled */
}
```

### Efficient Re-renders

- Memoized callbacks prevent unnecessary re-renders
- Optimized state updates for smooth performance
- Efficient DOM manipulation for large lyric sets

## Common Issues and Solutions

### Issue: Screen Reader Not Announcing Line Changes

**Solution**: Ensure the live region is properly configured:

```tsx
<div className="sr-only" aria-live="polite" aria-atomic="true">
  {currentLineAnnouncement}
</div>
```

### Issue: Keyboard Navigation Not Working

**Solution**: Check that all interactive elements have proper tabindex and event handlers:

```tsx
<div
    role="button"
    tabIndex={0}
    onKeyDown={handleKeyDown}
    aria-label="Descriptive label"
>
```

### Issue: Focus Not Visible

**Solution**: Ensure focus indicators are properly styled:

```css
.focus\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
    var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
    calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow:
    var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
    var(--tw-shadow, 0 0 #0000);
}
```

## Browser Support

### Tested Browsers

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Screen Reader Compatibility

- ✅ VoiceOver (macOS/iOS)
- ✅ NVDA (Windows)
- ✅ JAWS (Windows)
- ✅ TalkBack (Android)

## Contributing

When making changes to the LyricsDisplay component:

1. **Run accessibility tests** before submitting PR
2. **Test with screen readers** for any interactive changes
3. **Verify keyboard navigation** still works correctly
4. **Check color contrast** for any visual changes
5. **Update tests** to cover new functionality

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [axe-core Documentation](https://github.com/dequelabs/axe-core)
