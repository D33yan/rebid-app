import React, { createContext, useState, useContext } from 'react';
import { theme } from './theme';

const ThemeToggleContext = createContext({
    isDarkMode: false,
    toggleTheme: () => {},
    colors: theme.colors,
});

export function ThemeToggleProvider({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    // Specs: Dark mode configurations
    // Navy #0D1B2A becomes #060D14. Cards shift to #1A2A3A. Text goes to #F0F0F0. Coral accent identical.
    const darkColors = {
        ...theme.colors,
        primary: '#060D14',
        navy: '#060D14',
        dullRed0: '#060D14', // Background canvas
        cardBg: '#1A2A3A',    // Specs: card background shift
        surfaceContainerLow: '#1A2A3A',
        text: '#F0F0F0',       // Specs: Text shift
        outline: '#94A3B8',
        outlineVariant: '#475569',
        success: '#10B981',
        error: '#E11D48',
    };

    const lightColors = {
        ...theme.colors,
        text: '#0D1B2A',
    };

    const currentColors = isDarkMode ? darkColors : lightColors;

    return (
        <ThemeToggleContext.Provider value={{ isDarkMode, toggleTheme, colors: currentColors }}>
            {children}
        </ThemeToggleContext.Provider>
    );
}

export const useThemeToggle = () => useContext(ThemeToggleContext);
export { ThemeToggleContext };
