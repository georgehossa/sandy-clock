import { LinearGradient, Path, vec } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { lightenHex } from '@/lib/colorUtils';
import { circleChordPath, liquidLevelY } from './geometry';

type Props = {
  cx: number;
  cy: number;
  sandR: number;
  /**
   * Fraction of this chamber that is filled with liquid [0,1].
   *   0 → empty (no fill drawn)
   *   1 → full (complete circle)
   * Caller is responsible for passing the correct fraction:
   *   top chamber    → topFraction
   *   bottom chamber → 1 - topFraction
   */
  progress: number;
  color: string;
};

/**
 * Renders a liquid fill for one hourglass chamber using horizontal level intersection.
 *
 * The fill is a Skia Path representing the area of the circle (radius=sandR) that
 * lies below the liquid surface line. A LinearGradient is applied as a child shader,
 * with bounds fixed to the full circle diameter so the color relationship is stable
 * as the liquid level changes.
 *
 * Gradient: lightened color at top of circle → base color at bottom.
 */
export const SandBody = ({ cx, cy, sandR, progress, color }: Props) => {
  const levelY = useMemo(
    () => liquidLevelY(progress, cy, sandR),
    [progress, cy, sandR],
  );

  const path = useMemo(
    () => circleChordPath(cx, cy, sandR, levelY),
    [cx, cy, sandR, levelY],
  );

  // Gradient fixed to circle bounds — not to the current fill level.
  const gradientStart = useMemo(() => vec(cx, cy - sandR), [cx, cy, sandR]);
  const gradientEnd = useMemo(() => vec(cx, cy + sandR), [cx, cy, sandR]);
  const gradientColors = useMemo(() => [lightenHex(color, 0.3), color], [color]);

  return (
    <Path path={path}>
      <LinearGradient
        start={gradientStart}
        end={gradientEnd}
        colors={gradientColors}
      />
    </Path>
  );
};
