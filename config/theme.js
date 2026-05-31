const theme = {
    colors: {
        // Bold Nigerian Trustworthy Auction Marketplace Theme (Cowrywise + Jumia vibe)
        primary: '#0D1B2A',               // Deep Midnight Navy (Trustworthy & Stable)
        navy: '#0D1B2A',                  // Deep Obsidian Navy foundation
        dullRed0: '#F7F7F8',              // Clean Off-White Canvas background
        dullRed1: '#FF6B35',              // High-octane Warm Coral-Orange Accent CTAs
        secondary: '#0D1B2A',             // Obsidian secondary
        secondaryContainer: '#FFE6DD',    // Soft peach container accents
        surfaceContainerLow: '#FFFFFF',   // Pure white surfaces
        surfaceContainer: '#ECEAEB',      // Clean divider lines
        error: '#E11D48',                 // Rose Crimson - high-urgency warnings (e.g. outbid alerts)
        success: '#10B981',               // Vivid Emerald Green - winning statuses
        outline: '#64748B',               // Slate gray outline for components
        outlineVariant: '#CBD5E1',        // Soft gray outline variant
        cardBg: '#FFFFFF',                // Clean card surface
        glassGlow: 'rgba(13, 27, 42, 0.04)', // Translucent border overlay
        shadow: '#0D1B2A',                // Deep navy base for natural drop shadows
    },
    roundness: {
        sm: 8,                  // Tiny status dots/tags
        md: 12,                 // Specs: 12px rounded corner inputs
        lg: 16,                 // Standard buttons/small cards
        xl: 24,                 // Prominent cards/containers
        full: 9999,             // Perfect pill badges
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,                 // Specs: 16px horizontal padding
        lg: 24,                 // Specs: 24px section spacing
        xl: 32,
    },
    shadows: {
        glass: {
            shadowColor: '#0D1B2A',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2,
        },
        button: {
            shadowColor: '#FF6B35',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 4,
        }
    }
};

export { theme };