/**
 * Design tokens derived from the Pencil design file (sandclock-app.pen).
 * All screens and components should import from here instead of hardcoding values.
 */

export const theme = {
  colors: {
    // Backgrounds
    bgPrimary: '#F5F0EB',
    bgSecondary: '#E8E3DD',

    // Brand / hourglass
    mint: '#B0D4C8',
    mintDark: '#7DBAA8',
    sandOrange: '#D98B5C',
    sandDark: '#C47A4E',
    cutoutBg: '#79B3A2',

    // Pill body gradient colors
    pillGradientTop: '#BFE0D4',
    pillGradientBottom: '#9ECABC',

    // Typography
    fontPrimary: '#2D3B36',
    fontSecondary: '#6B7E76',
    fontTertiary: '#9AADA5',

    // Utility
    white: '#FFFFFF',
    shadowColor: '#2D3B36',
  },

  font: {
    family: 'Inter_400Regular' as const,
    familyMap: {
      regular: 'Inter_400Regular' as const,
      semibold: 'Inter_600SemiBold' as const,
      bold: 'Inter_700Bold' as const,
      extrabold: 'Inter_800ExtraBold' as const,
    },
    size: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
    },
    weight: {
      regular: '400' as const,
      semibold: '600' as const,
      bold: '700' as const,
      extrabold: '800' as const,
    },
  },

  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },

  radius: {
    sm: 12,
    md: 28,
    lg: 36,
    full: 9999,
  },

  shadow: {
    card: {
      shadowColor: '#2D3B36',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 4,
    },
  },
} as const;
