// constants/theme.ts
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

export const colors = {
  // Primary colors
  primary: '#6750A4',
  onPrimary: '#FFFFFF',
  primaryContainer: '#EADDFF',
  onPrimaryContainer: '#21005D',
  
  // Secondary colors
  secondary: '#625B71',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#E8DEF8',
  onSecondaryContainer: '#1D192B',
  
  // Tertiary colors
  tertiary: '#7D5260',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#FFD8E4',
  onTertiaryContainer: '#31111D',
  
  // Error colors
  error: '#B3261E',
  onError: '#FFFFFF',
  errorContainer: '#F9DEDC',
  onErrorContainer: '#410E0B',
  
  // Background colors
  background: '#FFFBFE',
  onBackground: '#1C1B1F',
  
  // Outline colors
  outline: '#79747E',
  outlineVariant: '#CAC4D0',

  textPrimary: '#1C1B1F',
  textSecondary: '#49454F',
  textDisabled: '#CAC4D0',
  
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const typography: Record<string, TextStyle> = {
  // Display styles
  displayLarge: {
    fontSize: 57,
    fontWeight: '400',
    lineHeight: 64,
    letterSpacing: 0,
  },
  displayMedium: {
    fontSize: 45,
    fontWeight: '400',
    lineHeight: 52,
    letterSpacing: 0,
  },
  displaySmall: {
    fontSize: 36,
    fontWeight: '400',
    lineHeight: 44,
    letterSpacing: 0,
  },
  
  // Headline styles
  headlineLarge: {
    fontSize: 32,
    fontWeight: '400',
    lineHeight: 40,
    letterSpacing: 0,
  },
  headlineMedium: {
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 36,
    letterSpacing: 0,
  },
  headlineSmall: {
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 32,
    letterSpacing: 0,
  },
  
  // Title styles
  titleLarge: {
    fontSize: 22,
    fontWeight: '400',
    lineHeight: 28,
    letterSpacing: 0,
  },
  titleMedium: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  
  // Label styles
  labelLarge: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  
  // Body styles
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.4,
  },
};

export const commonStyles: Record<string, ViewStyle> = {
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  surface: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  }  
};

// Type exports for better autocomplete
export type Colors = typeof colors;
export type Spacing = typeof spacing;

export const buttonStyles = StyleSheet.create({
  actionButton: {
    flex: 1,
    borderRadius: 8,
  },
  actionButtonContent: {
    height: 56,
  },
  formButton: {
    color: "white",
    marginTop: spacing.lg,
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#6750A4',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#6750A4',
  },
  animatedButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: '#6750A4',
    overflow: 'hidden',
  },
});


export const inputStyles = StyleSheet.create({
  searchBar: { 
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 8,
  },
  textInput: { 
    backgroundColor: '#ffffff',
  },
});