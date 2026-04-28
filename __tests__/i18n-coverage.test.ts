/**
 * Verifies that every key present in en.json also exists in es.json.
 * Catches missing translations before a build reaches users.
 */
import en from '../locales/en.json';
import es from '../locales/es.json';

/** Recursively collect all dot-notation keys from a nested object. */
function collectKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const full = prefix ? `${prefix}.${k}` : k;
    return v !== null && typeof v === 'object' && !Array.isArray(v)
      ? collectKeys(v as Record<string, unknown>, full)
      : [full];
  });
}

describe('i18n coverage', () => {
  const enKeys = collectKeys(en as Record<string, unknown>);
  const esKeys = new Set(collectKeys(es as Record<string, unknown>));

  it('every en.json key exists in es.json', () => {
    const missing = enKeys.filter((k) => !esKeys.has(k));
    expect(missing).toEqual([]);
  });
});
