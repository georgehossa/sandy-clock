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
import { useEffect, useMemo, useRef, useState } from 'react';
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

const RESET_FILL_DURATION_MS = 700;

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
  const startedAt = useSandClockStore((s) => s.startedAt);

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

  // ── Reset fill animation ────────────────────────────────────────────────────
  // When a mid-run reset fires, topFraction would snap from (e.g.) 0.6 → 1.
  // Instead, we animate from the pre-reset value to 1 over RESET_FILL_DURATION_MS.
  // resetFillValue is null during normal operation (zero overhead).
  const [resetFillValue, setResetFillValue] = useState<number | null>(null);
  const prevStartedAtRef = useRef(startedAt);
  const prevTopFractionRef = useRef(topFraction);
  const resetRAFRef = useRef<number | null>(null);

  // Detect mid-run resets and run the fill animation.
  // topFraction in deps so prevTopFractionRef stays current every frame.
  // Cleanup is NOT returned here — that would cancel the RAF on every re-run.
  useEffect(() => {
    const isReset = startedAt !== prevStartedAtRef.current && runState === 'running';
    prevStartedAtRef.current = startedAt;

    if (isReset && !reduceMotion) {
      const fromFraction = prevTopFractionRef.current;

      if (resetRAFRef.current !== null) cancelAnimationFrame(resetRAFRef.current);

      const startTime = Date.now();
      const tick = () => {
        const t = Math.min((Date.now() - startTime) / RESET_FILL_DURATION_MS, 1);
        // Ease-out cubic: fast start, slows near the top (like liquid filling)
        const eased = 1 - Math.pow(1 - t, 3);
        setResetFillValue(fromFraction + (1 - fromFraction) * eased);
        if (t < 1) {
          resetRAFRef.current = requestAnimationFrame(tick);
        } else {
          resetRAFRef.current = null;
          setResetFillValue(null);
        }
      };
      resetRAFRef.current = requestAnimationFrame(tick);
    }

    prevTopFractionRef.current = topFraction;
  }, [startedAt, runState, topFraction, reduceMotion]);

  // Cancel any running animation on unmount
  useEffect(() => () => {
    if (resetRAFRef.current !== null) cancelAnimationFrame(resetRAFRef.current);
  }, []);

  // Effective top fraction: animated during reset, timer-driven otherwise
  const effectiveTopFraction = resetFillValue !== null ? resetFillValue : topFraction;

  // ── Layout ─────────────────────────────────────────────────────────────────
  const rimStrokeWidth = geom.circleR / 52;

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

        {/* ── 1. Rim rings BEHIND the pill body ── */}
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

        {/* ── 2. Pill body with gradient fill ── */}
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

        {/* ── 3. Top cutout circle background ── */}
        <Circle cx={geom.cx} cy={geom.topCY} r={geom.circleR} color={theme.colors.cutoutBg} />

        {/* ── 4. Top liquid fill ── */}
        <SandBody
          cx={geom.cx} cy={geom.topCY}
          sandR={geom.sandR}
          progress={effectiveTopFraction}
          color={sandColor}
        />

        {/* ── 5. Bottom cutout circle background ── */}
        <Circle cx={geom.cx} cy={geom.botCY} r={geom.circleR} color={theme.colors.cutoutBg} />

        {/* ── 6. Bottom liquid fill ── */}
        <SandBody
          cx={geom.cx} cy={geom.botCY}
          sandR={geom.sandR}
          progress={1 - effectiveTopFraction}
          color={sandColor}
        />

        {/* ── 7. Pour stream — hidden during reset fill animation ── */}
        <FallStream
          geom={geom}
          color={sandColor}
          progress={timerProgress}
          bottomFraction={1 - effectiveTopFraction}
          running={runState === 'running' && resetFillValue === null}
          clock={clock}
          reduceMotion={reduceMotion}
        />

        {/* ── 8. Liquid surface effects (wave + highlight, tier-gated) ── */}
        <LiquidSurface
          geom={geom}
          color={sandColor}
          topFraction={effectiveTopFraction}
          clock={clock}
          tier={tier}
          reduceMotion={reduceMotion}
        />

      </Canvas>
    </View>
  );
};
