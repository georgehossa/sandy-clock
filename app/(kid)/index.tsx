import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Hourglass } from '@/components/Hourglass/Hourglass';
import { configureAudioSession } from '@/lib/audio';
import { SHOW_CONTROLS } from '@/lib/flags';
import { t } from '@/lib/i18n';
import { theme } from '@/lib/theme';
import { useFinishTone } from '@/hooks/useFinishTone';
import { useFlipDetector } from '@/hooks/useFlipDetector';
import { useSandClockStore } from '@/state/store';

export default function KidHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const armedPresetId = useSandClockStore((s) => s.armedPresetId);
  const runState = useSandClockStore((s) => s.runState);
  const start = useSandClockStore((s) => s.start);
  const reset = useSandClockStore((s) => s.reset);
  const stop = useSandClockStore((s) => s.stop);

  const flipDebug = useFlipDetector(true);
  useFinishTone();

  useEffect(() => {
    configureAudioSession().catch(() => {});
  }, []);

  const prompt =
    runState === 'finished'
      ? t('home.finished')
      : runState === 'running'
      ? t('home.running')
      : armedPresetId
      ? t('home.promptFlip')
      : t('home.promptArm');

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top,
          paddingBottom: SHOW_CONTROLS ? 0 : insets.bottom,
        },
      ]}
    >
      <StatusBar style="dark" />

      {/* Nav bar */}
      <View style={styles.navBar}>
        {flipDebug && (
          <Text style={styles.debug}>
            tilt {flipDebug.tilt.toFixed(0)}° · {flipDebug.state}
          </Text>
        )}
        <Pressable
          onPress={() => router.push('/(parent)/gate')}
          accessibilityRole="button"
          accessibilityLabel={t('a11y.openSettings')}
          hitSlop={16}
          style={styles.navBtn}
        >
          <Ionicons name="settings-outline" size={24} color={theme.colors.fontPrimary} />
        </Pressable>
      </View>

      {/* Hourglass + prompt centered */}
      <View style={styles.center}>
        <Hourglass size={240} />
        <Text style={styles.prompt}>{prompt}</Text>
      </View>

      {/* Controls bar: Reset | Play | Stop — gated by SHOW_CONTROLS */}
      {SHOW_CONTROLS && (
        <View style={[styles.controls, { paddingBottom: Math.max(insets.bottom, theme.spacing.md) }]}>
          <Pressable
            onPress={reset}
            accessibilityRole="button"
            accessibilityLabel="Reset"
            style={styles.btnSecondary}
          >
            <Ionicons name="refresh-outline" size={22} color={theme.colors.fontPrimary} />
          </Pressable>

          <Pressable
            onPress={start}
            accessibilityRole="button"
            accessibilityLabel="Play"
            style={styles.btnPrimary}
          >
            <Ionicons name="play" size={26} color={theme.colors.fontPrimary} />
          </Pressable>

          <Pressable
            onPress={stop}
            accessibilityRole="button"
            accessibilityLabel="Stop"
            style={styles.btnSecondary}
          >
            <Ionicons name="stop" size={22} color={theme.colors.fontPrimary} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bgPrimary,
    paddingHorizontal: theme.spacing.sm,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
  },
  navBtn: {
    padding: theme.spacing.xs,
  },
  debug: {
    flex: 1,
    fontSize: theme.font.size.xs,
    color: theme.colors.fontTertiary,
    fontFamily: theme.font.familyMap.regular,
    // @ts-ignore - tabular-nums not in RN types but works on iOS
    fontVariant: ['tabular-nums'],
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  prompt: {
    fontSize: theme.font.size.md,
    fontWeight: theme.font.weight.semibold,
    fontFamily: theme.font.familyMap.semibold,
    color: theme.colors.fontSecondary,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  btnSecondary: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.card,
  },
});
