'use client';

import { useEffect, useRef } from 'react';
import { hoverAnimations, interactionAnimations, performanceUtils } from '@/lib/animations';

export const useAnimatedButton = (glowEffect: boolean = false) => {
    const buttonRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const button = buttonRef.current;
        if (!button) return;

        const handleMouseEnter = () => {
            performanceUtils.conditionalAnimate(() => {
                hoverAnimations.scaleHover(button, 1.05);
                if (glowEffect) {
                    hoverAnimations.glowHover(button);
                }
            });
        };

        const handleMouseLeave = () => {
            performanceUtils.conditionalAnimate(() => {
                hoverAnimations.scaleReset(button);
                if (glowEffect) {
                    hoverAnimations.glowReset(button);
                }
            });
        };

        const handleClick = () => {
            performanceUtils.conditionalAnimate(() => {
                interactionAnimations.buttonPress(button);
            });
        };

        button.addEventListener('mouseenter', handleMouseEnter);
        button.addEventListener('mouseleave', handleMouseLeave);
        button.addEventListener('click', handleClick);

        return () => {
            button.removeEventListener('mouseenter', handleMouseEnter);
            button.removeEventListener('mouseleave', handleMouseLeave);
            button.removeEventListener('click', handleClick);
        };
    }, [glowEffect]);

    return buttonRef;
};
