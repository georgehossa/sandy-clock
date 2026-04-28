import { computeFlipTransition, type MotionSample } from '@/hooks/flipFsm';

const run = (samples: MotionSample[]) => {
  let state: ReturnType<typeof computeFlipTransition>['state'] = 'upright';
  let since = 0;
  const fired: Array<'flip' | 'upright'> = [];
  for (const s of samples) {
    const next = computeFlipTransition(state, since, s);
    state = next.state;
    since = next.candidateSince;
    if (next.fired) fired.push(next.fired);
  }
  return { state, fired };
};

// Helpers: phone held vertically (normZ ≈ 0) in either orientation.
// "upright" = resting state: top of phone pointing down, sand at bottom (normY ≈ +1).
// "flipped" = active state: top of phone pointing up, sand falling  (normY ≈ -1).
const upright = (t: number): MotionSample => ({ normY: 0.98, normZ: 0.05, t });
const flipped = (t: number): MotionSample => ({ normY: -0.98, normZ: 0.05, t });
const midFlip = (t: number): MotionSample => ({ normY: 0.0, normZ: 0.05, t });
const flat = (t: number): MotionSample => ({ normY: 0.1, normZ: 0.99, t }); // face-down on table

describe('flip detector state machine', () => {
  describe('sand-clock flip (portrait → portrait upside-down)', () => {
    it('fires flip after sustained inversion ≥ 400ms', () => {
      const samples: MotionSample[] = [
        upright(0),
        flipped(100),
        flipped(300),
        flipped(500), // 400ms held → fire
      ];
      const r = run(samples);
      expect(r.fired).toEqual(['flip']);
      expect(r.state).toBe('flipped');
    });

    it('does NOT fire on a brief flip under 400ms', () => {
      const samples: MotionSample[] = [
        upright(0),
        flipped(100), // candidate
        upright(350), // bailed at 250ms held → reset to upright
      ];
      const r = run(samples);
      expect(r.fired).toEqual([]);
      expect(r.state).toBe('upright');
    });

    it('fires upright after sustained re-upright ≥ 400ms following a flip', () => {
      const samples: MotionSample[] = [
        upright(0),
        flipped(100),
        flipped(600), // flip fired at 500ms
        upright(800), // candidate-upright
        upright(1300), // 500ms held → fire upright
      ];
      const r = run(samples);
      expect(r.fired).toEqual(['flip', 'upright']);
      expect(r.state).toBe('upright');
    });
  });

  describe('false-positive prevention', () => {
    it('does NOT fire on horizontal rotation (normY stays near 0, normZ swings)', () => {
      // Simulates rotating the phone like turning a steering wheel:
      // the Y axis stays near 0 throughout and never crosses -0.7
      const samples: MotionSample[] = [
        { normY: 0.98, normZ: 0.05, t: 0 },   // resting (sand at bottom)
        { normY: 0.5, normZ: 0.5, t: 100 },   // tilting sideways
        { normY: 0.0, normZ: 0.95, t: 200 },   // fully landscape / horizontal
        { normY: -0.5, normZ: 0.5, t: 300 },   // other side, but not past -0.7
        { normY: 0.98, normZ: 0.05, t: 500 },  // back to resting
      ];
      const r = run(samples);
      expect(r.fired).toEqual([]);
      expect(r.state).toBe('upright');
    });

    it('does NOT fire when phone is placed flat face-down on a table', () => {
      // normZ ≥ 0.5 → verticality guard blocks the transition
      const samples: MotionSample[] = [
        upright(0),
        flat(100),
        flat(300),
        flat(600), // would be 500ms+ but guard should block it
      ];
      const r = run(samples);
      expect(r.fired).toEqual([]);
      // State remains upright because the candidate-flipped transition was never entered
      expect(r.state).toBe('upright');
    });

    it('does NOT fire when normY crosses -0.7 but phone is nearly flat (normZ = 0.6)', () => {
      // Edge case: holding phone at a diagonal where both Y and Z are significant
      const samples: MotionSample[] = [
        { normY: 0.8, normZ: 0.05, t: 0 },
        { normY: -0.75, normZ: 0.6, t: 100 },  // normY ≤ -0.7 BUT normZ ≥ 0.5 → blocked
        { normY: -0.75, normZ: 0.6, t: 300 },
        { normY: -0.75, normZ: 0.6, t: 600 },
      ];
      const r = run(samples);
      expect(r.fired).toEqual([]);
      expect(r.state).toBe('upright');
    });

    it('does fire mid-flip through landscape if normY reaches threshold while vertical', () => {
      // Natural sand-clock flip: phone passes through landscape briefly
      // but the upside-down state is what matters
      const samples: MotionSample[] = [
        upright(0),
        midFlip(100),   // transitional — no trigger
        flipped(200),   // normY ≥ 0.7, normZ small → candidate starts
        flipped(400),
        flipped(650),   // 450ms held → fire
      ];
      const r = run(samples);
      expect(r.fired).toEqual(['flip']);
    });
  });
});
