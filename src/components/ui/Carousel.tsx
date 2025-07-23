'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

interface CarouselProps {
    children: ReactNode[];
    slidesPerView?: number;
    spacing?: number;
    loop?: boolean;
    autoplay?: boolean;
    autoplayInterval?: number;
    showArrows?: boolean;
    showDots?: boolean;
}

export default function Carousel({
    children,
    slidesPerView = 1,
    spacing = 15,
    loop = true,
    autoplay = false,
    autoplayInterval = 3000,
    showArrows = true,
    showDots = true,
}: CarouselProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loaded, setLoaded] = useState(false);

    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
        {
            slides: {
                perView: slidesPerView,
                spacing: spacing,
            },
            loop: loop,
            initial: 0,
            slideChanged(slider) {
                setCurrentSlide(slider.track.details.rel);
            },
            created() {
                setLoaded(true);
            },
        },
        []
    );

    // Autoplay functionality
    useEffect(() => {
        if (autoplay && instanceRef.current) {
            const interval = setInterval(() => {
                instanceRef.current?.next();
            }, autoplayInterval);

            return () => {
                clearInterval(interval);
            };
        }
    }, [autoplay, autoplayInterval, instanceRef]);

    return (
        <div className="relative">
            <div ref={sliderRef} className="keen-slider">
                {children.map((child, idx) => (
                    <div key={idx} className="keen-slider__slide">
                        {child}
                    </div>
                ))}
            </div>

            {loaded && showArrows && (
                <>
                    <button
                        onClick={() => instanceRef.current?.prev()}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 dark:bg-black/30 backdrop-blur-sm p-2 rounded-full hover:bg-white/50 dark:hover:bg-black/50 transition-colors"
                        aria-label="Previous slide"
                    >
                        ◀
                    </button>

                    <button
                        onClick={() => instanceRef.current?.next()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 dark:bg-black/30 backdrop-blur-sm p-2 rounded-full hover:bg-white/50 dark:hover:bg-black/50 transition-colors"
                        aria-label="Next slide"
                    >
                        ▶
                    </button>
                </>
            )}

            {loaded && showDots && (
                <div className="flex justify-center mt-4 gap-2">
                    {[...Array(instanceRef.current?.track.details.slides.length)].map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => instanceRef.current?.moveToIdx(idx)}
                            className={`w-3 h-3 rounded-full ${currentSlide === idx
                                    ? 'bg-primary'
                                    : 'bg-secondary-300 dark:bg-secondary-700'
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
