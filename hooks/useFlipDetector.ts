import { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { Accelerometer, DeviceMotion, type DeviceMotionMeasurement } from 'expo-sensors';
import { AppState } from 'react-native';
import { useSandClockStore } from '@/state/store';
import { computeFlipTransition, type FlipState, type MotionSample } from './flipFsm';

const KEEP_AWAKE_TAG = 'sand-clock-run';
const SAMPLE_INTERVAL_MS = 1000 / 30; // 30 Hz
const RAD_TO_DEG = 180 / Math.PI;

/**
 * Angle (in degrees) between the device's "up" axis (out of screen) and
 * gravity. 0° = face-up flat. 90° = held vertically. 180° = face-down flat.
 * Robust to any rotation around the screen's normal.
 */
const tiltAngleDeg = (m: DeviceMotionMeasurement): number => {
  const a = m.accelerationIncludingGravity;
  if (!a) return 0;
  const { x = 0, y = 0, z = 0 } = a;
  const mag = Math.sqrt(x * x + y * y + z * z);
  if (mag < 1e-3) return 0;
  // expo-sensors gives gravity in g-units. Face-up: z ≈ -1 (iOS) or +1 (Android).
  // Use |z| / mag so either convention maps to 0° when face-up.
  const cosTheta = Math.min(1, Math.max(-1, Math.abs(z) / mag));
  // angle from "either-face-flat" (0° = either flat). Flip target = 90°+ change
  // from upright. Map to a directional pitch using sign of z so the FSM's
  // |pitch|≥150 threshold still works:
  //   z negative (face-up)  → pitch  ~  Math.acos(|z|/mag)             ∈ [0, 90]
  //   z positive (face-down)→ pitch  ~  180 - Math.acos(|z|/mag)       ∈ [90, 180]
  const base = Math.acos(cosTheta) * RAD_TO_DEG;
  return z >= 0 ? 180 - base : base;
};

export const useFlipDetector = (enabled: boolean) => {
  const fsmRef = useRef<{ state: FlipState; since: number }>({
    state: 'upright',
    since: 0,
  });
  const [debug, setDebug] = useState<{ tilt: number; state: FlipState } | null>(null);
  const debugTickRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    let mounted = true;
    let sub: { remove: () => void } | null = null;

    const handleSample = (tilt: number) => {
      if (!mounted) return;
      const sample: MotionSample = { pitchDeg: tilt, t: Date.now() };
      const next = computeFlipTransition(fsmRef.current.state, fsmRef.current.since, sample);
      fsmRef.current = { state: next.state, since: next.candidateSince };

      debugTickRef.current = (debugTickRef.current + 1) % 6;
      if (debugTickRef.current === 0) setDebug({ tilt, state: next.state });

      if (next.fired === 'flip') {
        const s = useSandClockStore.getState();
        if (!s.armedPresetId) {
          console.log('[flip] fired but no preset armed');
          return;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        if (s.runState === 'running') s.reset();
        else s.start();
        activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch(() => {});
      }
    };

    const tiltFromAccel = (x: number, y: number, z: number): number => {
      // Accelerometer returns g-units. Same math as tiltAngleDeg.
      const mag = Math.sqrt(x * x + y * y + z * z);
      if (mag < 1e-3) return 0;
      const cos = Math.min(1, Math.max(-1, Math.abs(z) / mag));
      const base = Math.acos(cos) * RAD_TO_DEG;
      return z >= 0 ? 180 - base : base;
    };

    (async () => {
      // Try DeviceMotion first; fall back to Accelerometer (more widely
      // available, including reliably in Expo Go).
      try {
        const perm = await DeviceMotion.requestPermissionsAsync();
        if (perm.granted) {
          DeviceMotion.setUpdateInterval(SAMPLE_INTERVAL_MS);
          sub = DeviceMotion.addListener((m) => handleSample(tiltAngleDeg(m)));
          console.log('[flip] using DeviceMotion');
          return;
        }
        console.warn('[flip] DeviceMotion permission denied, trying Accelerometer');
      } catch (e) {
        console.warn('[flip] DeviceMotion failed, trying Accelerometer', e);
      }

      try {
        const perm = await Accelerometer.requestPermissionsAsync();
        if (!perm.granted) {
          console.warn('[flip] Accelerometer permission denied');
          return;
        }
        Accelerometer.setUpdateInterval(SAMPLE_INTERVAL_MS);
        sub = Accelerometer.addListener(({ x, y, z }) =>
          handleSample(tiltFromAccel(x, y, z)),
        );
        console.log('[flip] using Accelerometer');
      } catch (e) {
        console.warn('[flip] Accelerometer failed', e);
      }
    })();

    return () => {
      mounted = false;
      sub?.remove();
    };
  }, [enabled]);

  // Release keep-awake when run leaves "running".
  useEffect(() => {
    const unsub = useSandClockStore.subscribe((s, prev) => {
      if (prev.runState === 'running' && s.runState !== 'running') {
        deactivateKeepAwake(KEEP_AWAKE_TAG);
      }
    });
    const appSub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') deactivateKeepAwake(KEEP_AWAKE_TAG);
    });
    return () => {
      unsub();
      appSub.remove();
    };
  }, []);

  return debug;
};
