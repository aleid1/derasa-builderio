/**
 * LOCKED DESIGN SYSTEM TOKENS
 * 
 * ⚠️ WARNING: These tokens are locked and should not be modified without proper approval.
 * Changes to these values will affect the entire application design system.
 * 
 * Last updated: 2024
 * Version: 1.0.0
 */

export const DESIGN_TOKENS = {
  // Color Palette - LOCKED
  colors: {
    // Primary Brand Colors
    primary: {
      DEFAULT: 'hsl(142, 71%, 45%)', // #2E7D32 - Green
      light: 'hsl(142, 71%, 55%)',
      dark: 'hsl(142, 71%, 35%)',
      foreground: 'hsl(0, 0%, 100%)',
    },
    // Secondary Accent
    secondary: {
      DEFAULT: 'hsl(45, 85%, 62%)', // #F5A623 - Warm accent
      light: 'hsl(45, 85%, 72%)',
      dark: 'hsl(45, 85%, 52%)',
      foreground: 'hsl(0, 0%, 0%)',
    },
    // Neutral Grays - Enhanced for accessibility
    neutral: {
      50: 'hsl(0, 0%, 98%)',
      100: 'hsl(0, 0%, 96%)',
      200: 'hsl(0, 0%, 90%)',
      300: 'hsl(0, 0%, 83%)',
      400: 'hsl(0, 0%, 64%)',
      500: 'hsl(0, 0%, 45%)', // 4.5:1 contrast minimum
      600: 'hsl(0, 0%, 32%)',
      700: 'hsl(0, 0%, 25%)',
      800: 'hsl(0, 0%, 15%)',
      900: 'hsl(0, 0%, 9%)',
    },
    // Semantic Colors
    white: 'hsl(0, 0%, 100%)',
    black: 'hsl(0, 0%, 0%)',
  },

  // Typography Scale - LOCKED
  typography: {
    // Font Families
    fontFamily: {
      arabic: ['Tajawal', 'Arial', 'Tahoma', 'sans-serif'],
    },
    // Font Sizes - Systematic scale
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
      '7xl': '4.5rem',   // 72px
    },
    // Font Weights
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    // Line Heights
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },

  // Spacing Scale - LOCKED
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },

  // Border Radius - LOCKED
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    DEFAULT: '0.25rem', // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadows - LOCKED
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },

  // Transitions - LOCKED
  transition: {
    duration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },
    timing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // Grid System - LOCKED
  grid: {
    maxWidth: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      container: '1200px', // Main content container
    },
    columns: 12,
    gutter: '2rem', // 32px
  },

  // Interactive Elements - LOCKED
  interaction: {
    // Minimum tap target size for accessibility
    minTapTarget: '44px',
    // Focus ring styles
    focusRing: {
      width: '2px',
      color: 'hsl(142, 71%, 45%)', // primary color
      offset: '2px',
    },
    // Hover states
    hover: {
      scale: '1.05',
      shadow: 'lg',
    },
  },

  // Brand Guidelines - LOCKED
  brand: {
    name: 'دِراسة', // Correct Arabic spelling with diacritics
    logoIcon: 'د', // Arabic letter "Dal"
    tagline: 'معلمك الذكي الشخصي',
    values: [
      'تجربة آمنة',
      'حساسة ثقافياً', 
      'قائمة على القيم الإسلامية',
      'إرشاد توجيهي خطوة بخطوة'
    ],
  },

  // Icon System - LOCKED
  icons: {
    style: 'outline', // Consistent icon style across app
    strokeWidth: '2',
    size: {
      xs: '16px',
      sm: '20px',
      md: '24px',
      lg: '28px',
      xl: '32px',
    },
  },
} as const;

// Type definitions for design tokens
export type DesignTokens = typeof DESIGN_TOKENS;
export type ColorTokens = typeof DESIGN_TOKENS.colors;
export type TypographyTokens = typeof DESIGN_TOKENS.typography;
export type SpacingTokens = typeof DESIGN_TOKENS.spacing;

// Utility functions for accessing tokens
export const getColor = (path: string) => {
  const keys = path.split('.');
  let value: any = DESIGN_TOKENS.colors;
  
  for (const key of keys) {
    value = value[key];
    if (!value) return null;
  }
  
  return value;
};

export const getSpacing = (size: keyof SpacingTokens) => {
  return DESIGN_TOKENS.spacing[size];
};

export const getFontSize = (size: keyof TypographyTokens['fontSize']) => {
  return DESIGN_TOKENS.typography.fontSize[size];
};

// Validation function to ensure tokens are not accidentally modified
export const validateTokens = (): boolean => {
  // Check if primary color hasn't been changed
  const expectedPrimary = 'hsl(142, 71%, 45%)';
  if (DESIGN_TOKENS.colors.primary.DEFAULT !== expectedPrimary) {
    console.error('⚠️ Design tokens have been modified! Primary color changed.');
    return false;
  }
  
  // Check if brand name is correct
  if (DESIGN_TOKENS.brand.name !== 'دِراسة') {
    console.error('⚠️ Design tokens have been modified! Brand name changed.');
    return false;
  }
  
  return true;
};

// Auto-validate tokens on import
if (typeof window !== 'undefined') {
  validateTokens();
}
