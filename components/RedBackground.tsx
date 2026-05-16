import * as React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { ClipPath, Defs, G, Polygon, Rect } from 'react-native-svg';

// Programmatic replacement for the old red-background-*.png assets:
// a solid red field with horizontal darker-red stripes (the "chevron"
// pattern) and a V-shaped cutout at the bottom edge.
//
// Drawn in SVG so it scales cleanly to any aspect ratio — works on
// every iPhone and every iPad without per-device PNGs. Renders into
// the parent via absolute-fill, so it's a drop-in replacement for
// the previous PNG-backed <Background source={...}>.
//
// Two screen-tunable knobs:
//   - chevronStart: 0–1, fraction of the available height at which
//     stripes start. The Home screen starts stripes near the middle;
//     Resolve starts them at the top.
//   - vDepth: 0–1, depth of the V cutout at the bottom edge.
//
// Colours come from the existing CPS palette (see tailwind.config.js).

const RED_BASE = '#D2160F'; // cps-red
const RED_STRIPE = '#A8120C'; // slightly darker for the chevron stripes

const STRIPE_THICKNESS = 1.5; // viewBox units (= % of height)
const DEFAULT_STRIPE_COUNT = 18;

interface RedBackgroundProps {
  chevronStart: number;
  vDepth: number;
  stripeCount?: number;
}

export default function RedBackground({
  chevronStart,
  vDepth,
  stripeCount = DEFAULT_STRIPE_COUNT,
}: RedBackgroundProps) {
  // V-cutout corners sit at y = (100 - vDepth*100); the tip dips to
  // y = 100. Stripes must stop above the corners so they don't bleed
  // into the cutout.
  const chevronEnd = 100 - vDepth * 100;
  const stripeAreaHeight = chevronEnd - chevronStart * 100 - STRIPE_THICKNESS;
  const stripes = Array.from({ length: stripeCount }, (_, i) => {
    const t = i / Math.max(stripeCount - 1, 1);
    return chevronStart * 100 + stripeAreaHeight * t;
  });

  // Polygon outlining the visible red region: rectangle minus the V
  // notch at the bottom.
  const clipPoints = `0,0 100,0 100,${chevronEnd} 50,100 0,${chevronEnd}`;

  return (
    <Svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={StyleSheet.absoluteFill}
    >
      <Defs>
        <ClipPath id="redBgVCut">
          <Polygon points={clipPoints} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#redBgVCut)">
        <Rect x="0" y="0" width="100" height="100" fill={RED_BASE} />
        {stripes.map((y, i) => (
          <Rect
            key={i}
            x="0"
            y={y}
            width="100"
            height={STRIPE_THICKNESS}
            fill={RED_STRIPE}
          />
        ))}
      </G>
    </Svg>
  );
}
