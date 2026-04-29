import { Canvas, RoundedRect, Group } from '@shopify/react-native-skia';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withTiming,
  cancelAnimation,
  runOnJS,
} from 'react-native-reanimated';
import { detectDeviceTier, type DeviceTier } from '@/lib/deviceTier';
import { useReduceMotion } from '@/lib/useReduceMotion';
import { useSandClockStore } from '@/state/store';

// ── Particle config ────────────────────────────────────────────────────────

type ParticleConfig = {
  /** Launch angle in radians (0 = right, π/2 = up) */
  angle: number;
  /** Initial velocity (px over full duration) */
  velocity: number;
  /** Fill color hex */
  color: string;
  /** Width of the confetti piece */
  w: number;
  /** Height of the confetti piece */
  h: number;
  /** Rotation speed (radians over full duration) */
  spin: number;
  /** Gravity multiplier — higher = falls faster after apex */
  gravity: number;
};

const CONFETTI_COLORS = [
  '#E8945A', // sand orange
  '#7B9ACC', // slate blue
  '#C47EA0', // mauve/pink
  '#C8A84A', // gold
  '#B0D4C8', // mint
  '#F5C542', // bright yellow
  '#6BC5A0', // emerald
  '#E57373', // soft red
];

const ANIMATION_DURATION_MS = 2500;

const particleCountForTier = (tier: DeviceTier): number =>
  tier === 'high' ? 40 : tier === 'mid' ? 20 : 10;

function generateParticles(count: number): ParticleConfig[] {
  const particles: ParticleConfig[] = [];
  for (let i = 0; i < count; i++) {
    // Upward-biased angle: between 30° and 150° (π/6 to 5π/6) mapped so most go up
    const angle = (Math.PI / 6) + Math.random() * (4 * Math.PI / 6);
    particles.push({
      angle,
      velocity: 200 + Math.random() * 350,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      w: 4 + Math.random() * 6,
      h: 6 + Math.random() * 10,
      spin: (Math.random() - 0.5) * Math.PI * 6,
      gravity: 0.8 + Math.random() * 0.6,
    });
  }
  return particles;
}

// ── Particle position math ─────────────────────────────────────────────────

/**
 * Compute a particle's x/y/opacity/rotation given progress [0..1].
 * Uses a simple projectile model: x = v·cos(a)·t, y = v·sin(a)·t - ½g·t²
 * with t mapped from progress and gravity pulling particles back down.
 */
function particleState(
  p: ParticleConfig,
  progress: number,
  originX: number,
  originY: number,
) {
  'worklet';
  const t = progress;
  const dx = p.velocity * Math.cos(p.angle) * t;
  // Negative Y = upward in screen coords.  gravity pulls down after apex.
  const dy = -(p.velocity * Math.sin(p.angle) * t) + p.gravity * 500 * t * t;
  const rotation = p.spin * t;
  // Fade out in the last 30% of animation
  const opacity = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;

  return {
    x: originX + dx - p.w / 2,
    y: originY + dy - p.h / 2,
    rotation,
    opacity: Math.max(0, opacity),
  };
}

// ── Single Particle renderer ───────────────────────────────────────────────

type ParticleProps = {
  config: ParticleConfig;
  progress: { value: number };
  originX: number;
  originY: number;
  enableRotation: boolean;
};

const Particle = ({ config, progress, originX, originY, enableRotation }: ParticleProps) => {
  const transform = useDerivedValue(() => {
    const s = particleState(config, progress.value, originX, originY);
    if (enableRotation) {
      return [
        { translateX: s.x + config.w / 2 },
        { translateY: s.y + config.h / 2 },
        { rotate: s.rotation },
        { translateX: -config.w / 2 },
        { translateY: -config.h / 2 },
      ];
    }
    return [{ translateX: s.x }, { translateY: s.y }];
  });

  const opacity = useDerivedValue(() => {
    const s = particleState(config, progress.value, originX, originY);
    return s.opacity;
  });

  return (
    <Group transform={transform} opacity={opacity}>
      <RoundedRect
        x={0}
        y={0}
        width={config.w}
        height={config.h}
        r={1.5}
        color={config.color}
      />
    </Group>
  );
};

// ── Main overlay ───────────────────────────────────────────────────────────

type ConfettiOverlayProps = {
  /** Center X of the play button in screen coordinates */
  originX: number;
  /** Center Y of the play button in screen coordinates */
  originY: number;
};

export const ConfettiOverlay = ({ originX, originY }: ConfettiOverlayProps) => {
  const reduceMotion = useReduceMotion();
  const runState = useSandClockStore((s) => s.runState);
  const { width: screenW, height: screenH } = useWindowDimensions();

  const tier = useMemo(() => detectDeviceTier(), []);
  const enableRotation = tier === 'high';
  const count = particleCountForTier(tier);

  const progress = useSharedValue(0);
  const [particles, setParticles] = useState<ParticleConfig[] | null>(null);
  const prevRunState = useRef(runState);

  const clearParticles = useCallback(() => {
    setParticles(null);
  }, []);

  useEffect(() => {
    const wasFinished = prevRunState.current === 'finished';
    prevRunState.current = runState;

    if (runState === 'finished' && !reduceMotion) {
      // Trigger confetti
      const newParticles = generateParticles(count);
      setParticles(newParticles);
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: ANIMATION_DURATION_MS,
        easing: Easing.out(Easing.cubic),
      }, (finished) => {
        if (finished) {
          runOnJS(clearParticles)();
        }
      });
    } else if (wasFinished && runState !== 'finished') {
      // Left finished state (reset/stop) — clear immediately
      cancelAnimation(progress);
      progress.value = 0;
      setParticles(null);
    }
  }, [runState, reduceMotion, count, progress, clearParticles]);

  // Don't render anything if reduce motion or no active particles
  if (reduceMotion || !particles) return null;

  return (
    <Canvas style={[styles.overlay, { width: screenW, height: screenH }]} pointerEvents="none">
      {particles.map((p, i) => (
        <Particle
          key={i}
          config={p}
          progress={progress}
          originX={originX}
          originY={originY}
          enableRotation={enableRotation}
        />
      ))}
    </Canvas>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
