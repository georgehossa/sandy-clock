import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useFinishTone } from '@/hooks/useFinishTone';
import { t } from '@/lib/i18n';
import { theme } from '@/lib/theme';
import {
  PALETTE_COLORS,
  PRESET_IDS,
  TONE_IDS,
  type PresetId,
  type ToneId,
} from '@/state/presets';
import { useSandClockStore, type LanguagePref } from '@/state/store';

const LANG_OPTIONS: { id: LanguagePref; labelKey: string }[] = [
  { id: 'system', labelKey: 'settings.languageSystem' },
  { id: 'en', labelKey: 'settings.languageEnglish' },
  { id: 'es', labelKey: 'settings.languageSpanish' },
];

// Tone icon names from Ionicons
const TONE_ICONS: Record<ToneId, keyof typeof Ionicons.glyphMap> = {
  'bubble-pop': 'water-outline',
  'magic-chime': 'musical-notes-outline',
  'soft-bell': 'notifications-outline',
};

export default function ParentSettings() {
  const router = useRouter();
  const armedPresetId = useSandClockStore((s) => s.armedPresetId);
  const presetColors = useSandClockStore((s) => s.presetColors);
  const tone = useSandClockStore((s) => s.tone);
  const language = useSandClockStore((s) => s.language);
  const arm = useSandClockStore((s) => s.arm);
  const setPresetColor = useSandClockStore((s) => s.setPresetColor);
  const setTone = useSandClockStore((s) => s.setTone);
  const setLanguage = useSandClockStore((s) => s.setLanguage);

  const { playPreview } = useFinishTone();
  const previewTone = (id: ToneId) => {
    setTone(id);
    setTimeout(playPreview, 50);
  };

  // The active preset for color display — default to first if none armed
  const activePreset: PresetId = armedPresetId ?? PRESET_IDS[0];

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={16}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.fontPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        <Ionicons name="settings-outline" size={24} color={theme.colors.fontPrimary} />
      </View>

      {/* TIMER Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>TIMER</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillRow}
        >
          {PRESET_IDS.map((id: PresetId) => {
            const isActive = armedPresetId === id;
            return (
              <Pressable
                key={id}
                onPress={() => arm(id)}
                accessibilityRole="button"
                accessibilityLabel={t('a11y.selectPreset', { minutes: id })}
                style={[styles.pill, isActive && styles.pillActive]}
              >
                <Text style={[styles.pillNumber, isActive && styles.pillNumberActive]}>
                  {id}
                </Text>
                <Text style={[styles.pillUnit, isActive && styles.pillUnitActive]}>min</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* COLOR Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>COLOR</Text>
        <View style={styles.swatchRow}>
          {PALETTE_COLORS.map((c) => {
            const isActive = presetColors[activePreset] === c;
            return (
              <Pressable
                key={c}
                onPress={() => setPresetColor(activePreset, c)}
                accessibilityRole="button"
                accessibilityLabel={t('a11y.presetColor', { minutes: activePreset })}
                style={[styles.swatch, { backgroundColor: c }, isActive && styles.swatchActive]}
              />
            );
          })}
        </View>
      </View>

      {/* SOUND Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>SOUND</Text>
        <View style={styles.soundCard}>
          {TONE_IDS.map((id, idx) => {
            const isActive = tone === id;
            const isLast = idx === TONE_IDS.length - 1;
            return (
              <Pressable
                key={id}
                onPress={() => previewTone(id)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isActive }}
                style={[styles.soundRow, !isLast && styles.soundRowBorder]}
              >
                <Ionicons
                  name={TONE_ICONS[id]}
                  size={20}
                  color={theme.colors.fontSecondary}
                  style={styles.soundIcon}
                />
                <Text style={styles.soundLabel}>{t(`tones.${id}`)}</Text>
                {isActive && (
                  <Ionicons name="checkmark" size={20} color={theme.colors.mint} />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* LANGUAGE Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>LANGUAGE</Text>
        <View style={styles.soundCard}>
          {LANG_OPTIONS.map((o, idx) => {
            const isActive = language === o.id;
            const isLast = idx === LANG_OPTIONS.length - 1;
            return (
              <Pressable
                key={o.id}
                onPress={() => setLanguage(o.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isActive }}
                style={[styles.soundRow, !isLast && styles.soundRowBorder]}
              >
                <Text style={[styles.soundLabel, styles.soundLabelFull]}>{t(o.labelKey)}</Text>
                {isActive && (
                  <Ionicons name="checkmark" size={20} color={theme.colors.mint} />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>ABOUT</Text>
        <Text style={styles.aboutLine}>
          {t('settings.version')}: {Constants.expoConfig?.version ?? '0.0.0'}
        </Text>
        <Text style={styles.aboutLine}>{t('settings.privacy')}</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bgPrimary,
  },
  content: {
    paddingBottom: 48,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
    gap: theme.spacing.sm,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: theme.font.size.xl,
    fontFamily: theme.font.familyMap.semibold,
    fontWeight: theme.font.weight.semibold,
    color: theme.colors.fontPrimary,
  },

  // Section wrapper
  section: {
    paddingHorizontal: theme.spacing.sm,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  sectionLabel: {
    fontSize: theme.font.size.xs,
    fontFamily: theme.font.familyMap.semibold,
    fontWeight: theme.font.weight.semibold,
    color: theme.colors.fontTertiary,
    letterSpacing: 1.5,
  },

  // Duration pills
  pillRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    paddingVertical: 2,
  },
  pill: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.bgSecondary,
    minWidth: 56,
  },
  pillActive: {
    backgroundColor: theme.colors.mint,
  },
  pillNumber: {
    fontSize: theme.font.size.md,
    fontFamily: theme.font.familyMap.semibold,
    fontWeight: theme.font.weight.semibold,
    color: theme.colors.fontSecondary,
  },
  pillNumberActive: {
    color: theme.colors.fontPrimary,
  },
  pillUnit: {
    fontSize: 10,
    fontFamily: theme.font.familyMap.regular,
    color: theme.colors.fontTertiary,
  },
  pillUnitActive: {
    color: theme.colors.fontSecondary,
  },

  // Color swatches
  swatchRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  swatchActive: {
    borderWidth: 2,
    borderColor: theme.colors.fontPrimary,
  },

  // Sound card
  soundCard: {
    backgroundColor: theme.colors.bgSecondary,
    borderRadius: 16,
    overflow: 'hidden',
  },
  soundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 14,
  },
  soundRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.fontTertiary + '40',
  },
  soundIcon: {
    marginRight: theme.spacing.sm,
  },
  soundLabel: {
    flex: 1,
    fontSize: theme.font.size.sm,
    fontFamily: theme.font.familyMap.regular,
    color: theme.colors.fontPrimary,
  },
  soundLabelFull: {
    flex: 1,
  },

  // About
  aboutLine: {
    fontSize: theme.font.size.sm,
    fontFamily: theme.font.familyMap.regular,
    color: theme.colors.fontSecondary,
    lineHeight: 20,
  },
});
