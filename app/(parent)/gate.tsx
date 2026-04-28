import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { t } from '@/lib/i18n';
import { theme } from '@/lib/theme';

const HOLD_MS = 3000;

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Returns a 9-element shuffled array of digits 1–9 (7 is always included). */
const buildGrid = (): number[] => {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return shuffle(digits);
};

export default function ParentGate() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [grid, setGrid] = useState<number[]>(buildGrid());
  const [wrong, setWrong] = useState(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fillAnim = useRef(new Animated.Value(0)).current;
  const fillWidth = fillAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  // Reset gate state when app backgrounds.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') router.back();
    });
    return () => sub.remove();
  }, [router]);

  const passGate = () => router.replace('/(parent)/settings');

  const startHold = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    holdTimerRef.current = setTimeout(() => passGate(), HOLD_MS);
    Animated.timing(fillAnim, {
      toValue: 1,
      duration: HOLD_MS,
      useNativeDriver: false,
    }).start();
  };
  const cancelHold = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    fillAnim.stopAnimation();
    fillAnim.setValue(0);
  };

  const handleTap = (n: number) => {
    if (n === 7) passGate();
    else {
      setWrong(true);
      setGrid(buildGrid());
      setTimeout(() => setWrong(false), 600);
    }
  };

  // Split grid into 3 rows of 3
  const rows = useMemo(() => {
    return [grid.slice(0, 3), grid.slice(3, 6), grid.slice(6, 9)];
  }, [grid]);

  const renderKey = (n: number, idx: number) => (
    <Pressable
      key={`${idx}-${n}`}
      onPress={() => handleTap(n)}
      style={({ pressed }) => [styles.key, pressed && styles.keyPressed]}
      accessibilityRole="button"
      accessibilityLabel={`${n}`}
    >
      <Text style={styles.keyText}>{n}</Text>
    </Pressable>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>

      {/* Header — back chevron */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={16}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.fontPrimary} />
        </Pressable>
      </View>

      {/* Content — vertically centered */}
      <View style={styles.content}>

        {/* Lock badge */}
        <View style={styles.lockBadge}>
          <Ionicons name="lock-closed-outline" size={32} color={theme.colors.mintDark} />
        </View>

        {/* Title */}
        <Text style={styles.title}>{t('gate.title')}</Text>

        {/* Hold button — outer container clips the fill to border radius */}
        <View style={styles.holdBtn}>
          {/* Animated fill layer */}
          <Animated.View style={[styles.holdFill, { width: fillWidth }]} />
          {/* Pressable sits on top, receives all touches */}
          <Pressable
            onPressIn={startHold}
            onPressOut={cancelHold}
            style={styles.holdPressable}
            accessibilityLabel={t('gate.longPress')}
          >
            <Ionicons name="hand-left-outline" size={22} color={theme.colors.fontPrimary} />
            <Text style={styles.holdLabel}>{t('gate.longPress')}</Text>
          </Pressable>
        </View>

        {/* Tap prompt */}
        <Text style={styles.tapPrompt}>{t('gate.tapSeven')}</Text>

        {/* Numpad — 4 rows */}
        <View style={styles.numpad}>
          {rows.map((row, ri) => (
            <View key={ri} style={styles.numpadRow}>
              {row.map((n, ci) => renderKey(n, ri * 3 + ci))}
            </View>
          ))}
          {/* Row 4: spacer – 0 – spacer */}
          <View style={styles.numpadRow}>
            <View style={styles.keySpacer} />
            <Pressable
              onPress={() => handleTap(0)}
              style={({ pressed }) => [styles.key, pressed && styles.keyPressed]}
              accessibilityRole="button"
              accessibilityLabel="0"
            >
              <Text style={styles.keyText}>0</Text>
            </Pressable>
            <View style={styles.keySpacer} />
          </View>
        </View>

        {/* Wrong answer feedback */}
        {wrong && <Text style={styles.wrong}>{t('gate.wrong')}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bgPrimary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    height: 48,
  },

  // Content — vertically centered
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
  },

  // Lock badge
  lockBadge: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Title
  title: {
    fontSize: 30,
    fontWeight: theme.font.weight.bold,
    fontFamily: theme.font.familyMap.bold,
    color: theme.colors.fontPrimary,
    textAlign: 'center',
  },

  // Hold button — outer container
  holdBtn: {
    width: '100%',
    height: 72,
    borderRadius: 20,
    backgroundColor: theme.colors.mint,
    overflow: 'hidden',
    ...theme.shadow.card,
  },
  // Animated fill layer (mintDark sweeps left → right)
  holdFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.colors.mintDark,
  },
  // Pressable on top of fill — captures all touches
  holdPressable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  holdLabel: {
    fontSize: 15,
    fontWeight: theme.font.weight.semibold,
    fontFamily: theme.font.familyMap.semibold,
    color: theme.colors.fontPrimary,
  },

  // Tap prompt
  tapPrompt: {
    fontSize: 15,
    fontWeight: theme.font.weight.regular,
    fontFamily: theme.font.familyMap.regular,
    color: theme.colors.fontSecondary,
  },

  // Numpad
  numpad: {
    gap: 12,
  },
  numpadRow: {
    flexDirection: 'row',
    gap: 12,
  },
  key: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyPressed: {
    backgroundColor: theme.colors.mint,
  },
  keySpacer: {
    width: 80,
    height: 80,
  },
  keyText: {
    fontSize: 28,
    fontWeight: theme.font.weight.bold,
    fontFamily: theme.font.familyMap.bold,
    color: theme.colors.fontPrimary,
  },

  // Wrong
  wrong: {
    fontSize: theme.font.size.sm,
    fontFamily: theme.font.familyMap.semibold,
    fontWeight: theme.font.weight.semibold,
    color: theme.colors.sandDark,
  },
});
