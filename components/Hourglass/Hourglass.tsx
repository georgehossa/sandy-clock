import {
  Box,
  BoxShadow,
  Canvas,
  Circle,
  LinearGradient,
  RoundedRect,
  Skia,
  useClock,
  vec,
} from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { View } from 'react-native';
import { detectDeviceTier, glitterCountForTier } from '@/lib/deviceTier';
import { theme } from '@/lib/theme';
import { useReduceMotion } from '@/lib/useReduceMotion';
import { useTimer } from '@/hooks/useTimer';
import { DEFAULT_PRESET_COLORS } from '@/state/presets';
import { useSandClockStore } from '@/state/store';
import { FallStream } from './FallStream';
import { GlitterField } from './GlitterField';
import { SandBody } from './SandBody';
import { buildGeometry } from './geometry';

type Props = {
  size: number;
};

export const Hourglass = ({ size }: Props) => {
  // Maintain design proportions: source is 286×533
  const width = size;
  const height = Math.round((533 / 286) * size);
  const geom = useMemo(() => buildGeometry(width, height), [width, height]);

  const reduceMotion = useReduceMotion();
  const tier = detectDeviceTier();
  const baseCount = glitterCountForTier(tier);
  const glitterCount = reduceMotion ? 0 : baseCount;

  const rawProgress = useTimer();
  const armedPresetId = useSandClockStore((s) => s.armedPresetId);
  const runState = useSandClockStore((s) => s.runState);
  const sandTop = useSandClockStore((s) => s.sandTop);

  // sandTop alternates each rotation, tracking which chamber holds the sand.
  // SandBody mapping: progress=0 → top full / bottom empty.
  //                   progress=1 → top empty / bottom full.
  //
  // sandTop=false (sand at bottom, initial):
  //   Resting: progress=1 (bottom full). Running: 1→0 (bottom drains → top fills).
  //
  // sandTop=true (sand at top, after first run):
  //   Resting: progress=0 (top full). Running: 0→1 (top drains → bottom fills).
  const timerProgress = runState === 'running' ? rawProgress : 0;
  const progress = sandTop ? timerProgress : 1 - timerProgress;
  const sandColor = armedPresetId ? DEFAULT_PRESET_COLORS[armedPresetId] : theme.colors.sandOrange;
  const clock = useClock();

  // Build the RRect for Box (needed for BoxShadow)
  const pillRRect = useMemo(
    () => Skia.RRectXY(
      { x: 0, y: 0, width, height },
      geom.pillRadius,
      geom.pillRadius,
    ),
    [width, height, geom.pillRadius],
  );

  return (
    <View style={{ width, height }}>
      <Canvas style={{ width, height }}>

        {/* ── Pill outer drop shadow ── */}
        <Box box={pillRRect} color="transparent">
          <BoxShadow dx={0} dy={8} blur={24} color="#2D3B3630" />
          <BoxShadow dx={0} dy={2} blur={6} color="#2D3B3618" />
        </Box>

        {/* ── Pill body with gradient fill ── */}
        <RoundedRect
          x={0} y={0}
          width={width} height={height}
          r={geom.pillRadius}
        >
          <LinearGradient
            start={vec(geom.cx, 0)}
            end={vec(geom.cx, height)}
            colors={[theme.colors.pillGradientTop, theme.colors.pillGradientBottom]}
          />
        </RoundedRect>

        {/* ── Top cutout circle (dark sage) ── */}
        <Circle cx={geom.cx} cy={geom.topCY} r={geom.circleR} color={theme.colors.cutoutBg} />

        {/* Top sand arc */}
        <SandBody
          cx={geom.cx} cy={geom.topCY} r={geom.sandR}
          progress={progress}
          color={sandColor}
          chamber="top"
        />

        {/* ── Bottom cutout circle (dark sage) ── */}
        <Circle cx={geom.cx} cy={geom.botCY} r={geom.circleR} color={theme.colors.cutoutBg} />

        {/* Bottom sand arc */}
        <SandBody
          cx={geom.cx} cy={geom.botCY} r={geom.sandR}
          progress={progress}
          color={sandColor}
          chamber="bottom"
        />

        {/* Glitter shimmer */}
        <GlitterField
          geom={geom}
          color={sandColor}
          count={glitterCount}
          progress={progress}
          clockMs={clock.value}
        />

        {/* Falling sand stream */}
        <FallStream
          geom={geom}
          color={sandColor}
          running={runState === 'running'}
          clockMs={clock.value}
          reduceMotion={reduceMotion}
        />
      </Canvas>
    </View>
  );
};
