/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify paths to all screen components to enable Tailwind compilations
  content: [
    "./App.js",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./utilities/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Elite Auction Modernism color tokens mapped to Tailwind
        primary: '#05070F',               // obsidian sapphire black
        navy: '#0C0E1F',                  // Deep premium midnight navy
        dullRed0: '#FAF8F9',              // Soft warm alabaster canvas
        dullRed1: '#FF5733',              // High-octane electric coral accent
        secondary: '#912B16',             // Refined Terracotta
        secondaryContainer: '#FFA07A',    // Coral/Peach accent
        surfaceContainerLow: '#F4EFF1',   // Ice white soft surface
        surfaceContainer: '#ECE5E8',      // Divider lines
        error: '#D91E49',                 // Rose Crimson urgency
        success: '#10B981',               // Vivid Emerald Green winning status
        outline: '#64748B',               // Slate gray outline
        outlineVariant: '#CBD5E1',        // Soft gray variant
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '18px',
        xl: '28px',
      }
    },
  },
  plugins: [],
}
