import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { type LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { ConfettiOverlay } from '@/components/ConfettiOverlay';
import { Hourglass } from '@/components/Hourglass/Hourglass';
import { HoldButton } from '@/components/HoldButton';
import { configureAudioSession } from '@/lib/audio';
import { t } from '@/lib/i18n';
import { theme } from '@/lib/theme';
import { useFinishTone } from '@/hooks/useFinishTone';
import { useSandClockStore } from '@/state/store';

const KEEP_AWAKE_TAG = 'kid-home';

export default function KidHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const armedPresetId = useSandClockStore((s) => s.armedPresetId);
  const runState = useSandClockStore((s) => s.runState);
  const start = useSandClockStore((s) => s.start);
  const stop = useSandClockStore((s) => s.stop);
  const reset = useSandClockStore((s) => s.reset);

  useFinishTone();

  // Measure play button position for confetti origin
  const [btnOrigin, setBtnOrigin] = useState<{ x: number; y: number } | null>(null);
  const onControlsLayout = useCallback((e: LayoutChangeEvent) => {
    e.target.measureInWindow((x, y, width, height) => {
      setBtnOrigin({ x: x + width / 2, y: y + height / 2 });
    });
  }, []);

  useEffect(() => {
    configureAudioSession().catch(() => {});
  }, []);

  useEffect(() => {
    if (runState === 'running') {
      activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch(() => {});
    } else {
      deactivateKeepAwake(KEEP_AWAKE_TAG);
    }
  }, [runState]);

  const prompt =
    runState === 'finished'
      ? t('home.finished')
      : runState === 'running'
      ? t('home.running')
      : armedPresetId
      ? t('home.promptPlay')
      : t('home.promptArm');

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <StatusBar style="dark" />

      {/* Nav bar */}
      <View style={styles.navBar}>
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

      {/* Confetti overlay — full-screen, pointer-events none */}
      {btnOrigin && (
        <ConfettiOverlay originX={btnOrigin.x} originY={btnOrigin.y} />
      )}

      {/* Controls bar: Reset, Play, Stop */}
      <View
        style={[styles.controls, { paddingBottom: Math.max(insets.bottom, theme.spacing.md) }]}
        onLayout={onControlsLayout}
      >
        <View style={styles.controlsRow}>
          {/* Reset button */}
          <Pressable
            onPress={reset}
            disabled={runState === 'idle'}
            accessibilityRole="button"
            accessibilityLabel={t('a11y.resetTimer')}
            style={[styles.btnSecondary, runState === 'idle' && styles.btnDisabled]}
          >
            <Ionicons name="refresh-outline" size={24} color={theme.colors.fontPrimary} />
          </Pressable>

          {/* Play button */}
          <Pressable
            onPress={start}
            disabled={!armedPresetId || runState === 'running' || runState === 'finished'}
            accessibilityRole="button"
            accessibilityLabel={t('a11y.startTimer')}
            style={[
              styles.btnPlay,
              (!armedPresetId || runState === 'running' || runState === 'finished') && styles.btnDisabled,
            ]}
          >
            <Ionicons name="play" size={30} color={theme.colors.fontPrimary} />
          </Pressable>

          {/* Stop button */}
          <Pressable
            onPress={stop}
            disabled={runState !== 'running'}
            accessibilityRole="button"
            accessibilityLabel={t('a11y.stopTimer')}
            style={[styles.btnSecondary, runState !== 'running' && styles.btnDisabled]}
          >
            <Ionicons name="stop" size={24} color={theme.colors.fontPrimary} />
          </Pressable>
        </View>
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing.md,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  btnPlay: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.card,
  },
  btnSecondary: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.card,
  },
  btnDisabled: {
    opacity: 0.4,
  },
});
