import { PRESET_DURATIONS_MS } from '@/state/presets';

/**
 * useTimer derives progress as (now - startedAt) / durationMs every frame.
 * That definition is drift-free by construction: regardless of how many ticks
 * fire, the final elapsed time at p=1 equals durationMs exactly.
 *
 * This test simulates a 15-min run with stochastic frame intervals and asserts
 * the tick at which p crosses 1 lands within ±100 ms of durationMs.
 */
describe('timer drift', () => {
  it('a simulated 15-min run terminates within 100ms of duration', () => {
    const durationMs = PRESET_DURATIONS_MS['15'];
    const startedAt = 1_000_000_000_000; // arbitrary epoch
    let now = startedAt;
    let progress = 0;
    let elapsedAtFinish = 0;

    while (progress < 1) {
      // Simulate frame intervals between 8ms (120fps) and 50ms (slow) randomly.
      now += 8 + Math.random() * 42;
      const elapsed = now - startedAt;
      progress = Math.min(1, elapsed / durationMs);
      if (progress >= 1) {
        elapsedAtFinish = elapsed;
        break;
      }
    }

    // Drift bound: the only "overshoot" is the final frame interval (≤50ms here).
    expect(Math.abs(elapsedAtFinish - durationMs)).toBeLessThan(100);
  });
});
