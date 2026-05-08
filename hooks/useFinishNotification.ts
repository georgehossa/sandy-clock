import Constants from 'expo-constants';
import { useEffect, useRef } from 'react';
import { getDurationMs, useSandClockStore } from '@/state/store';
import { t } from '@/lib/i18n';

/**
 * expo-notifications local scheduling is not supported in Expo Go (SDK 53+).
 * When running inside Expo Go the hook is a no-op so the app stays usable
 * during development. Use a development build to test notifications.
 */
const IS_EXPO_GO = Constants.appOwnership === 'expo';

/**
 * Schedules a local notification when the timer starts and the app goes to
 * the background, so the user is alerted when time is up even if the device
 * is locked or another app is open.
 *
 * - Schedules on runState → 'running' (if notificationsEnabled)
 * - Cancels on runState → 'armed' | 'idle' (stop / reset)
 * - Foreground suppression is handled globally in app/_layout.tsx via
 *   setNotificationHandler, so the in-app confetti + tone experience is
 *   the primary signal when the app is visible.
 */
export const useFinishNotification = (): void => {
  const runState = useSandClockStore((s) => s.runState);
  const armedPresetId = useSandClockStore((s) => s.armedPresetId);
  const notificationsEnabled = useSandClockStore((s) => s.notificationsEnabled);

  // Track the current scheduled notification identifier so we can cancel it
  // precisely if needed (cancel-all is also safe but this is more explicit).
  const notifIdRef = useRef<string | null>(null);

  useEffect(() => {
    // No-op in Expo Go — local notifications require a development build.
    if (IS_EXPO_GO) return;

    if (runState === 'running' && notificationsEnabled && armedPresetId) {
      scheduleFinishNotification(armedPresetId).then((id) => {
        notifIdRef.current = id;
      });
    } else if (runState === 'armed' || runState === 'idle') {
      // Stop or reset — cancel any pending notification.
      cancelFinishNotification(notifIdRef.current);
      notifIdRef.current = null;
    }
    // 'finished' state: notification either already fired (background) or was
    // suppressed (foreground). Either way, no action needed.
  }, [runState, notificationsEnabled, armedPresetId]);
};

/**
 * Request POST_NOTIFICATIONS permission (Android 13+), schedule the local
 * notification for the given preset, and return its identifier.
 *
 * If permission is denied the function returns null and the app continues
 * normally — no error is surfaced to the user.
 */
async function scheduleFinishNotification(
  presetId: string,
): Promise<string | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Notifications =
      require('expo-notifications') as typeof import('expo-notifications');

    // Request permission lazily on first use.
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      return null;
    }

    const durationMs = getDurationMs(
      presetId as Parameters<typeof getDurationMs>[0],
    );
    if (durationMs <= 0) return null;

    const durationSeconds = Math.round(durationMs / 1000);

    // Notification content — title uses preset label, body is the finish message.
    const title = t('notification.title', { minutes: presetId });
    const body = t('notification.body');

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        data: { channelId: 'finish' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: durationSeconds,
        repeats: false,
        channelId: 'finish',
      },
    });

    return id;
  } catch {
    // Non-blocking — swallow errors so the timer always works.
    return null;
  }
}

/**
 * Cancel a specific scheduled notification by ID, falling back to
 * cancelling all scheduled notifications to ensure nothing stale fires.
 */
async function cancelFinishNotification(id: string | null): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Notifications =
      require('expo-notifications') as typeof import('expo-notifications');

    if (id) {
      await Notifications.cancelScheduledNotificationAsync(id);
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  } catch {
    // Non-blocking.
  }
}
