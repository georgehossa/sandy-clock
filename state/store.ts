import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  DEFAULT_PRESET_COLORS,
  DEFAULT_TONE,
  PALETTE_COLORS,
  PRESET_DURATIONS_MS,
  type PresetId,
  type ToneId,
} from './presets';

export type RunState = 'idle' | 'armed' | 'running' | 'finished';
export type LanguagePref = 'en' | 'es' | 'system';

type PersistedSlice = {
  presetColors: Record<PresetId, string>;
  tone: ToneId;
  language: LanguagePref;
};

type EphemeralSlice = {
  runState: RunState;
  armedPresetId: PresetId | null;
  startedAt: number | null;
};

type Actions = {
  setPresetColor: (id: PresetId, color: string) => void;
  setTone: (tone: ToneId) => void;
  setLanguage: (lang: LanguagePref) => void;
  arm: (id: PresetId) => void;
  start: () => void;
  reset: () => void;
  stop: () => void;
  finish: () => void;
};

export type SandClockStore = PersistedSlice & EphemeralSlice & Actions;

const initialPersisted: PersistedSlice = {
  presetColors: { ...DEFAULT_PRESET_COLORS },
  tone: DEFAULT_TONE,
  language: 'system',
};

const initialEphemeral: EphemeralSlice = {
  runState: 'idle',
  armedPresetId: null,
  startedAt: null,
};

export const useSandClockStore = create<SandClockStore>()(
  persist(
    (set, get) => ({
      ...initialPersisted,
      ...initialEphemeral,

      setPresetColor: (id, color) => {
        if (!PALETTE_COLORS.includes(color)) return;
        set((s) => ({ presetColors: { ...s.presetColors, [id]: color } }));
      },

      setTone: (tone) => set({ tone }),

      setLanguage: (language) => set({ language }),

      arm: (id) => {
        const s = get();
        if (s.runState === 'running') return;
        set({ runState: 'armed', armedPresetId: id, startedAt: null });
      },

      start: () => {
        const s = get();
        if (!s.armedPresetId) return;
        set({ runState: 'running', startedAt: Date.now() });
      },

      reset: () => {
        const s = get();
        if (!s.armedPresetId) {
          set({ runState: 'idle', startedAt: null });
          return;
        }
        // Mid-run reset re-arms the same preset and immediately restarts
        set({ runState: 'running', startedAt: Date.now() });
      },

      stop: () => set({ runState: 'idle', armedPresetId: null, startedAt: null }),

      finish: () => set({ runState: 'finished' }),
    }),
    {
      name: 'sand-clock-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s): PersistedSlice => ({
        presetColors: s.presetColors,
        tone: s.tone,
        language: s.language,
      }),
      version: 2,
      migrate: (_state, _version) => {
        // v1 → v2: preset IDs changed from [3,5,10,15] to [5,10,15,25,30].
        // Drop persisted presetColors so defaults are re-applied.
        return { ...initialPersisted };
      },
    },
  ),
);

export const getDurationMs = (id: PresetId | null): number =>
  id ? PRESET_DURATIONS_MS[id] : 0;
