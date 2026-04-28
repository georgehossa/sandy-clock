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
