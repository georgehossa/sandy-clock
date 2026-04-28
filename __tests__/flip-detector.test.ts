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

describe('flip detector state machine', () => {
  it('fires flip after sustained inversion ≥ 400ms', () => {
    const samples: MotionSample[] = [
      { pitchDeg: 5, t: 0 },
      { pitchDeg: 160, t: 100 },
      { pitchDeg: 165, t: 300 },
      { pitchDeg: 170, t: 500 }, // 400ms held → fire
    ];
    const r = run(samples);
    expect(r.fired).toEqual(['flip']);
    expect(r.state).toBe('flipped');
  });

  it('does NOT fire on a brief flip under 400ms', () => {
    const samples: MotionSample[] = [
      { pitchDeg: 5, t: 0 },
      { pitchDeg: 160, t: 100 }, // candidate
      { pitchDeg: 10, t: 350 }, // bailed at 250ms held → reset to upright
    ];
    const r = run(samples);
    expect(r.fired).toEqual([]);
    expect(r.state).toBe('upright');
  });

  it('fires upright after sustained re-upright ≥ 400ms following a flip', () => {
    const samples: MotionSample[] = [
      { pitchDeg: 5, t: 0 },
      { pitchDeg: 160, t: 100 },
      { pitchDeg: 170, t: 600 }, // flip fired at 500ms
      { pitchDeg: 10, t: 800 }, // candidate-upright
      { pitchDeg: 5, t: 1300 }, // 500ms held → fire upright
    ];
    const r = run(samples);
    expect(r.fired).toEqual(['flip', 'upright']);
    expect(r.state).toBe('upright');
  });
});
