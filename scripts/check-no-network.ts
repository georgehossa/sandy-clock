#!/usr/bin/env tsx
/**
 * Build-time guard: fails if any source file under app/, components/, hooks/,
 * state/, or lib/ imports/uses fetch, XMLHttpRequest, expo-network, axios,
 * or @apollo/client.
 *
 * Spec: openspec/changes/add-sand-clock-mvp/specs/privacy-and-offline/spec.md
 */
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative } from 'path';

const ROOT = process.cwd();
const SCAN_DIRS = ['app', 'components', 'hooks', 'state', 'lib'];
const EXTS = new Set(['.ts', '.tsx', '.js', '.jsx']);

const FORBIDDEN_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /\bfetch\s*\(/g, label: 'fetch(' },
  { pattern: /\bXMLHttpRequest\b/g, label: 'XMLHttpRequest' },
  { pattern: /from\s+['"]expo-network['"]/g, label: "from 'expo-network'" },
  { pattern: /from\s+['"]axios['"]/g, label: "from 'axios'" },
  { pattern: /from\s+['"]@apollo\/client['"]/g, label: "from '@apollo/client'" },
  { pattern: /require\s*\(\s*['"]expo-network['"]\s*\)/g, label: "require('expo-network')" },
  { pattern: /require\s*\(\s*['"]axios['"]\s*\)/g, label: "require('axios')" },
];

const walk = (dir: string, files: string[] = []): string[] => {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return files;
  }
  for (const e of entries) {
    const full = join(dir, e);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) walk(full, files);
    else {
      const dot = e.lastIndexOf('.');
      if (dot >= 0 && EXTS.has(e.slice(dot))) files.push(full);
    }
  }
  return files;
};

const violations: string[] = [];

for (const d of SCAN_DIRS) {
  const abs = join(ROOT, d);
  for (const file of walk(abs)) {
    const text = readFileSync(file, 'utf8');
    for (const { pattern, label } of FORBIDDEN_PATTERNS) {
      pattern.lastIndex = 0;
      if (pattern.test(text)) {
        violations.push(`${relative(ROOT, file)}: forbidden ${label}`);
      }
    }
  }
}

if (violations.length > 0) {
  console.error('\n❌ Privacy guard failed. The app must not make network calls.\n');
  for (const v of violations) console.error(`  - ${v}`);
  console.error(
    '\nSee openspec/changes/add-sand-clock-mvp/specs/privacy-and-offline/spec.md\n',
  );
  process.exit(1);
} else {
  console.log('✅ Privacy guard passed: no network APIs found in app/components/hooks/state/lib.');
}
