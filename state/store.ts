import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  DEFAULT_TONE,
  PRESET_DURATIONS_MS,
  type PresetId,
  type ToneId,
} from './presets';

export type RunState = 'idle' | 'armed' | 'running' | 'finished';
export type LanguagePref = 'en' | 'es' | 'system';

type PersistedSlice = {
  tone: ToneId;
  language: LanguagePref;
  // Run context — persisted so cold-boot after force-kill can resume a run
  runState: RunState;
  armedPresetId: PresetId | null;
  startedAt: number | null;
};

type Actions = {
  setTone: (tone: ToneId) => void;
  setLanguage: (lang: LanguagePref) => void;
  arm: (id: PresetId) => void;
  start: () => void;
  reset: () => void;
  stop: () => void;
  finish: () => void;
};

export type SandClockStore = PersistedSlice & Actions;

const initialPersisted: PersistedSlice = {
  tone: DEFAULT_TONE,
  language: 'system',
  runState: 'idle',
  armedPresetId: null,
  startedAt: null,
};

export const useSandClockStore = create<SandClockStore>()(
  persist(
    (set, get) => ({
      ...initialPersisted,

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
        tone: s.tone,
        language: s.language,
        runState: s.runState,
        armedPresetId: s.armedPresetId,
        startedAt: s.startedAt,
      }),
      version: 6,
      migrate: (_state, _version) => {
        // v6: run context (runState, armedPresetId, startedAt) now persisted
        //     for cold-boot resume. Reset all prior persisted state to defaults.
        return { ...initialPersisted };
      },
      onRehydrateStorage: () => (state) => {
        // On cold boot: validate a restored run. If the timer has already
        // elapsed (or state is stale), reset to idle rather than showing a
        // ghost run from a previous session.
        if (!state) return;
        if (state.runState === 'running' && state.startedAt && state.armedPresetId) {
          const durationMs = PRESET_DURATIONS_MS[state.armedPresetId] ?? 0;
          const elapsed = Date.now() - state.startedAt;
          if (elapsed >= durationMs) {
            // Timer finished while the app was killed — snap to idle (not
            // 'finished', since we can't reliably play the tone on cold boot).
            state.runState = 'idle';
            state.startedAt = null;
          }
          // else: elapsed < durationMs — run is still live, useTimer will
          // pick up from the persisted startedAt and resume correctly.
        } else if (state.runState === 'running') {
          // runState is running but missing context — reset defensively.
          state.runState = 'idle';
          state.startedAt = null;
          state.armedPresetId = null;
        }
      },
    },
  ),
);

export const getDurationMs = (id: PresetId | null): number =>
  id ? PRESET_DURATIONS_MS[id] : 0;
