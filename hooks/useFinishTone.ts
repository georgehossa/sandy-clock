import { useAudioPlayer } from 'expo-audio';
import { useEffect, useRef } from 'react';
import { TONE_ASSETS } from '@/lib/audio';
import { useSandClockStore } from '@/state/store';

/**
 * Plays the active finish tone exactly once when runState transitions to
 * "finished". Also re-mounts the player when the parent changes the tone in
 * settings (preview-on-tap) — by re-keying via the source asset.
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
    playPreview: () => {
      try {
        player.seekTo(0);
        player.play();
      } catch {
        /* noop */
      }
    },
  };
};
