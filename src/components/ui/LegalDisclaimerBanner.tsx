'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LegalDisclaimerBanner() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-secondary-900 text-white py-2 px-4 text-sm">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
                <p className="mb-2 sm:mb-0">
                    This is a fan project. All content rights belong to their respective owners.{' '}
                    <Link href="/legal/disclaimer" className="underline hover:text-primary">
                        Learn more
                    </Link>
                </p>

                <button
                    onClick={() => setIsVisible(false)}
                    className="text-white hover:text-primary"
                    aria-label="Dismiss legal disclaimer"
                >
                    Dismiss
                </button>
            </div>
        </div>
    );
}
