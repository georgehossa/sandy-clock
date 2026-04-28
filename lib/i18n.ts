import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import { useSandClockStore, type LanguagePref } from '@/state/store';
import en from '@/locales/en.json';
import es from '@/locales/es.json';

export const i18n = new I18n({ en, es });
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

const detectFromDevice = (): 'en' | 'es' => {
  const locales = getLocales();
  const code = locales[0]?.languageCode ?? 'en';
  return code === 'es' ? 'es' : 'en';
};

export const resolveLocale = (pref: LanguagePref): 'en' | 'es' =>
  pref === 'system' ? detectFromDevice() : pref;

const applyLocale = (pref: LanguagePref) => {
  i18n.locale = resolveLocale(pref);
};

// Initialize once and subscribe to language preference changes.
applyLocale(useSandClockStore.getState().language);

useSandClockStore.subscribe((s, prev) => {
  if (s.language !== prev.language) applyLocale(s.language);
});

export const t = (key: string, options?: Record<string, unknown>) => i18n.t(key, options);
