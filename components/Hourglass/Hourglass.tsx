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
import { detectDeviceTier } from '@/lib/deviceTier';
import { theme } from '@/lib/theme';
import { useReduceMotion } from '@/lib/useReduceMotion';
import { useTimer } from '@/hooks/useTimer';
import { DEFAULT_PRESET_COLORS } from '@/state/presets';
import { useSandClockStore } from '@/state/store';
import { FallStream } from './FallStream';
import { LiquidSurface } from './LiquidSurface';
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

  const rawProgress = useTimer();
  const armedPresetId = useSandClockStore((s) => s.armedPresetId);
  const runState = useSandClockStore((s) => s.runState);

  // Liquid always drains top → bottom.
  // finished keeps timerProgress=1 so the bottom stays full until the next run.
  // idle/armed resets to 0 so the top is full at rest.
  const timerProgress =
    runState === 'running' ? rawProgress :
    runState === 'finished' ? 1 :
    0;
  const topFraction = 1 - timerProgress;
  const sandColor = armedPresetId ? DEFAULT_PRESET_COLORS[armedPresetId] : theme.colors.sandOrange;
  const clock = useClock();

  // Rim ring stroke width proportional to circleR (≈1.7px at 240px wide)
  const rimStrokeWidth = geom.circleR / 52;

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

        {/* ── 0. Pill outer drop shadow ── */}
        <Box box={pillRRect} color="transparent">
          <BoxShadow dx={0} dy={8} blur={24} color="#2D3B3630" />
          <BoxShadow dx={0} dy={2} blur={6} color="#2D3B3618" />
        </Box>

        {/* ── 1. Rim rings BEHIND the pill body ──────────────────────────────
             Drawn before the pill gradient so the pill paints over their outer
             edge. Only the inner portion of the stroke is visible, sitting
             between the liquid fill and the cutout circle edge — giving the
             "glass vessel wall" look without protruding outside the frame.    */}
        <Circle
          cx={geom.cx} cy={geom.topCY} r={geom.circleR}
          color={theme.colors.cutoutBg}
          strokeWidth={rimStrokeWidth}
          style="stroke"
        />
        <Circle
          cx={geom.cx} cy={geom.botCY} r={geom.circleR}
          color={theme.colors.cutoutBg}
          strokeWidth={rimStrokeWidth}
          style="stroke"
        />

        {/* ── 2. Pill body with gradient fill (covers rim ring outer edge) ── */}
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

        {/* ── 3. Top cutout circle background (dark sage) ── */}
        <Circle cx={geom.cx} cy={geom.topCY} r={geom.circleR} color={theme.colors.cutoutBg} />

        {/* ── 4. Top liquid fill ── */}
        {/* topFraction=1 → top full, topFraction=0 → top empty */}
        <SandBody
          cx={geom.cx} cy={geom.topCY}
          sandR={geom.sandR}
          progress={topFraction}
          color={sandColor}
        />

        {/* ── 5. Bottom cutout circle background (dark sage) ── */}
        <Circle cx={geom.cx} cy={geom.botCY} r={geom.circleR} color={theme.colors.cutoutBg} />

        {/* ── 6. Bottom liquid fill ── */}
        {/* bottom is full when top is empty: pass 1-topFraction */}
        <SandBody
          cx={geom.cx} cy={geom.botCY}
          sandR={geom.sandR}
          progress={1 - topFraction}
          color={sandColor}
        />

        {/* ── 7. Pour stream (neck zone, running only) ── */}
        <FallStream
          geom={geom}
          color={sandColor}
          progress={timerProgress}
          bottomFraction={1 - topFraction}
          running={runState === 'running'}
          clock={clock}
          reduceMotion={reduceMotion}
        />

        {/* ── 8. Liquid surface effects (wave + highlight, tier-gated) ── */}
        <LiquidSurface
          geom={geom}
          color={sandColor}
          topFraction={topFraction}
          clock={clock}
          tier={tier}
          reduceMotion={reduceMotion}
        />


      </Canvas>
    </View>
  );
};
