import { Skia } from '@shopify/react-native-skia';

/**
 * Geometry for the circle-pill hourglass design.
 *
 * The hourglass consists of:
 *  - A pill body (rounded rectangle, radius = width/2)
 *  - Two circular chambers (top and bottom), each a circle
 *    centered horizontally, with sand drawn as arc sectors inside them.
 *
 * All proportions are derived from the Pencil design file (286×533 source).
 */

export type HourglassGeometry = {
  width: number;
  height: number;
  // Pill
  pillRadius: number;         // = width / 2 (true stadium)
  // Circles
  cx: number;                 // horizontal center of both circles
  circleR: number;            // radius of each cutout circle
  sandR: number;              // radius of the sand arc (slightly smaller than circle)
  topCY: number;              // center Y of top circle
  botCY: number;              // center Y of bottom circle
};

export const buildGeometry = (width: number, height: number): HourglassGeometry => {
  // Source: 286×533 Pencil design
  // Circle diameter = 208, so r = 104 → ratio = 104/286
  const circleR = (104 / 286) * width;
  // Sand arc radius = 99 (198/2) → ratio = 99/286
  const sandR = (99 / 286) * width;
  // Top circle: y=36, so center = 36 + 104 = 140 → ratio 140/533
  const topCY = (140 / 533) * height;
  // Bottom circle: y=289, center = 289 + 104 = 393 → ratio 393/533
  const botCY = (393 / 533) * height;

  return {
    width,
    height,
    pillRadius: width / 2,
    cx: width / 2,
    circleR,
    sandR,
    topCY,
    botCY,
  };
};

// Keep halfWidthAt for FallStream/GlitterField vertical positioning
// (approximate: distance from cx at a given Y based on nearest circle edge)
export const halfWidthAt = (g: HourglassGeometry, y: number): number => {
  return g.circleR * 0.85;
};

/**
 * Compute the Y coordinate of the liquid surface given how full the chamber is.
 *
 * `fraction` is the fill level [0,1] for this specific chamber:
 *   0 → chamber empty  → level at bottom of circle (cy + r), nothing drawn
 *   1 → chamber full   → level at top of circle (cy - r), full circle drawn
 *
 * Callers are responsible for passing the correct fraction per chamber:
 *   top chamber    → topFraction
 *   bottom chamber → 1 - topFraction
 *
 * Returns a Y in canvas space (Y increases downward).
 */
export const liquidLevelY = (
  fraction: number,
  cy: number,
  r: number,
): number => {
  const f = Math.max(0, Math.min(1, fraction));
  // fraction=1 (full)  → levelY = cy - r (top of circle)
  // fraction=0 (empty) → levelY = cy + r (bottom of circle)
  return cy + r - 2 * r * f;
};

/**
 * Build a Skia Path for the filled region of a circle below a horizontal level line.
 * This represents the liquid fill — the area of the circle at or below `levelY`.
 *
 * Edge cases:
 *   - levelY <= cy - r  (level above circle top): returns full circle path
 *   - levelY >= cy + r  (level below circle bottom): returns empty path (nothing drawn)
 *   - Near-edge clamping (|dy| > r*0.995) avoids degenerate arc segments
 *
 * @param cx      - horizontal center of the circle
 * @param cy      - vertical center of the circle
 * @param r       - radius of the circle
 * @param levelY  - Y coordinate of the liquid surface (canvas space, Y↓)
 */
export const circleChordPath = (
  cx: number,
  cy: number,
  r: number,
  levelY: number,
) => {
  const path = Skia.Path.Make();

  const dy = levelY - cy;

  // Full circle: level is above or at the top of the circle
  if (dy <= -r) {
    path.addCircle(cx, cy, r);
    return path;
  }

  // Empty: level is below or at the bottom of the circle
  if (dy >= r) {
    return path;
  }

  // Near-edge clamp: avoid degenerate arc when almost full or almost empty
  const clampedDy = Math.max(-r * 0.995, Math.min(r * 0.995, dy));
  const dx = Math.sqrt(r * r - clampedDy * clampedDy);
  const clampedLevelY = cy + clampedDy;

  const rightX = cx + dx;

  // Arc angles (Skia: 0°=right, 90°=down, clockwise positive)
  // startAngle = angle of the right intersection point from circle center
  // endAngle   = angle of the left intersection point = 180° - startAngle
  // sweep      = endAngle - startAngle = 180° - 2*startAngle
  //
  // Examples (Y increases downward):
  //   half full  (dy=0):   start=0°,   sweep=180° → bottom semicircle ✓
  //   75% full  (dy<0):   start=-30°, sweep=240° → large bottom arc ✓
  //   25% full  (dy>0):   start=+30°, sweep=120° → small bottom arc ✓
  const startAngleDeg = (Math.atan2(clampedDy, dx) * 180) / Math.PI;
  const sweepDeg = 180 - 2 * startAngleDeg;

  const oval = { x: cx - r, y: cy - r, width: r * 2, height: r * 2 };

  // Path construction:
  //   moveTo(rightX, levelY)           -- right intersection point
  //   arcToOval(startAngle, sweep, forceMoveTo=false)
  //                                    -- arc from right, clockwise around bottom, to left
  //                                    -- forceMoveTo=false connects from current point (no gap)
  //   close()                          -- straight line from left intersection back to right
  //                                    -- this IS the flat liquid surface line
  //
  // The enclosed region: flat surface at top + arc around bottom = liquid fill ✓
  path.moveTo(rightX, clampedLevelY);
  path.arcToOval(oval, startAngleDeg, sweepDeg, false);
  path.close();

  return path;
};
