import * as Device from 'expo-device';

export type DeviceTier = 'high' | 'mid' | 'low';

const GB = 1024 * 1024 * 1024;

let cached: DeviceTier | null = null;

export const detectDeviceTier = (): DeviceTier => {
  if (cached) return cached;
  const mem = Device.totalMemory ?? 0;
  if (mem >= 4 * GB) cached = 'high';
  else if (mem >= 2 * GB) cached = 'mid';
  else cached = 'low';
  return cached;
};

export const glitterCountForTier = (tier: DeviceTier): number =>
  tier === 'high' ? 50 : tier === 'mid' ? 30 : 0;
