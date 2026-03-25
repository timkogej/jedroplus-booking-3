'use client';

import { useBookingStore } from '@/store/bookingStore';
import { isLightGradient } from './colorUtils';

export interface ThemeColors {
  isLight: boolean;
  // Text
  text: string;
  textMuted: string;   // ~60%
  textFaint: string;   // ~50%
  textSubtle: string;  // ~40%
  textGhost: string;   // ~28-30%
  textDisabled: string; // ~18-20%
  // Borders / dividers
  border: string;       // ~10%
  borderMuted: string;  // ~15-20%
  borderStrong: string; // ~25-30%
  // Backgrounds
  bgCard: string;
  bgSkeleton: string;
  bgOverlay: string;
}

const DARK: ThemeColors = {
  isLight: false,
  text: 'rgba(255,255,255,1)',
  textMuted: 'rgba(255,255,255,0.60)',
  textFaint: 'rgba(255,255,255,0.50)',
  textSubtle: 'rgba(255,255,255,0.40)',
  textGhost: 'rgba(255,255,255,0.30)',
  textDisabled: 'rgba(255,255,255,0.20)',
  border: 'rgba(255,255,255,0.10)',
  borderMuted: 'rgba(255,255,255,0.20)',
  borderStrong: 'rgba(255,255,255,0.30)',
  bgCard: 'rgba(255,255,255,0.10)',
  bgSkeleton: 'rgba(255,255,255,0.10)',
  bgOverlay: 'rgba(0,0,0,0.20)',
};

const LIGHT: ThemeColors = {
  isLight: true,
  text: '#111111',
  textMuted: 'rgba(0,0,0,0.60)',
  textFaint: 'rgba(0,0,0,0.50)',
  textSubtle: 'rgba(0,0,0,0.40)',
  textGhost: 'rgba(0,0,0,0.28)',
  textDisabled: 'rgba(0,0,0,0.18)',
  border: 'rgba(0,0,0,0.10)',
  borderMuted: 'rgba(0,0,0,0.15)',
  borderStrong: 'rgba(0,0,0,0.25)',
  bgCard: 'rgba(0,0,0,0.05)',
  bgSkeleton: 'rgba(0,0,0,0.08)',
  bgOverlay: 'rgba(255,255,255,0.50)',
};

export function useThemeColors(): ThemeColors {
  const { theme } = useBookingStore();
  return isLightGradient(theme.bgFrom, theme.bgTo) ? LIGHT : DARK;
}
