import { useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { t } from '@/lib/i18n';

const HOLD_MS = 3000;

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildGrid = () => {
  const others = [0, 1, 2, 3, 4, 5, 6, 8, 9];
  const eight = shuffle(others).slice(0, 8);
  return shuffle([...eight, 7]);
};

export default function ParentGate() {
  const router = useRouter();
  const [grid, setGrid] = useState<number[]>(buildGrid());
  const [wrong, setWrong] = useState(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
  };
  const cancelHold = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const handleTap = (n: number) => {
    if (n === 7) passGate();
    else {
      setWrong(true);
      setGrid(buildGrid());
      setTimeout(() => setWrong(false), 600);
    }
  };

  const cells = useMemo(
    () =>
      grid.map((n, i) => (
        <Pressable
          key={`${i}-${n}`}
          onPress={() => handleTap(n)}
          style={styles.cell}
          accessibilityRole="button"
          accessibilityLabel={`${n}`}
        >
          <Text style={styles.cellText}>{n}</Text>
        </Pressable>
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [grid],
  );

  return (
    <View style={styles.root}>
      <Text style={styles.title}>{t('gate.title')}</Text>

      <Pressable
        onPressIn={startHold}
        onPressOut={cancelHold}
        style={({ pressed }) => [styles.holdTarget, pressed && styles.holdActive]}
        accessibilityLabel={t('gate.longPress')}
      >
        <Text style={styles.holdLabel}>{t('gate.longPress')}</Text>
      </Pressable>

      <Text style={styles.or}>· · ·</Text>

      <Text style={styles.tapPrompt}>{t('gate.tapSeven')}</Text>
      <View style={styles.grid}>{cells}</View>
      {wrong && <Text style={styles.wrong}>{t('gate.wrong')}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFBEB', alignItems: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: '800', color: '#1F2937', marginVertical: 12 },
  holdTarget: {
    width: '100%',
    paddingVertical: 28,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
  },
  holdActive: { backgroundColor: '#FDE047' },
  holdLabel: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  or: { fontSize: 18, color: '#9CA3AF', marginVertical: 14 },
  tapPrompt: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  grid: { width: 240, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  cell: {
    width: 70,
    height: 70,
    margin: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cellText: { fontSize: 26, fontWeight: '800', color: '#1F2937' },
  wrong: { marginTop: 12, color: '#DC2626', fontWeight: '700' },
});
