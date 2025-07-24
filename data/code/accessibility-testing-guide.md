# Accessibility Testing Guide for OlamideVerse

## Automated Testing Integration

### 1. Install Testing Dependencies

```bash
npm install --save-dev @axe-core/react jest-axe @testing-library/jest-dom
```

### 2. Jest Configuration

Add to `jest.setup.js`:

```javascript
import 'jest-axe/extend-expect';
import { configureAxe } from 'jest-axe';

// Configure axe for consistent testing
const axe = configureAxe({
  rules: {
    // Disable color-contrast rule for automated testing (manual testing required)
    'color-contrast': { enabled: false },
  },
});

global.axe = axe;
```

### 3. Component Test Example

```javascript
// src/components/player/__tests__/MusicPlayer.accessibility.test.tsx
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import MusicPlayer from '../MusicPlayer';

expect.extend(toHaveNoViolations);

describe('MusicPlayer Accessibility', () => {
  const mockTrack = {
    id: '1',
    title: 'Test Track',
    metadata: { artist: 'Olamide' },
  };

  test('should not have accessibility violations', async () => {
    const { container } = render(<MusicPlayer track={mockTrack} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('should have proper ARIA labels', () => {
    render(<MusicPlayer track={mockTrack} />);

    expect(
      screen.getByRole('slider', { name: /track progress/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: /volume/i })).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: /playback controls/i })
    ).toBeInTheDocument();
  });

  test('should announce track changes', () => {
    render(<MusicPlayer track={mockTrack} />);

    const nowPlaying = screen.getByRole('status', { name: /now playing/i });
    expect(nowPlaying).toHaveAttribute('aria-live', 'polite');
  });
});
```

## Manual Testing Checklist

### Keyboard Navigation

- [ ] Tab through all interactive elements
- [ ] Space bar plays/pauses music
- [ ] Arrow keys control progress and volume
- [ ] Shift + arrows skip tracks
- [ ] M key mutes/unmutes
- [ ] Focus indicators are visible
- [ ] No keyboard traps

### Screen Reader Testing

- [ ] Track information is announced on change
- [ ] Button purposes are clear
- [ ] Slider values are announced
- [ ] Keyboard shortcuts are discoverable
- [ ] Error states are announced

### Visual Testing

- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] Focus indicators are visible
- [ ] UI works at 200% zoom
- [ ] Works in high contrast mode
- [ ] Respects reduced motion preferences

## Browser Testing Matrix

| Feature             | Chrome | Firefox | Safari | Edge |
| ------------------- | ------ | ------- | ------ | ---- |
| Keyboard navigation | ✓      | ✓       | ✓      | ✓    |
| Screen reader       | ✓      | ✓       | ✓      | ✓    |
| High contrast       | ✓      | ✓       | ✓      | ✓    |
| Reduced motion      | ✓      | ✓       | ✓      | ✓    |

## Screen Reader Testing Commands

### NVDA (Windows)

- Insert + Space: Toggle browse/focus mode
- Insert + T: Read title
- Insert + F7: List form fields
- Insert + F5: Refresh virtual buffer

### JAWS (Windows)

- Insert + F5: Refresh virtual buffer
- Insert + F6: List headings
- Insert + F7: List links
- Insert + Ctrl + R: Read from cursor

### VoiceOver (macOS)

- Ctrl + Option + A: Start reading
- Ctrl + Option + Right: Next item
- Ctrl + Option + Space: Activate item
- Ctrl + Option + U: Rotor menu

## Performance Impact

### Accessibility Features Performance Cost

- ARIA live regions: Minimal
- Enhanced focus management: Low
- Screen reader optimizations: Negligible
- Keyboard event handlers: Low

### Monitoring

- Use Lighthouse accessibility audit
- Monitor Core Web Vitals impact
- Test with assistive technologies regularly

## Common Issues to Watch For

1. **Dynamic Content**: Ensure live regions announce changes
2. **Focus Management**: Maintain logical focus order
3. **Color Dependence**: Don't rely solely on color for information
4. **Motion Sensitivity**: Respect prefers-reduced-motion
5. **Keyboard Traps**: Ensure all interactive elements are reachable

## Integration with CI/CD

Add to GitHub Actions workflow:

```yaml
- name: Run accessibility tests
  run: npm run test:a11y

- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v9
  with:
    configPath: './lighthouserc.json'
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
