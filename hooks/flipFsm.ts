// Pure flip-detection state machine. No React Native deps so it can be tested in isolation.

const FLIP_THRESHOLD_DEG = 150;
const UPRIGHT_THRESHOLD_DEG = 30;
const HOLD_MS = 400;

export type FlipState = 'upright' | 'candidate-flipped' | 'flipped' | 'candidate-upright';
export type MotionSample = { pitchDeg: number; t: number };

export const computeFlipTransition = (
  state: FlipState,
  candidateSince: number,
  sample: MotionSample,
): { state: FlipState; candidateSince: number; fired: 'flip' | 'upright' | null } => {
  const abs = Math.abs(sample.pitchDeg);
  switch (state) {
    case 'upright':
      if (abs >= FLIP_THRESHOLD_DEG)
        return { state: 'candidate-flipped', candidateSince: sample.t, fired: null };
      return { state, candidateSince, fired: null };
    case 'candidate-flipped':
      if (abs < FLIP_THRESHOLD_DEG) return { state: 'upright', candidateSince: 0, fired: null };
      if (sample.t - candidateSince >= HOLD_MS)
        return { state: 'flipped', candidateSince: 0, fired: 'flip' };
      return { state, candidateSince, fired: null };
    case 'flipped':
      if (abs <= UPRIGHT_THRESHOLD_DEG)
        return { state: 'candidate-upright', candidateSince: sample.t, fired: null };
      return { state, candidateSince, fired: null };
    case 'candidate-upright':
      if (abs > UPRIGHT_THRESHOLD_DEG)
        return { state: 'flipped', candidateSince: 0, fired: null };
      if (sample.t - candidateSince >= HOLD_MS)
        return { state: 'upright', candidateSince: 0, fired: 'upright' };
      return { state, candidateSince, fired: null };
  }
};
