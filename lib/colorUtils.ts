/**
 * Color utility functions for the hourglass liquid effects.
 * All functions operate on well-formed 6-digit hex strings (#RRGGBB).
 */

/**
 * Lighten a hex color by mixing it toward white by `amount` (0–1).
 *
 * amount=0   → original color unchanged
 * amount=0.3 → 30% blended toward white
 * amount=1   → pure white (#FFFFFF)
 *
 * Only works with 6-digit hex strings (e.g. "#E8945A").
 * Alpha is not supported and will be ignored.
 */
export const lightenHex = (hex: string, amount: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const lerp = (channel: number) =>
    Math.round(channel + (255 - channel) * amount);

  const toHex = (n: number) => n.toString(16).padStart(2, '0');

  return `#${toHex(lerp(r))}${toHex(lerp(g))}${toHex(lerp(b))}`;
};
