import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFinishTone } from '@/hooks/useFinishTone';
import { t } from '@/lib/i18n';
import { theme } from '@/lib/theme';
import {
  DEFAULT_PRESET_COLORS,
  PRESET_IDS,
  TONE_IDS,
  type PresetId,
  type ToneId,
} from '@/state/presets';
import { useSandClockStore, type LanguagePref } from '@/state/store';

const LANG_OPTIONS: { id: LanguagePref; icon: keyof typeof Ionicons.glyphMap; labelKey: string }[] = [
  { id: 'system', icon: 'desktop-outline', labelKey: 'settings.languageSystem' },
  { id: 'en',     icon: 'globe-outline',   labelKey: 'settings.languageEnglish' },
  { id: 'es',     icon: 'globe-outline',   labelKey: 'settings.languageSpanish' },
];

// Tone rows: icon per tone ID (label resolved via i18n at render time)
const TONE_ICONS: Record<ToneId, keyof typeof Ionicons.glyphMap> = {
  'bubble-pop':  'radio-button-on-outline',
  'magic-chime': 'sparkles-outline',
  'soft-bell':   'notifications-outline',
};


export default function ParentSettings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const armedPresetId = useSandClockStore((s) => s.armedPresetId);
  const tone = useSandClockStore((s) => s.tone);
  const language = useSandClockStore((s) => s.language);
  const arm = useSandClockStore((s) => s.arm);
  const setTone = useSandClockStore((s) => s.setTone);
  const setLanguage = useSandClockStore((s) => s.setLanguage);

  const { playPreview } = useFinishTone();
  const previewTone = (id: ToneId) => {
    setTone(id);
    setTimeout(playPreview, 50);
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: Math.max(insets.bottom, theme.spacing.xl) },
      ]}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={16}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.fontPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        {/* Spacer matching back icon width for symmetric centering */}
        <View style={{ width: 24 }} />
      </View>

      {/* TIMER Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>TIMER</Text>
        <View style={styles.timerRow}>
          {PRESET_IDS.map((id: PresetId) => {
            const isActive = armedPresetId === id;
            return (
              <Pressable
                key={id}
                onPress={() => arm(id)}
                accessibilityRole="button"
                accessibilityLabel={t('a11y.selectPreset', { minutes: id })}
                style={[
                  styles.timerTile,
                  { backgroundColor: DEFAULT_PRESET_COLORS[id] },
                  isActive && styles.timerTileSelected,
                ]}
              >
                <Text style={styles.timerNumber}>{id}</Text>
                <Text style={styles.timerUnit}>min</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* SOUND Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>SOUND</Text>
        <View style={styles.card}>
          {TONE_IDS.map((id, idx) => {
            const isActive = tone === id;
            const isLast = idx === TONE_IDS.length - 1;
            return (
              <View key={id}>
                <Pressable
                  onPress={() => previewTone(id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isActive }}
                  style={[styles.cardRow, isActive && styles.cardRowActive]}
                >
                  <View style={styles.rowLeft}>
                    <Ionicons
                      name={TONE_ICONS[id]}
                      size={20}
                      color={isActive ? theme.colors.mintDark : theme.colors.fontSecondary}
                    />
                    <Text style={[styles.rowLabel, isActive && styles.rowLabelActive]}>
                      {t(`tones.${id}`)}
                    </Text>
                  </View>
                  {isActive && (
                    <Ionicons name="checkmark" size={18} color={theme.colors.fontPrimary} />
                  )}
                </Pressable>
                {!isLast && <View style={styles.divider} />}
              </View>
            );
          })}
        </View>
      </View>

      {/* LANGUAGE Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>LANGUAGE</Text>
        <View style={styles.card}>
          {LANG_OPTIONS.map((o, idx) => {
            const isActive = language === o.id;
            const isLast = idx === LANG_OPTIONS.length - 1;
            return (
              <View key={o.id}>
                <Pressable
                  onPress={() => setLanguage(o.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isActive }}
                  style={[styles.cardRow, isActive && styles.cardRowActive]}
                >
                  <View style={styles.rowLeft}>
                    <Ionicons
                      name={o.icon}
                      size={20}
                      color={isActive ? theme.colors.mintDark : theme.colors.fontSecondary}
                    />
                    <Text style={[styles.rowLabel, isActive && styles.rowLabelActive]}>
                      {t(o.labelKey)}
                    </Text>
                  </View>
                  {isActive && (
                    <Ionicons name="checkmark" size={18} color={theme.colors.fontPrimary} />
                  )}
                </Pressable>
                {!isLast && <View style={styles.divider} />}
              </View>
            );
          })}
        </View>
      </View>

      {/* ABOUT Section */}
      <View style={[styles.section, { gap: 8 }]}>
        <Text style={styles.sectionLabel}>ABOUT</Text>
        <View style={styles.card}>
          {/* Version row */}
          <View style={styles.cardRow}>
            <Text style={styles.rowLabel}>{t('settings.version')}</Text>
            <Text style={styles.rowValue}>{Constants.expoConfig?.version ?? '0.0.0'}</Text>
          </View>
          <View style={styles.divider} />
          {/* Privacy row */}
          <View style={[styles.cardRow, { gap: 14 }]}>
            <Ionicons name="shield-checkmark-outline" size={20} color={theme.colors.fontSecondary} />
            <Text style={[styles.rowValue, styles.privacyText]}>
              {t('settings.privacy')}
            </Text>
          </View>
          <View style={styles.divider} />
          {/* Twitter row */}
          <View style={styles.cardRow}>
            <View style={styles.rowLeft}>
              <Ionicons name="logo-twitter" size={20} color={theme.colors.fontSecondary} />
              <Text style={styles.rowLabel}>@georgehossa</Text>
            </View>
          </View>
        </View>
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

  // Header — back chevron + centered title + 24px spacer
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: theme.font.familyMap.semibold,
    fontWeight: theme.font.weight.semibold,
    color: theme.colors.fontPrimary,
  },

  // Body sections — gap 32, padding [8, 24, 0, 24]
  section: {
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: theme.font.familyMap.semibold,
    fontWeight: theme.font.weight.semibold,
    color: theme.colors.fontTertiary,
    letterSpacing: 1.5,
  },

  // Timer tiles
  timerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  timerTile: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerTileSelected: {
    borderWidth: 2,
    borderColor: theme.colors.fontPrimary,
  },
  timerNumber: {
    fontSize: 18,
    fontFamily: theme.font.familyMap.regular,
    fontWeight: '500' as const,
    color: theme.colors.fontPrimary,
  },
  timerUnit: {
    fontSize: 10,
    fontFamily: theme.font.familyMap.regular,
    color: theme.colors.fontPrimary,
  },

  // Shared card container (SOUND, LANGUAGE, ABOUT)
  card: {
    backgroundColor: theme.colors.bgSecondary,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  cardRowActive: {
    backgroundColor: '#D8EDE9',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  rowLabel: {
    fontSize: 15,
    fontFamily: theme.font.familyMap.regular,
    color: theme.colors.fontPrimary,
  },
  rowLabelActive: {
    fontFamily: theme.font.familyMap.semibold,
    fontWeight: theme.font.weight.semibold,
  },
  rowValue: {
    fontSize: 15,
    fontFamily: theme.font.familyMap.regular,
    color: theme.colors.fontSecondary,
  },
  privacyText: {
    flex: 1,
    lineHeight: 20,
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.bgPrimary,
  },
});
