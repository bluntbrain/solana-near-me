// Solana NearMe App - Main Theme Export

export { SolanaColors, ColorCombinations, withOpacity } from './colors';
export { Typography } from './typography';
export { Spacing } from './spacing';

import { SolanaColors } from './colors';
import { Typography } from './typography';
import { Spacing } from './spacing';

// Combined theme object
export const Theme = {
  colors: SolanaColors,
  typography: Typography,
  spacing: Spacing,
} as const;

export type ThemeType = typeof Theme;

// Theme utilities
export const createShadow = (elevation: number) => ({
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: elevation / 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: elevation,
  elevation, // Android
});

// Glass effect utilities
export const createGlassEffect = (opacity: number = 0.15) => ({
  backgroundColor: `rgba(255, 255, 255, ${opacity})`,
  borderWidth: 1,
  borderColor: `rgba(255, 255, 255, ${opacity * 0.5})`,
  shadowColor: 'rgba(0, 0, 0, 0.3)',
  shadowOffset: {
    width: 0,
    height: 8,
  },
  shadowOpacity: 0.2,
  shadowRadius: 16,
  elevation: 8,
});

export const createDarkGlassEffect = (opacity: number = 0.2) => ({
  backgroundColor: `rgba(18, 18, 18, ${opacity + 0.1})`, // Slightly lighter dark background
  borderWidth: 1,
  borderColor: `rgba(255, 255, 255, ${opacity * 0.4})`, // More visible border
  shadowColor: 'rgba(0, 0, 0, 0.8)',
  shadowOffset: {
    width: 0,
    height: 8,
  },
  shadowOpacity: 0.4,
  shadowRadius: 20,
  elevation: 12,
});

// Common style combinations
export const CommonStyles = {
  // Container styles
  screen: {
    flex: 1,
    backgroundColor: SolanaColors.background.primary,
    padding: Spacing.layout.screenPadding,
  },
  
  // Card styles
  card: {
    backgroundColor: SolanaColors.background.card,
    borderRadius: Spacing.component.card.borderRadius,
    padding: Spacing.component.card.padding,
    ...createShadow(Spacing.elevation.md),
  },
  
  // Button styles
  primaryButton: {
    backgroundColor: SolanaColors.button.primary,
    borderRadius: Spacing.component.button.borderRadius,
    paddingHorizontal: Spacing.component.button.paddingHorizontal,
    paddingVertical: Spacing.component.button.paddingVertical,
    height: Spacing.layout.buttonHeight,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  
  secondaryButton: {
    backgroundColor: SolanaColors.button.secondary,
    borderRadius: Spacing.component.button.borderRadius,
    paddingHorizontal: Spacing.component.button.paddingHorizontal,
    paddingVertical: Spacing.component.button.paddingVertical,
    height: Spacing.layout.buttonHeight,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  
  // Input styles
  input: {
    backgroundColor: SolanaColors.background.secondary,
    borderColor: SolanaColors.border.primary,
    borderWidth: 1,
    borderRadius: Spacing.component.input.borderRadius,
    paddingHorizontal: Spacing.component.input.paddingHorizontal,
    paddingVertical: Spacing.component.input.paddingVertical,
    height: Spacing.layout.inputHeight,
    color: SolanaColors.text.primary,
    fontSize: Typography.fontSize.base,
  },
  
  // Text styles
  primaryText: {
    color: SolanaColors.text.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
  },
  
  accentText: {
    color: SolanaColors.text.secondary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  
  // Layout helpers
  centerContent: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  
  spaceBetween: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
} as const; 