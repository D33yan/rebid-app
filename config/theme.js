const theme = {
    colors: {
        // 2026 Luxury Dark-First Premium Brand Guidelines
        primary: '#0A0F1E',               // Background base (#0A0F1E)
        navy: '#0A0F1E',                  // Base background
        dullRed0: '#0A0F1E',              // Canvas background
        dullRed1: '#FF6B35',              // Primary Warm Coral accent (#FF6B35)
        secondary: '#111827',             // Card surface (#111827)
        secondaryContainer: '#1C2333',    // Elevated surface (#1C2333)
        surfaceContainerLow: '#111827',   // Card Surfaces
        surfaceContainer: '#1C2333',      // Elevated Surfaces
        error: '#FF4560',                 // Outbid Alert Crimson (#FF4560)
        success: '#00D97E',               // Winning State Emerald (#00D97E)
        gold: '#F5C518',                  // Premium Gold Accents (#F5C518)
        outline: 'rgba(255,255,255,0.06)', // Specs: 1px solid border
        outlineVariant: 'rgba(255,255,255,0.12)',
        cardBg: '#111827',
        text: '#CBD5E1',
        whiteHeadings: '#F1F5F9',
        mutedText: '#64748B',
        shadow: '#0A0F1E',
    },
    roundness: {
        sm: 6,
        md: 12,
        lg: 16,
        xl: 24,
        full: 9999,
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    shadows: {
        glass: {
            shadowColor: '#FF6B35',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 3,
        },
        button: {
            shadowColor: '#FF6B35',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 4,
        },
        winning: {
            shadowColor: '#00D97E',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 3,
        },
        outbid: {
            shadowColor: '#FF4560',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 3,
        }
    }
};

export { theme };