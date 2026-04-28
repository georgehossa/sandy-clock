import { useAudioPlayer, createAudioPlayer } from 'expo-audio';
import { useEffect, useRef } from 'react';
import { TONE_ASSETS } from '@/lib/audio';
import { useSandClockStore } from '@/state/store';
import type { ToneId } from '@/state/presets';

/**
 * Plays the active finish tone exactly once when runState transitions to
 * "finished".
 *
 * Also exposes `playPreviewFor(id)` which creates a short-lived player for the
 * given tone id so the preview plays the *chosen* tone regardless of what the
 * store currently holds. This avoids the stale-closure crash that happens when
 * `setTone(id)` is called first: expo-audio destroys the old player on the next
 * render, and any pending callback that still references it throws
 * "Unable to find the native shared object".
 */
export const useFinishTone = () => {
  const tone = useSandClockStore((s) => s.tone);
  const runState = useSandClockStore((s) => s.runState);

  const source = TONE_ASSETS[tone] ?? null;
  const player = useAudioPlayer(source);
  const lastFinishedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (runState === 'finished' && lastFinishedAtRef.current !== Date.now()) {
      lastFinishedAtRef.current = Date.now();
      try {
        player.seekTo(0);
        player.play();
      } catch {
        /* noop */
      }
    }
  }, [runState, player]);

  return {
    /**
     * Play a preview for an explicit tone id. Creates a throwaway player so
     * the preview is not affected by the store's current (or about-to-change)
     * tone value.
     */
    playPreviewFor: (id: ToneId) => {
      const asset = TONE_ASSETS[id];
      if (!asset) return;
      try {
        const preview = createAudioPlayer(asset);
        preview.play();
        // Release the native player once playback ends (fire-and-forget).
        const checkDone = setInterval(() => {
          if (!preview.playing) {
            clearInterval(checkDone);
            preview.remove();
          }
        }, 300);
      } catch {
        /* noop */
      }
    },
  };
};
