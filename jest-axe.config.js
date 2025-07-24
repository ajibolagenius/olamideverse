/**
 * Jest-axe configuration for accessibility testing
 * This configuration ensures consistent accessibility testing across the project
 */

const { configureAxe } = require('jest-axe');

// Configure axe-core with project-specific rules
const axe = configureAxe({
    // Global rules configuration
    rules: {
        // Disable color-contrast rule in tests (we'll test this manually)
        // as jsdom doesn't accurately compute contrast ratios
        'color-contrast': { enabled: false },

        // Ensure proper focus management
        'focus-order-semantics': { enabled: true },

        // Require proper ARIA usage
        'aria-valid-attr-value': { enabled: true },
        'aria-valid-attr': { enabled: true },

        // Ensure proper semantic structure
        'landmark-one-main': { enabled: true },
        'region': { enabled: true },

        // Keyboard accessibility
        'keyboard': { enabled: true },
        'focus-order-semantics': { enabled: true },
    },

    // Tags to include in testing
    tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],

    // Global configuration
    globalOptions: {
        // Respect user preferences in testing
        respectUserPreferences: true,
    }
});

module.exports = axe;
