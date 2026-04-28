import React, { createContext, useContext, useEffect, useState } from 'react';

// --- Types ---

export type FontOption = 'Inter' | 'Space Grotesk' | 'Playfair Display' | 'JetBrains Mono' | 'Outfit';

export interface ThemeConfig {
  primary: string;
  background: string;
  accent: string;
  font: FontOption;
  isDark: boolean;
}

interface ThemeContextType {
  theme: ThemeConfig;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  resetTheme: () => void;
}

// --- Utils ---

/**
 * Calculates luminance of a hex color
 */
function getLuminance(hex: string): number {
  const rgb = hex.replace(/^#/, '').match(/.{2}/g)?.map(x => parseInt(x, 16) / 255) || [0, 0, 0];
  const [r, g, b] = rgb.map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Determines contrast-safe foreground color
 */
export function getContrastColor(hex: string): string {
  return getLuminance(hex) > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Generates an accent color based on the primary color (simple shift)
 */
export function generateAccent(hex: string): string {
  // Simple accent: slightly lighter or darker version or complementary
  const lum = getLuminance(hex);
  return lum > 0.5 ? '#000000' : '#d4af37'; // Default to gold for dark themes, black for light
}

// --- Defaults ---

const DEFAULT_THEME: ThemeConfig = {
  primary: '#f37021', // Orange Hermès classique : apporte la signature visuelle immédiate.
  background: '#1a1412', // Orange Hermès classique : apporte la signature visuelle immédiate.
  accent: '#f3ebd5', // Fil de Lin / Surpiqûre : un crème texturé, bien plus doux et artisanal qu'un blanc pur.
  font: 'Inter',
  isDark: true,
};

// --- Context ---

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('site_theme');
    return saved ? JSON.parse(saved) : DEFAULT_THEME;
  });

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    setTheme(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('site_theme', JSON.stringify(next));
      return next;
    });
  };

  const resetTheme = () => {
    setTheme(DEFAULT_THEME);
    localStorage.removeItem('site_theme');
  };

  // Apply theme to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const fg = getContrastColor(theme.background);
    const bgLum = getLuminance(theme.background);
    
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--foreground', fg);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--font-family', `"${theme.font}", sans-serif`);
    
    // Derived values for subtle borders and overlays
    const borderAlpha = bgLum > 0.5 ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
    const cardAlpha = bgLum > 0.5 ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
    root.style.setProperty('--border-alpha', borderAlpha);
    root.style.setProperty('--card-alpha', cardAlpha);
    
    if (bgLum > 0.5) {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
