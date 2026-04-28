import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useSandClockStore, getDurationMs } from '@/state/store';

/**
 * Returns progress in [0,1] computed from wall-clock elapsed time.
 * Drift-free: re-derives progress on every animation frame.
 */
export const useTimer = (): number => {
  const runState = useSandClockStore((s) => s.runState);
  const startedAt = useSandClockStore((s) => s.startedAt);
  const armedPresetId = useSandClockStore((s) => s.armedPresetId);
  const finish = useSandClockStore((s) => s.finish);
  const durationMs = getDurationMs(armedPresetId);

  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (runState !== 'running' || !startedAt || durationMs <= 0) {
      setProgress(runState === 'finished' ? 1 : 0);
      return;
    }
    const tick = () => {
      const elapsed = Date.now() - startedAt;
      const p = Math.min(1, elapsed / durationMs);
      setProgress(p);
      if (p >= 1) {
        finish();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [runState, startedAt, durationMs, finish]);

  // Rehydrate progress when app foregrounds during a run.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        const s = useSandClockStore.getState();
        if (s.runState === 'running' && s.startedAt) {
          const d = getDurationMs(s.armedPresetId);
          if (d > 0 && Date.now() - s.startedAt >= d) finish();
        }
      }
    });
    return () => sub.remove();
  }, [finish]);

  return progress;
};
