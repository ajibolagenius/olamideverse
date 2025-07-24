import { gsap } from 'gsap';

// GSAP configuration for performance
gsap.config({
    force3D: true,
    nullTargetWarn: false,
});

// Page transition animations
export const pageTransitions = {
    // Fade in animation for page entry
    fadeIn: (element: HTMLElement | string, duration: number = 0.6) => {
        return gsap.fromTo(
            element,
            {
                opacity: 0,
                y: 20,
            },
            {
                opacity: 1,
                y: 0,
                duration,
                ease: 'power2.out',
            }
        );
    },

    // Fade out animation for page exit
    fadeOut: (element: HTMLElement | string, duration: number = 0.4) => {
        return gsap.to(element, {
            opacity: 0,
            y: -20,
            duration,
            ease: 'power2.in',
        });
    },

    // Slide in from right
    slideInRight: (element: HTMLElement | string, duration: number = 0.8) => {
        return gsap.fromTo(
            element,
            {
                x: '100%',
                opacity: 0,
            },
            {
                x: '0%',
                opacity: 1,
                duration,
                ease: 'power3.out',
            }
        );
    },

    // Slide in from left
    slideInLeft: (element: HTMLElement | string, duration: number = 0.8) => {
        return gsap.fromTo(
            element,
            {
                x: '-100%',
                opacity: 0,
            },
            {
                x: '0%',
                opacity: 1,
                duration,
                ease: 'power3.out',
            }
        );
    },

    // Scale in animation
    scaleIn: (element: HTMLElement | string, duration: number = 0.6) => {
        return gsap.fromTo(
            element,
            {
                scale: 0.8,
                opacity: 0,
            },
            {
                scale: 1,
                opacity: 1,
                duration,
                ease: 'back.out(1.7)',
            }
        );
    },

    // Stagger animation for multiple elements
    staggerIn: (elements: HTMLElement[] | string, duration: number = 0.6, stagger: number = 0.1) => {
        return gsap.fromTo(
            elements,
            {
                y: 30,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                duration,
                stagger,
                ease: 'power2.out',
            }
        );
    },
};

// Layout animations
export const layoutAnimations = {
    // Hero section animation
    heroAnimation: (heroElement: HTMLElement | string) => {
        const tl = gsap.timeline();

        tl.fromTo(
            heroElement,
            {
                opacity: 0,
                scale: 1.1,
            },
            {
                opacity: 1,
                scale: 1,
                duration: 1.2,
                ease: 'power2.out',
            }
        );

        return tl;
    },

    // Navigation animation
    navAnimation: (navElement: HTMLElement | string) => {
        return gsap.fromTo(
            navElement,
            {
                y: -100,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
            }
        );
    },

    // Footer animation
    footerAnimation: (footerElement: HTMLElement | string) => {
        return gsap.fromTo(
            footerElement,
            {
                y: 100,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
            }
        );
    },
};

// Utility functions
export const animationUtils = {
    // Kill all animations on an element
    killAnimations: (element: HTMLElement | string) => {
        gsap.killTweensOf(element);
    },

    // Set initial state for animations
    setInitialState: (element: HTMLElement | string, props: gsap.TweenVars) => {
        gsap.set(element, props);
    },

    // Create a timeline
    createTimeline: (vars?: gsap.TimelineVars) => {
        return gsap.timeline(vars);
    },

    // Batch animations for performance
    batch: (targets: HTMLElement[] | string, vars: gsap.TweenVars) => {
        return gsap.to(targets, vars);
    },
};

export default gsap;
