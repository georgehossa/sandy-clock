import { Pressable, StyleSheet, Text, View } from 'react-native';
import { t } from '@/lib/i18n';
import type { PresetId } from '@/state/presets';

type Props = {
  id: PresetId;
  color: string;
  armed: boolean;
  onPress: () => void;
};

export const PresetButton = ({ id, color, armed, onPress }: Props) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={t('a11y.selectPreset', { minutes: id })}
    style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}
  >
    <View
      style={[
        styles.circle,
        { backgroundColor: color },
        armed && styles.armed,
        armed && { shadowColor: color },
      ]}
    >
      <Text style={styles.label}>{id}</Text>
      <Text style={styles.unit}>min</Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.85 },
  circle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: 'center',
    justifyContent: 'center',
  },
  armed: {
    shadowOpacity: 0.6,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
    transform: [{ scale: 1.08 }],
  },
  label: { fontSize: 28, fontWeight: '800', color: '#1F2937' },
  unit: { fontSize: 11, fontWeight: '700', color: '#1F2937', opacity: 0.7 },
});
