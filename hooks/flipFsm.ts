// Pure flip-detection state machine. No React Native deps so it can be tested in isolation.

const FLIP_THRESHOLD_NORMY = 0.7;
const UPRIGHT_THRESHOLD_NORMY = -0.7;
const VERTICAL_GUARD_NORMZ = 0.5; // |normZ| must be below this to be "held upright"
const HOLD_MS = 400;

export type FlipState = 'upright' | 'candidate-flipped' | 'flipped' | 'candidate-upright';

/**
 * normY: normalized Y gravity component (y / |gravity|).
 *   ≈ +1  →  resting state: top of phone pointing down (sand at bottom, like a real sand clock
 *             sitting on a table — bottom-heavy, ready to be flipped).
 *   ≈ -1  →  flipped state: top of phone pointing up (sand flowing, timer running).
 *
 * normZ: normalized Z gravity component (z / |gravity|).
 *   |normZ| ≥ 0.5  →  phone is lying flat (screen roughly parallel to floor).
 *   Used as a verticality guard to prevent flat-on-table placements from triggering.
 */
export type MotionSample = { normY: number; normZ: number; t: number };

export const computeFlipTransition = (
  state: FlipState,
  candidateSince: number,
  sample: MotionSample,
): { state: FlipState; candidateSince: number; fired: 'flip' | 'upright' | null } => {
  const isVertical = Math.abs(sample.normZ) < VERTICAL_GUARD_NORMZ;
  switch (state) {
    case 'upright':
      // "upright" = resting position (normY ≈ +1, sand at bottom).
      // Flip fires when user rotates to normY ≈ -1 (top up, sand starts falling).
      if (isVertical && sample.normY <= -FLIP_THRESHOLD_NORMY)
        return { state: 'candidate-flipped', candidateSince: sample.t, fired: null };
      return { state, candidateSince, fired: null };
    case 'candidate-flipped':
      if (sample.normY > -FLIP_THRESHOLD_NORMY)
        return { state: 'upright', candidateSince: 0, fired: null };
      if (sample.t - candidateSince >= HOLD_MS)
        return { state: 'flipped', candidateSince: 0, fired: 'flip' };
      return { state, candidateSince, fired: null };
    case 'flipped':
      // Returns to "upright" when user flips back to resting (normY ≈ +1).
      if (sample.normY >= -UPRIGHT_THRESHOLD_NORMY)
        return { state: 'candidate-upright', candidateSince: sample.t, fired: null };
      return { state, candidateSince, fired: null };
    case 'candidate-upright':
      if (sample.normY < -UPRIGHT_THRESHOLD_NORMY)
        return { state: 'flipped', candidateSince: 0, fired: null };
      if (sample.t - candidateSince >= HOLD_MS)
        return { state: 'upright', candidateSince: 0, fired: 'upright' };
      return { state, candidateSince, fired: null };
  }
};
