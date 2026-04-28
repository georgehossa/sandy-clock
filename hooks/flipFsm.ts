// Pure flip-detection state machine. No React Native deps so it can be tested in isolation.

const FLIP_THRESHOLD_NORMY = 0.7;
const VERTICAL_GUARD_NORMZ = 0.6; // |normZ| must be below this to confirm a flip
const HOLD_MS = 400;

export type FlipState = 'upright' | 'candidate-flipped' | 'flipped' | 'candidate-upright';

/**
 * normY: normalized Y gravity component (y / |gravity|).
 *   Both platforms (after per-path sign correction in useFlipDetector):
 *   ≈ -1  →  upright / resting: phone held normally, gravity pulling down along -Y.
 *             Sand is settled at bottom, ready to be flipped.
 *   ≈ +1  →  flipped / running: phone rotated 180°, top pointing down.
 *             Sand is falling, timer is running.
 *
 * normZ: normalized Z gravity component (z / |gravity|).
 *   |normZ| ≥ 0.6  →  phone is lying flat (screen roughly parallel to floor).
 *   Used as a verticality guard at flip confirmation (not entry) to prevent
 *   flat-on-table placements from triggering while allowing the natural rotation
 *   gesture where normZ spikes mid-rotation.
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
      // "upright" = resting position (normY ≈ -1, sand at bottom).
      // Enter candidate when normY crosses +0.7 (phone rotated toward upside-down).
      // No vertical guard here — normZ spikes mid-rotation are expected.
      if (sample.normY >= FLIP_THRESHOLD_NORMY)
        return { state: 'candidate-flipped', candidateSince: sample.t, fired: null };
      return { state, candidateSince, fired: null };
    case 'candidate-flipped':
      // Bail out if normY drifts back below threshold.
      if (sample.normY < FLIP_THRESHOLD_NORMY)
        return { state: 'upright', candidateSince: 0, fired: null };
      // Confirm flip only after debounce AND phone has settled vertically.
      // If time has elapsed but phone is still flat (|normZ| >= 0.6),
      // remain in candidate-flipped and keep waiting for it to settle.
      if (sample.t - candidateSince >= HOLD_MS && isVertical)
        return { state: 'flipped', candidateSince: 0, fired: 'flip' };
      return { state, candidateSince, fired: null };
    case 'flipped':
      // Returns to "upright" when user rotates back (normY crosses -0.7).
      if (sample.normY <= -FLIP_THRESHOLD_NORMY)
        return { state: 'candidate-upright', candidateSince: sample.t, fired: null };
      return { state, candidateSince, fired: null };
    case 'candidate-upright':
      if (sample.normY > -FLIP_THRESHOLD_NORMY)
        return { state: 'flipped', candidateSince: 0, fired: null };
      if (sample.t - candidateSince >= HOLD_MS)
        return { state: 'upright', candidateSince: 0, fired: 'upright' };
      return { state, candidateSince, fired: null };
  }
};
