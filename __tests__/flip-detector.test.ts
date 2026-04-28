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
// Corrected sign convention (both platforms after per-path sign correction):
//   normY ≈ -1  →  upright / resting (phone held normally, gravity pulling down)
//   normY ≈ +1  →  flipped / running (phone rotated 180°, top pointing down)
const upright = (t: number): MotionSample => ({ normY: -0.98, normZ: 0.05, t });
const flipped = (t: number): MotionSample => ({ normY: 0.98, normZ: 0.05, t });
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
      // the Y axis stays near 0 throughout and never crosses +0.7
      const samples: MotionSample[] = [
        { normY: -0.98, normZ: 0.05, t: 0 },  // resting (upright)
        { normY: -0.5, normZ: 0.5, t: 100 },  // tilting sideways
        { normY: 0.0, normZ: 0.95, t: 200 },   // fully landscape / horizontal
        { normY: 0.5, normZ: 0.5, t: 300 },    // other side, but not past +0.7
        { normY: -0.98, normZ: 0.05, t: 500 }, // back to resting
      ];
      const r = run(samples);
      expect(r.fired).toEqual([]);
      expect(r.state).toBe('upright');
    });

    it('does NOT fire when phone is placed flat face-down on a table', () => {
      // normY never crosses +0.7, so candidate is never entered
      const samples: MotionSample[] = [
        upright(0),
        flat(100),
        flat(300),
        flat(600),
      ];
      const r = run(samples);
      expect(r.fired).toEqual([]);
      expect(r.state).toBe('upright');
    });

    it('does NOT fire when normY crosses +0.7 but phone stays flat (normZ = 0.7)', () => {
      // Guard at confirmation blocks: normY crosses threshold but
      // phone is flat (|normZ| >= 0.6) throughout the debounce period
      const samples: MotionSample[] = [
        { normY: -0.8, normZ: 0.05, t: 0 },
        { normY: 0.75, normZ: 0.7, t: 100 },  // normY ≥ 0.7 → enters candidate
        { normY: 0.75, normZ: 0.7, t: 300 },   // still flat
        { normY: 0.75, normZ: 0.7, t: 600 },   // 500ms elapsed, but |normZ| ≥ 0.6 → blocked
      ];
      const r = run(samples);
      expect(r.fired).toEqual([]);
      // Stays in candidate-flipped (keeps waiting) — NOT reset to upright
      expect(r.state).toBe('candidate-flipped');
    });

    it('does fire mid-flip through landscape if normY reaches threshold while vertical', () => {
      // Natural sand-clock flip: phone passes through landscape briefly
      // but the upside-down state is what matters
      const samples: MotionSample[] = [
        upright(0),
        midFlip(100),   // transitional — no trigger
        flipped(200),   // normY ≥ 0.7, enters candidate (no Z guard at entry)
        flipped(400),
        flipped(650),   // 450ms held + vertical → fire
      ];
      const r = run(samples);
      expect(r.fired).toEqual(['flip']);
    });
  });

  describe('vertical guard at confirmation (not entry)', () => {
    it('enters candidate even when normZ is high mid-rotation', () => {
      // During rotation, normZ spikes. The old code blocked entry here.
      // New code allows entry and checks Z only at confirmation.
      const samples: MotionSample[] = [
        upright(0),
        { normY: 0.8, normZ: 0.8, t: 100 }, // normY ≥ 0.7, normZ high → enters candidate (no Z guard)
      ];
      const r = run(samples);
      expect(r.state).toBe('candidate-flipped');
    });

    it('fires flip when normZ spikes mid-rotation but settles below 0.6 after 400ms', () => {
      // Simulates natural rotation: normZ spikes during transition,
      // then settles as the phone completes the rotation
      const samples: MotionSample[] = [
        upright(0),
        { normY: 0.85, normZ: 0.8, t: 100 },  // enters candidate (Z high but no guard at entry)
        { normY: 0.90, normZ: 0.7, t: 200 },   // still rotating, Z still high
        { normY: 0.95, normZ: 0.4, t: 400 },   // settling down
        { normY: 0.98, normZ: 0.1, t: 550 },   // 450ms held, Z settled → fire
      ];
      const r = run(samples);
      expect(r.fired).toEqual(['flip']);
      expect(r.state).toBe('flipped');
    });

    it('does NOT fire when normZ stays above 0.6 after 400ms (flat-on-table)', () => {
      // Phone is flipped but lying flat — guard blocks at confirmation
      const samples: MotionSample[] = [
        upright(0),
        { normY: 0.8, normZ: 0.7, t: 100 },  // enters candidate
        { normY: 0.8, normZ: 0.8, t: 300 },   // still flat
        { normY: 0.8, normZ: 0.9, t: 600 },   // 500ms elapsed, still flat → blocked
        { normY: 0.8, normZ: 0.85, t: 900 },  // still blocked
      ];
      const r = run(samples);
      expect(r.fired).toEqual([]);
      expect(r.state).toBe('candidate-flipped');
    });

    it('stays in candidate-flipped (keeps waiting) when time elapsed but phone still flat', () => {
      // FSM should NOT reset to upright — it stays in candidate and waits
      // for the phone to settle vertically
      const samples: MotionSample[] = [
        upright(0),
        { normY: 0.85, normZ: 0.3, t: 100 },  // enters candidate
        { normY: 0.85, normZ: 0.8, t: 300 },   // phone goes flat during hold
        { normY: 0.85, normZ: 0.75, t: 600 },  // 500ms elapsed, still flat
      ];
      const r = run(samples);
      expect(r.fired).toEqual([]);
      // Critically: stays in candidate, does NOT reset to upright
      expect(r.state).toBe('candidate-flipped');
    });

    it('fires flip after phone settles even if it was flat for a long time', () => {
      // Phone was flat for a while but eventually the user picks it up
      const samples: MotionSample[] = [
        upright(0),
        { normY: 0.85, normZ: 0.3, t: 100 },  // enters candidate
        { normY: 0.85, normZ: 0.8, t: 300 },   // goes flat
        { normY: 0.85, normZ: 0.8, t: 600 },   // still flat (debounce passed but blocked)
        { normY: 0.85, normZ: 0.8, t: 1000 },  // still flat
        { normY: 0.90, normZ: 0.2, t: 1200 },  // user tilts phone vertical → fires!
      ];
      const r = run(samples);
      expect(r.fired).toEqual(['flip']);
      expect(r.state).toBe('flipped');
    });
  });
});
