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

      {/* Controls bar: single hold-to-confirm button */}
      <View
        style={[styles.controls, { paddingBottom: Math.max(insets.bottom, theme.spacing.md) }]}
        onLayout={onControlsLayout}
      >
        {runState === 'running' ? (
          <HoldButton
            onAction={reset}
            size={80}
            bgColor={theme.colors.bgSecondary}
            fillColor={theme.colors.sandOrange}
            accessibilityLabel="Reset timer"
          >
            <Ionicons name="refresh-outline" size={28} color={theme.colors.fontPrimary} />
          </HoldButton>
        ) : (
          <Pressable
            onPress={start}
            accessibilityRole="button"
            accessibilityLabel="Start timer"
            style={styles.btnPlay}
          >
            <Ionicons name="play" size={30} color={theme.colors.fontPrimary} />
          </Pressable>
        )}
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
  btnPlay: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.card,
  },
});
