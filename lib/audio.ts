import { setAudioModeAsync } from 'expo-audio';
import type { ToneId } from '@/state/presets';

export const configureAudioSession = async () => {
  // Respect system mute / silent switch. Do NOT override silent mode.
  await setAudioModeAsync({
    playsInSilentMode: false,
    shouldPlayInBackground: false,
    interruptionMode: 'doNotMix',
  });
};

// Bundled tones. NOTE: actual files must be placed at assets/audio/<id>.m4a.
// See assets/audio/SOURCES.md for provenance. The try/catch lets the dev
// server start without the files; once they exist, requires resolve normally.
const tryRequire = (id: ToneId): ReturnType<typeof require> | null => {
  try {
    if (id === 'bubble-pop') return require('@/assets/audio/bubble-pop.m4a');
    if (id === 'magic-chime') return require('@/assets/audio/magic-chime.m4a');
    if (id === 'soft-bell') return require('@/assets/audio/soft-bell.m4a');
  } catch {
    return null;
  }
  return null;
};

export const TONE_ASSETS: Record<ToneId, ReturnType<typeof require> | null> = {
  'bubble-pop': tryRequire('bubble-pop'),
  'magic-chime': tryRequire('magic-chime'),
  'soft-bell': tryRequire('soft-bell'),
};
