import { Circle, Group } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { type HourglassGeometry } from './geometry';

type Props = {
  geom: HourglassGeometry;
  color: string;
  running: boolean;
  clockMs: number;
  reduceMotion: boolean;
};

const PARTICLE_COUNT = 6;
const FALL_MS = 600;

export const FallStream = ({ geom, color, running, clockMs, reduceMotion }: Props) => {
  const seeds = useMemo(
    () => Array.from({ length: PARTICLE_COUNT }, (_, i) => ({ phase: i / PARTICLE_COUNT })),
    [],
  );

  if (!running) return null;

  // Stream falls from the bottom of the top circle to the top of the bottom circle
  const top = geom.topCY + geom.circleR * 0.85;
  const bottom = geom.botCY - geom.circleR * 0.85;
  const span = bottom - top;

  if (span <= 0) return null;

  if (reduceMotion) {
    return (
      <Group>
        {seeds.map((s, i) => (
          <Circle
            key={i}
            cx={geom.cx}
            cy={top + s.phase * span}
            r={1.5}
            color={color}
            opacity={0.7}
          />
        ))}
      </Group>
    );
  }

  return (
    <Group>
      {seeds.map((s, i) => {
        const t = (clockMs / FALL_MS + s.phase) % 1;
        const y = top + t * span;
        const jitter = Math.sin((clockMs / 90) + i) * 1.5;
        return <Circle key={i} cx={geom.cx + jitter} cy={y} r={1.5} color={color} />;
      })}
    </Group>
  );
};
