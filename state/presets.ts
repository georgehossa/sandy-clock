import { theme } from '@/lib/theme';

export type PresetId = '5' | '10' | '15' | '25' | '30';

export const PRESET_IDS: PresetId[] = ['5', '10', '15', '25', '30'];

export const PRESET_DURATIONS_MS: Record<PresetId, number> = {
  '5': 5 * 60 * 1000,
  '10': 10 * 60 * 1000,
  '15': 15 * 60 * 1000,
  '25': 25 * 60 * 1000,
  '30': 30 * 60 * 1000,
};

export const PALETTE = {
  mintGreen: '#B0D4C8',
  sandOrange: '#D98B5C',
  slateBlue: '#7B9EC4',
  mauve: '#B87BA8',
  warmGrey: '#9AADA5',
  deepTeal: '#2D3B36',
} as const;

export const PALETTE_COLORS: string[] = Object.values(PALETTE);

export const DEFAULT_PRESET_COLORS: Record<PresetId, string> = {
  '5': PALETTE.mintGreen,
  '10': PALETTE.sandOrange,
  '15': PALETTE.slateBlue,
  '25': PALETTE.mauve,
  '30': PALETTE.warmGrey,
};

export type ToneId = 'bubble-pop' | 'magic-chime' | 'soft-bell';

export const TONE_IDS: ToneId[] = ['bubble-pop', 'magic-chime', 'soft-bell'];

export const DEFAULT_TONE: ToneId = 'magic-chime';
