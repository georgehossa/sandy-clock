import { Group, Line, Path, Skia, vec } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import { type SharedValue } from 'react-native-reanimated';
import { type DeviceTier } from '@/lib/deviceTier';
import { lightenHex } from '@/lib/colorUtils';
import { liquidLevelY, type HourglassGeometry } from './geometry';

type Props = {
  geom: HourglassGeometry;
  color: string;
  /** topFraction in [0,1]: fraction of liquid in the top chamber */
  topFraction: number;
  clock: SharedValue<number>;
  tier: DeviceTier;
  reduceMotion: boolean;
};

const HIGHLIGHT_HEIGHT = 6;
const WAVE_SEGMENTS = 10;
const WAVE_AMPLITUDE = 1.5;
const WAVE_PERIOD_MS = 1800;

export const LiquidSurface = ({ geom, color, topFraction, clock, tier, reduceMotion }: Props) => {
  if (reduceMotion || tier === 'low') return null;

  const showWave = tier === 'high';
  const highlightColor = lightenHex(color, 0.45);
  const botFraction = 1 - topFraction;

  const topVisible = topFraction > 0.02 && topFraction < 0.98;
  const botVisible = botFraction > 0.02 && botFraction < 0.98;

  return (
    <Group>
      {topVisible && (
        <ChamberSurface
          cx={geom.cx}
          cy={geom.topCY}
          sandR={geom.sandR}
          levelY={liquidLevelY(topFraction, geom.topCY, geom.sandR)}
          color={color}
          highlightColor={highlightColor}
          showWave={showWave}
          clock={clock}
          chamberKey="top"
        />
      )}
      {botVisible && (
        <ChamberSurface
          cx={geom.cx}
          cy={geom.botCY}
          sandR={geom.sandR}
          levelY={liquidLevelY(botFraction, geom.botCY, geom.sandR)}
          color={color}
          highlightColor={highlightColor}
          showWave={showWave}
          clock={clock}
          chamberKey="bot"
        />
      )}
    </Group>
  );
};

// ─── Internal: per-chamber surface effects ──────────────────────────────────

type ChamberSurfaceProps = {
  cx: number;
  cy: number;
  sandR: number;
  levelY: number;
  color: string;
  highlightColor: string;
  showWave: boolean;
  clock: SharedValue<number>;
  chamberKey: string;
};

const ChamberSurface = ({
  cx,
  cy,
  sandR,
  levelY,
  color,
  highlightColor,
  showWave,
  clock,
}: ChamberSurfaceProps) => {
  const dy = levelY - cy;
  const clampedDy = Math.max(-sandR * 0.995, Math.min(sandR * 0.995, dy));
  const dx = Math.sqrt(sandR * sandR - clampedDy * clampedDy);

  if (dx < 2) return null;

  const leftX = cx - dx;
  const rightX = cx + dx;
  const surfaceWidth = rightX - leftX;

  return (
    <Group>
      <SurfaceHighlight
        leftX={leftX}
        levelY={levelY}
        width={surfaceWidth}
        highlightColor={highlightColor}
      />
      {showWave && (
        <SurfaceWave
          leftX={leftX}
          levelY={levelY}
          width={surfaceWidth}
          clock={clock}
          highlightColor={highlightColor}
        />
      )}
    </Group>
  );
};

// ─── Surface highlight band ──────────────────────────────────────────────────

type SurfaceHighlightProps = {
  leftX: number;
  levelY: number;
  width: number;
  highlightColor: string;
};

const SurfaceHighlight = ({ leftX, levelY, width, highlightColor }: SurfaceHighlightProps) => (
  <Line
    p1={vec(leftX, levelY)}
    p2={vec(leftX + width, levelY)}
    color={highlightColor}
    strokeWidth={HIGHLIGHT_HEIGHT}
    opacity={0.35}
  />
);

// ─── Animated sine wave ──────────────────────────────────────────────────────

type SurfaceWaveProps = {
  leftX: number;
  levelY: number;
  width: number;
  clock: SharedValue<number>;
  highlightColor: string;
};

const SurfaceWave = ({ leftX, levelY, width, clock, highlightColor }: SurfaceWaveProps) => {
  const animatedPath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    const timePhase = (clock.value % WAVE_PERIOD_MS) / WAVE_PERIOD_MS;

    path.moveTo(leftX, levelY);
    for (let i = 1; i <= WAVE_SEGMENTS; i++) {
      const t = i / WAVE_SEGMENTS;
      const x = leftX + t * width;
      const y = levelY + Math.sin((t * 2 * Math.PI) + (timePhase * 2 * Math.PI)) * WAVE_AMPLITUDE;
      path.lineTo(x, y);
    }
    return path;
  });

  return (
    <Path
      path={animatedPath}
      color={highlightColor}
      style="stroke"
      strokeWidth={1}
      opacity={0.5}
    />
  );
};
