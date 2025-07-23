import { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function LegalDisclaimer() {
    const { setShowLegalDisclaimer, setAcceptedLegalTerms } = useApp();
    const [isOpen, setIsOpen] = useState(true);

    const handleAccept = () => {
        setAcceptedLegalTerms(true);
        setShowLegalDisclaimer(false);
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Legal Disclaimer</h2>

                    <div className="prose dark:prose-invert">
                        <p>
                            Welcome to OlamideVerse, a fan-created platform dedicated to celebrating and preserving Olamide's musical legacy.
                        </p>

                        <h3>Content Usage Notice</h3>
                        <p>
                            This platform is a non-commercial fan project. All music, lyrics, images, and related content are the property of Olamide, YBNL Nation, and their respective copyright holders. We do not claim ownership of any copyrighted material.
                        </p>

                        <h3>Fair Use Statement</h3>
                        <p>
                            Content on this platform is presented under fair use principles for the purposes of commentary, criticism, research, and preservation of cultural significance. We believe this constitutes fair use of any copyrighted material as provided for in section 107 of the U.S. Copyright Law.
                        </p>

                        <h3>Third-Party Services</h3>
                        <p>
                            Music playback is provided through official third-party services like Spotify, YouTube, and other platforms in compliance with their terms of service. We do not host or distribute copyrighted music files directly.
                        </p>

                        <h3>Removal Requests</h3>
                        <p>
                            If you are a rights holder and believe that any content on this platform infringes upon your copyright, please contact us and the content will be promptly removed.
                        </p>
                    </div>

                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            onClick={handleAccept}
                            className="px-4 py-2 bg-primary hover:bg-primary-600 text-white rounded-md transition-colors"
                        >
                            Accept & Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
