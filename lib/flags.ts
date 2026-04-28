/**
 * Feature flags for Sand Clock.
 *
 * Flags are read from `app.json` → `expo.extra` at bundle time via expo-constants.
 * Override in `app.config.js` for local development:
 *
 * ```js
 * module.exports = ({ config }) => ({
 *   ...config,
 *   extra: { ...config.extra, showControls: true },
 * });
 * ```
 */
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

/**
 * When true, renders the Reset / Play / Stop controls bar on the Timer Screen.
 * Off by default — the primary UX is flip-to-start.
 */
export const SHOW_CONTROLS: boolean = extra.showControls === true;
