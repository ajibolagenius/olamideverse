import { animate as anime, stagger } from 'animejs';
import type { AnimationParams } from 'animejs';

// Hover and interaction animations
export const hoverAnimations = {
    // Scale hover effect
    scaleHover: (element: HTMLElement | string, scale: number = 1.05) => {
        return anime(element, {
            scale: scale,
            duration: 300,
            easing: 'easeOutCubic',
        });
    },

    // Scale back to normal
    scaleReset: (element: HTMLElement | string) => {
        return anime(element, {
            scale: 1,
            duration: 300,
            easing: 'easeOutCubic',
        });
    },

    // Subtle lift effect
    liftHover: (element: HTMLElement | string) => {
        return anime(element, {
            translateY: -8,
            duration: 300,
            easing: 'easeOutCubic',
        });
    },

    // Reset lift effect
    liftReset: (element: HTMLElement | string) => {
        return anime(element, {
            translateY: 0,
            duration: 300,
            easing: 'easeOutCubic',
        });
    },

    // Glow effect for buttons
    glowHover: (element: HTMLElement | string) => {
        return anime(element, {
            boxShadow: '0 0 20px rgba(var(--primary-rgb), 0.4)',
            duration: 300,
            easing: 'easeOutCubic',
        });
    },

    // Reset glow effect
    glowReset: (element: HTMLElement | string) => {
        return anime(element, {
            boxShadow: '0 0 0px rgba(var(--primary-rgb), 0)',
            duration: 300,
            easing: 'easeOutCubic',
        });
    },

    // Rotate hover effect
    rotateHover: (element: HTMLElement | string, rotation: number = 5) => {
        return anime(element, {
            rotate: rotation,
            duration: 300,
            easing: 'easeOutCubic',
        });
    },

    // Reset rotation
    rotateReset: (element: HTMLElement | string) => {
        return anime(element, {
            rotate: 0,
            duration: 300,
            easing: 'easeOutCubic',
        });
    },
};

// Button and interaction animations
export const interactionAnimations = {
    // Button press animation
    buttonPress: (element: HTMLElement | string) => {
        return anime(element, {
            scale: 0.95,
            duration: 150,
            easing: 'easeOutCubic',
            complete: () => {
                anime(element, {
                    scale: 1,
                    duration: 150,
                    easing: 'easeOutCubic',
                });
            },
        });
    },

    // Ripple effect
    ripple: (element: HTMLElement, x: number, y: number) => {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        element.appendChild(ripple);

        anime(ripple, {
            scale: [0, 1],
            opacity: [1, 0],
            duration: 600,
            easing: 'easeOutCubic',
            complete: () => {
                ripple.remove();
            },
        });
    },

    // Pulse animation
    pulse: (element: HTMLElement | string, intensity: number = 1.1) => {
        return anime(element, {
            scale: [1, intensity, 1],
            duration: 800,
            easing: 'easeInOutSine',
            loop: true,
        });
    },

    // Stop pulse animation
    stopPulse: (element: HTMLElement | string) => {
        animeUtils.remove(element);
        anime(element, {
            scale: 1,
            duration: 300,
            easing: 'easeOutCubic',
        });
    },
};

// Loading and state animations
export const stateAnimations = {
    // Loading spinner
    loadingSpinner: (element: HTMLElement | string) => {
        return anime(element, {
            rotate: '1turn',
            duration: 1000,
            easing: 'linear',
            loop: true,
        });
    },

    // Fade in animation
    fadeIn: (element: HTMLElement | string, duration: number = 600) => {
        return anime(element, {
            opacity: [0, 1],
            duration,
            easing: 'easeOutCubic',
        });
    },

    // Fade out animation
    fadeOut: (element: HTMLElement | string, duration: number = 600) => {
        return anime(element, {
            opacity: [1, 0],
            duration,
            easing: 'easeOutCubic',
        });
    },

    // Slide up animation
    slideUp: (element: HTMLElement | string, duration: number = 600) => {
        return anime(element, {
            translateY: [30, 0],
            opacity: [0, 1],
            duration,
            easing: 'easeOutCubic',
        });
    },

    // Slide down animation
    slideDown: (element: HTMLElement | string, duration: number = 600) => {
        return anime(element, {
            translateY: [0, 30],
            opacity: [1, 0],
            duration,
            easing: 'easeOutCubic',
        });
    },
};

// Utility functions
export const animeUtils = {
    // Remove all animations from element (using CSS reset)
    remove: (element: HTMLElement | string) => {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (el instanceof HTMLElement) {
            el.style.transform = '';
            el.style.opacity = '';
        }
    },

    // Create staggered animation
    stagger: (elements: HTMLElement[] | string, animation: Record<string, unknown>, staggerDelay: number = 100) => {
        return anime(elements, {
            ...animation,
            delay: stagger(staggerDelay),
        });
    },

    // Create timeline (simplified)
    timeline: (config?: Record<string, unknown>) => {
        // For now, return a simple object that can chain animations
        return {
            add: (targets: HTMLElement | string, params: AnimationParams) => anime(targets, params),
            ...config,
        };
    },
};

export { anime as default };
