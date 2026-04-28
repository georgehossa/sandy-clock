import { Path, Skia } from '@shopify/react-native-skia';
import { useMemo } from 'react';

type Props = {
  cx: number;
  cy: number;
  r: number;
  /** progress in [0,1]. 0 = full top / empty bottom. 1 = empty top / full bottom. */
  progress: number;
  color: string;
  chamber: 'top' | 'bottom';
};

const DEG = Math.PI / 180;

/**
 * Build a pie-sector path centered at (cx, cy) with radius r.
 * startAngleDeg: start angle in degrees (0 = right, 90 = down, CSS convention)
 * sweepDeg: arc sweep in degrees (positive = clockwise)
 */
const buildPiePath = (
  cx: number,
  cy: number,
  r: number,
  startAngleDeg: number,
  sweepDeg: number,
) => {
  const path = Skia.Path.Make();
  if (sweepDeg <= 0) return path;
  if (sweepDeg >= 360) {
    // Full circle
    path.addCircle(cx, cy, r);
    return path;
  }

  const startRad = startAngleDeg * DEG;
  const endRad = (startAngleDeg + sweepDeg) * DEG;

  path.moveTo(cx, cy);
  path.lineTo(cx + r * Math.cos(startRad), cy + r * Math.sin(startRad));

  // Build arc via arcToOval
  const oval = { x: cx - r, y: cy - r, width: r * 2, height: r * 2 };
  path.arcToOval(oval, startAngleDeg, sweepDeg, false);
  path.close();
  return path;
};

export const SandBody = ({ cx, cy, r, progress, color, chamber }: Props) => {
  const path = useMemo(() => {
    if (chamber === 'top') {
      // Top chamber: full at progress=0, empty at progress=1
      const sweep = 360 * (1 - progress);
      if (sweep < 1) return Skia.Path.Make();
      // Anchor at the bottom of the circle (270°) so sand drains downward
      // Start = 270 - sweep/2, sweep clockwise
      const startAngle = 270 - sweep / 2;
      return buildPiePath(cx, cy, r, startAngle, sweep);
    } else {
      // Bottom chamber: empty at progress=0, full at progress=1
      const sweep = 360 * progress;
      if (sweep < 1) return Skia.Path.Make();
      // Anchor at the top of the circle (270° = bottom, so top = 90°... but we
      // want sand to pile up from the bottom of the bottom circle upward).
      // Start = 90 + (360 - sweep)/2 so it grows symmetrically from the bottom.
      const startAngle = 270 - sweep / 2;
      return buildPiePath(cx, cy, r, startAngle, sweep);
    }
  }, [cx, cy, r, progress, chamber]);

  return <Path path={path} color={color} />;
};
