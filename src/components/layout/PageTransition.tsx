'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { pageTransitions, performanceUtils } from '@/lib/animations';

interface PageTransitionProps {
    children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Animate page entry
        performanceUtils.conditionalAnimate(
            () => pageTransitions.fadeIn(container, performanceUtils.getOptimalDuration(0.6)),
            () => {
                // Fallback for reduced motion - just ensure visibility
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }
        );

        return () => {
            // Cleanup any running animations
            if (container) {
                container.style.opacity = '';
                container.style.transform = '';
            }
        };
    }, [pathname]);

    return (
        <div
            ref={containerRef}
            className="page-transition-container"
            style={{
                opacity: 0,
                transform: 'translateY(20px)',
            }}
        >
            {children}
        </div>
    );
};

export default PageTransition;
