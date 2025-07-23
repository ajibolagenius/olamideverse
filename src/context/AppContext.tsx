'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface AppContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    showLegalDisclaimer: boolean;
    setShowLegalDisclaimer: (show: boolean) => void;
    acceptedLegalTerms: boolean;
    setAcceptedLegalTerms: (accepted: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>('system');
    const [showLegalDisclaimer, setShowLegalDisclaimer] = useState(true);
    const [acceptedLegalTerms, setAcceptedLegalTerms] = useState(false);

    return (
        <AppContext.Provider
            value={{
                theme,
                setTheme,
                showLegalDisclaimer,
                setShowLegalDisclaimer,
                acceptedLegalTerms,
                setAcceptedLegalTerms,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
