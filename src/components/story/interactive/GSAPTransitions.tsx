'use client';

import { useRef, useEffect, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface GSAPTransitionProps {
  children: ReactNode;
  animation?: 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'slideInUp' | 'slideInDown' | 'scaleIn' | 'rotateIn';
  duration?: number;
  delay?: number;
  trigger?: 'scroll' | 'load' | 'hover';
  stagger?: number;
  className?: string;
}

export default function GSAPTransition({
  children,
  animation = 'fadeIn',
  duration = 1,
  delay = 0,
  trigger = 'scroll',
  stagger = 0,
  className = ''
}: GSAPTransitionProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const getInitialState = () => {
      switch (animation) {
        case 'fadeIn':
          return { opacity: 0 };
        case 'slideInLeft':
          return { opacity: 0, x: -50 };
        case 'slideInRight':
          return { opacity: 0, x: 50 };
        case 'slideInUp':
          return { opacity: 0, y: 50 };
        case 'slideInDown':
          return { opacity: 0, y: -50 };
        case 'scaleIn':
          return { opacity: 0, scale: 0.8 };
        case 'rotateIn':
          return { opacity: 0, rotation: -180, scale: 0.8 };
        default:
          return { opacity: 0 };
      }
    };

    const getFinalState = () => {
      switch (animation) {
        case 'fadeIn':
          return { opacity: 1 };
        case 'slideInLeft':
        case 'slideInRight':
          return { opacity: 1, x: 0 };
        case 'slideInUp':
        case 'slideInDown':
          return { opacity: 1, y: 0 };
        case 'scaleIn':
          return { opacity: 1, scale: 1 };
        case 'rotateIn':
          return { opacity: 1, rotation: 0, scale: 1 };
        default:
          return { opacity: 1 };
      }
    };

    // Set initial state
    gsap.set(element, getInitialState());

    const animateElement = () => {
      const children = element.children;
      const targets = children.length > 0 ? Array.from(children) : [element];

      gsap.to(targets, {
        ...getFinalState(),
        duration,
        delay,
        stagger,
        ease: 'power2.out',
      });
    };

    if (trigger === 'scroll') {
      ScrollTrigger.create({
        trigger: element,
        start: 'top 80%',
        onEnter: animateElement,
        once: true,
      });
    } else if (trigger === 'load') {
      setTimeout(animateElement, delay * 1000);
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [animation, duration, delay, trigger, stagger]);

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      const element = elementRef.current;
      if (!element) return;

      gsap.to(element, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      const element = elementRef.current;
      if (!element) return;

      gsap.to(element, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  return (
    <div
      ref={elementRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

// Specialized transition components
export function FadeInSection({ children, delay = 0, className = '' }: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <GSAPTransition animation="fadeIn" delay={delay} className={className}>
      {children}
    </GSAPTransition>
  );
}

export function SlideInSection({ 
  children, 
  direction = 'up', 
  delay = 0, 
  stagger = 0.1,
  className = '' 
}: {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  stagger?: number;
  className?: string;
}) {
  const animationMap = {
    up: 'slideInUp',
    down: 'slideInDown',
    left: 'slideInLeft',
    right: 'slideInRight',
  } as const;

  return (
    <GSAPTransition 
      animation={animationMap[direction]} 
      delay={delay} 
      stagger={stagger}
      className={className}
    >
      {children}
    </GSAPTransition>
  );
}

export function ScaleInSection({ children, delay = 0, className = '' }: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <GSAPTransition animation="scaleIn" delay={delay} className={className}>
      {children}
    </GSAPTransition>
  );
}

// Advanced parallax component
export function ParallaxSection({ 
  children, 
  speed = 0.5, 
  className = '' 
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    tl.to(element, {
      y: (i, target) => -ScrollTrigger.maxScroll(window) * speed,
      ease: 'none',
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [speed]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

// Text reveal animation
export function TextReveal({ 
  text, 
  delay = 0, 
  stagger = 0.1,
  className = '' 
}: {
  text: string;
  delay?: number;
  stagger?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const words = text.split(' ');
    container.innerHTML = words
      .map(word => `<span class="inline-block overflow-hidden"><span class="inline-block">${word}</span></span>`)
      .join(' ');

    const spans = container.querySelectorAll('span span');
    
    gsap.set(spans, { y: '100%' });

    ScrollTrigger.create({
      trigger: container,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(spans, {
          y: '0%',
          duration: 0.8,
          delay,
          stagger,
          ease: 'power2.out',
        });
      },
      once: true,
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [text, delay, stagger]);

  return <div ref={containerRef} className={className} />;
}
