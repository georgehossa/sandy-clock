import { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { Accelerometer, DeviceMotion, type DeviceMotionMeasurement } from 'expo-sensors';
import { Platform, AppState } from 'react-native';
import { useSandClockStore } from '@/state/store';
import { computeFlipTransition, type FlipState, type MotionSample } from './flipFsm';

const KEEP_AWAKE_TAG = 'sand-clock-run';
const SAMPLE_INTERVAL_MS = 1000 / 30; // 30 Hz

/**
 * Compute normalized Y and Z gravity components from raw accelerometer values.
 *
 * normY = y / |g|  (−1 = portrait upright, +1 = portrait upside-down)
 * normZ = z / |g|  (|normZ| ≥ 0.5 means the phone is lying flat)
 *
 * Platform sign correction: expo-sensors inverts the gravity vector on Android
 * relative to iOS. We negate Y (and Z) on Android so the same physical gesture
 * produces the same normY sign on both platforms.
 */
const computeNormYZ = (
  x: number,
  y: number,
  z: number,
): { normY: number; normZ: number } => {
  const mag = Math.sqrt(x * x + y * y + z * z);
  if (mag < 1e-3) return { normY: 0, normZ: 0 };
  const sign = Platform.OS === 'android' ? -1 : 1;
  return {
    normY: sign * (y / mag),
    normZ: sign * (z / mag),
  };
};

export const useFlipDetector = (enabled: boolean) => {
  const fsmRef = useRef<{ state: FlipState; since: number }>({
    state: 'upright',
    since: 0,
  });
  const [debug, setDebug] = useState<{ normY: number; state: FlipState } | null>(null);
  const debugTickRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    let mounted = true;
    let sub: { remove: () => void } | null = null;

    const handleSample = (normY: number, normZ: number) => {
      if (!mounted) return;
      const sample: MotionSample = { normY, normZ, t: Date.now() };
      const next = computeFlipTransition(fsmRef.current.state, fsmRef.current.since, sample);
      fsmRef.current = { state: next.state, since: next.candidateSince };

      debugTickRef.current = (debugTickRef.current + 1) % 6;
      if (debugTickRef.current === 0) setDebug({ normY, state: next.state });

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

    (async () => {
      // Try DeviceMotion first; fall back to Accelerometer (more widely
      // available, including reliably in Expo Go).
      try {
        const perm = await DeviceMotion.requestPermissionsAsync();
        if (perm.granted) {
          DeviceMotion.setUpdateInterval(SAMPLE_INTERVAL_MS);
          sub = DeviceMotion.addListener((m: DeviceMotionMeasurement) => {
            const a = m.accelerationIncludingGravity;
            if (!a) return;
            const { x = 0, y = 0, z = 0 } = a;
            const { normY, normZ } = computeNormYZ(x, y, z);
            handleSample(normY, normZ);
          });
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
        sub = Accelerometer.addListener(({ x, y, z }) => {
          const { normY, normZ } = computeNormYZ(x, y, z);
          handleSample(normY, normZ);
        });
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
