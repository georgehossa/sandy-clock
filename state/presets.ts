export type PresetId = '3' | '5' | '10' | '15';

export const PRESET_IDS: PresetId[] = ['3', '5', '10', '15'];

export const PRESET_DURATIONS_MS: Record<PresetId, number> = {
  '3': 3 * 60 * 1000,
  '5': 5 * 60 * 1000,
  '10': 10 * 60 * 1000,
  '15': 15 * 60 * 1000,
};

/** Fixed sand color per preset — matches Pencil design timer tile colors exactly. */
export const DEFAULT_PRESET_COLORS: Record<PresetId, string> = {
  '3': '#E8945A',   // sand orange
  '5': '#7B9ACC',   // slate blue
  '10': '#C47EA0',  // mauve/pink
  '15': '#C8A84A',  // gold
};

export type ToneId = 'bubble-pop' | 'magic-chime' | 'soft-bell';

export const TONE_IDS: ToneId[] = ['bubble-pop', 'magic-chime', 'soft-bell'];

export const DEFAULT_TONE: ToneId = 'magic-chime';
