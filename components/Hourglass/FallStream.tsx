import { RoundedRect } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import { type SharedValue } from 'react-native-reanimated';
import { liquidLevelY, type HourglassGeometry } from './geometry';

type Props = {
  geom: HourglassGeometry;
  color: string;
  /** timerProgress in [0,1] — used to fade stream as top chamber empties */
  progress: number;
  /** Fill fraction of the bottom chamber [0,1] — positions stream bottom at liquid surface */
  bottomFraction: number;
  running: boolean;
  clock: SharedValue<number>;
  reduceMotion: boolean;
};

const MIN_WIDTH = 2;
const MAX_WIDTH = 4;
const OSCILLATION_PERIOD_MS = 400;
const CORNER_R = 1;

/**
 * Renders the liquid pour stream inside the bottom chamber.
 *
 * Starts at the top of the bottom circle and ends at the current liquid surface.
 * As the bottom fills, the surface rises and the stream shortens until it disappears.
 * Width oscillates on the UI thread via useDerivedValue to avoid reading clock.value
 * during render.
 */
export const FallStream = ({ geom, color, progress, bottomFraction, running, clock, reduceMotion }: Props) => {
  // Hooks must run before early returns
  const animatedWidth = useDerivedValue(() => {
    const phase = (clock.value % OSCILLATION_PERIOD_MS) / OSCILLATION_PERIOD_MS;
    return MIN_WIDTH + (MAX_WIDTH - MIN_WIDTH) * 0.5 * (1 + Math.sin(phase * 2 * Math.PI));
  });

  const animatedX = useDerivedValue(() => geom.cx - animatedWidth.value / 2);

  if (!running) return null;

  const streamTop = geom.botCY - geom.sandR;
  const streamBottom = liquidLevelY(bottomFraction, geom.botCY, geom.sandR);
  const streamHeight = streamBottom - streamTop;

  if (streamHeight <= 0) return null;

  if (reduceMotion) {
    const staticWidth = (MIN_WIDTH + MAX_WIDTH) / 2;
    return (
      <RoundedRect
        x={geom.cx - staticWidth / 2}
        y={streamTop}
        width={staticWidth}
        height={streamHeight}
        r={CORNER_R}
        color={color}
        opacity={0.5}
      />
    );
  }

  const clampedProgress = Math.max(0, Math.min(1, progress));
  const opacity = (1 - clampedProgress) * 0.85 + 0.15;

  return (
    <RoundedRect
      x={animatedX}
      y={streamTop}
      width={animatedWidth}
      height={streamHeight}
      r={CORNER_R}
      color={color}
      opacity={opacity}
    />
  );
};
