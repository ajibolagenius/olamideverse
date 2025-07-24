// Export GSAP animations
export {
    pageTransitions,
    layoutAnimations,
    animationUtils,
    default as gsap,
} from './gsap';

// Export Anime.js animations
export {
    hoverAnimations,
    interactionAnimations,
    stateAnimations,
    animeUtils,
    default as anime,
} from './anime';

// Performance utilities
export const performanceUtils = {
    // Check if user prefers reduced motion
    prefersReducedMotion: () => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    // Conditionally run animation based on user preference
    conditionalAnimate: (animationFn: () => unknown, fallbackFn?: () => void) => {
        if (performanceUtils.prefersReducedMotion()) {
            fallbackFn?.();
            return null;
        }
        return animationFn();
    },

    // Check if device has good performance
    isHighPerformanceDevice: () => {
        // Simple heuristic based on hardware concurrency and memory
        const cores = navigator.hardwareConcurrency || 1;
        const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 1;
        return cores >= 4 && memory >= 4;
    },

    // Throttle animations on low-end devices
    getOptimalDuration: (baseDuration: number) => {
        return performanceUtils.isHighPerformanceDevice() ? baseDuration : baseDuration * 1.5;
    },
};

// Animation hooks for React components
export const useAnimationHelpers = () => {
    const animateOnMount = (element: HTMLElement | null, animationFn: (el: HTMLElement) => unknown) => {
        if (!element) return;

        performanceUtils.conditionalAnimate(() => animationFn(element));
    };

    const animateOnHover = (
        element: HTMLElement | null,
        hoverFn: (el: HTMLElement) => unknown,
        resetFn: (el: HTMLElement) => unknown
    ) => {
        if (!element) return;

        const handleMouseEnter = () => {
            performanceUtils.conditionalAnimate(() => hoverFn(element));
        };

        const handleMouseLeave = () => {
            performanceUtils.conditionalAnimate(() => resetFn(element));
        };

        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            element.removeEventListener('mouseenter', handleMouseEnter);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    };

    return {
        animateOnMount,
        animateOnHover,
    };
};
