/**
 * Site Theme & Design System Defaults
 */
export const themeConfig = {
  defaultMode: 'dark' as const,
  fonts: {
    sans: 'var(--font-sans)',
    mono: 'var(--font-mono)',
  },
  sidebarWidth: '280px',
  headerHeight: '64px',
  
  // Custom theme constants for visual styling references
  glassmorphism: {
    background: 'rgba(10, 10, 10, 0.7)',
    border: 'rgba(255, 255, 255, 0.08)',
    blur: '12px',
  },
  
  // Premium dark-theme color tokens reference mapping
  colors: {
    darkBg: '#09090b', // Zinc 950
    cardBg: '#18181b', // Zinc 900
    borderBg: '#27272a', // Zinc 800
    accentPurple: '#a855f7', // Purple 500
    accentCyan: '#06b6d4', // Cyan 500
    accentRose: '#f43f5e', // Rose 500
    accentGold: '#eab308', // Yellow 500
  },
} as const;

export type ThemeConfig = typeof themeConfig;
