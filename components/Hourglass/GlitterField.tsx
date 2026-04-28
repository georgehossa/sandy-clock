import { Circle, Group } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { type HourglassGeometry } from './geometry';

type Props = {
  geom: HourglassGeometry;
  color: string;
  count: number;
  progress: number; // 0 = full top / empty bottom, 1 = empty top / full bottom
  clockMs: number;
};

type ParticleSeed = { angle: number; dist: number; phase: number };

const seedsForChamber = (count: number): ParticleSeed[] =>
  Array.from({ length: count }, (_, i) => ({
    angle: Math.random() * 2 * Math.PI,
    dist: Math.sqrt(Math.random()) * 0.75, // sqrt for uniform distribution in circle
    phase: (i * 137.508) % 360,
  }));

export const GlitterField = ({ geom, color, count, progress, clockMs }: Props) => {
  const topSeeds = useMemo(() => seedsForChamber(count), [count]);
  const botSeeds = useMemo(() => seedsForChamber(count), [count]);

  if (count <= 0) return null;

  // How much of each circle is filled with sand
  const topFill = 1 - progress;   // 1 = full at progress=0
  const botFill = progress;       // 1 = full at progress=1

  const renderChamber = (
    seeds: ParticleSeed[],
    cx: number,
    cy: number,
    r: number,
    fill: number,
    keyPrefix: string,
  ) => {
    if (fill < 0.02) return null;
    // Sand fills from bottom-center of circle upward. Particles should only
    // appear in the lower arc. We approximate by filtering by angle.
    // For fill=1: entire circle. For fill=0.5: lower half.
    // The cutoff angle from bottom (270°) is: sweepAngle/2 on each side.
    const halfSweep = Math.PI * fill; // 0..π radians from bottom on each side

    return seeds.map((s, i) => {
      // Rotate seed angle so 0 = bottom of circle (pointing down)
      const seedAngle = s.angle; // already random 0..2π
      // Check if this particle is within the sand arc region
      // Bottom of circle = π/2 downward in standard math = 3π/2 in screen coords
      // We use a simple approach: map angle relative to bottom
      const angleFromBottom = Math.abs(((seedAngle - (3 * Math.PI / 2) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI);
      if (angleFromBottom > halfSweep) return null;

      const px = cx + s.dist * r * Math.cos(seedAngle);
      const py = cy + s.dist * r * Math.sin(seedAngle);
      const shimmer = 0.55 + 0.45 * Math.sin((clockMs / 200) + s.phase);
      return (
        <Circle
          key={`${keyPrefix}-${i}`}
          cx={px}
          cy={py}
          r={0.9 + 0.7 * shimmer}
          color={color}
          opacity={0.35 + 0.65 * shimmer}
        />
      );
    });
  };

  return (
    <Group>
      {renderChamber(topSeeds, geom.cx, geom.topCY, geom.sandR, topFill, 'top')}
      {renderChamber(botSeeds, geom.cx, geom.botCY, geom.sandR, botFill, 'bot')}
    </Group>
  );
};
