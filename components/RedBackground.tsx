import * as React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { ClipPath, Defs, G, Polygon, Polyline, Rect } from 'react-native-svg';

// Programmatic replacement for the old red-background-*.png assets:
// a solid red field with horizontal lighter-red stripes (the "chevron"
// pattern), a triangular notch cut INTO the bottom edge, and a thin
// black outline tracing the notch.
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
//   - vDepth: 0–1, depth of the triangular notch cut into the bottom
//     edge of the red region (apex points up into the red).

const RED_BASE = '#D2160F'; // cps-red — solid background
const RED_STRIPE = '#E84840'; // lighter pinkish red — chevron stripes
const NOTCH_OUTLINE = '#000000';

const STRIPE_THICKNESS = 1.0; // viewBox units (= % of height)
const DEFAULT_STRIPE_COUNT = 18;
const NOTCH_OUTLINE_WIDTH = 1.0; // viewBox units; vectorEffect keeps
                                  // it a fixed pixel width regardless
                                  // of the stretched aspect ratio.

interface RedBackgroundProps {
  chevronStart: number;
  vDepth: number;
  // Vertical rise (in viewBox units) of each stripe's centre apex
  // above its edges — the angle that makes the stripes chevron
  // inward, mirroring the bottom V-notch. Defaults to half the
  // notch depth so the stripe slope echoes the notch slope.
  chevronRise?: number;
  stripeCount?: number;
}

export default function RedBackground({
  chevronStart,
  vDepth,
  chevronRise = vDepth * 50,
  stripeCount = DEFAULT_STRIPE_COUNT,
}: RedBackgroundProps) {
  // The bottom edge of the red region is the V-notch: it dips up to
  // y = (100 - vDepth*100) at the centre, while the corners stay at
  // y = 100. Polygon traced clockwise from top-left.
  const notchTipY = 100 - vDepth * 100;
  const clipPoints = `0,0 100,0 100,100 50,${notchTipY} 0,100`;
  const notchOutlinePoints = `0,100 50,${notchTipY} 100,100`;

  // Stripes span chevronStart -> just shy of the bottom; the clip
  // handles whatever portion falls inside the notch.
  const stripeAreaHeight = 100 - chevronStart * 100 - STRIPE_THICKNESS;
  const stripes = Array.from({ length: stripeCount }, (_, i) => {
    const t = i / Math.max(stripeCount - 1, 1);
    return chevronStart * 100 + stripeAreaHeight * t;
  });

  // Build each stripe as a 6-point chevron band rather than a flat
  // rectangle: top-left → top-centre apex (raised by chevronRise) →
  // top-right → bottom-right → bottom-centre apex (same rise) →
  // bottom-left. The stripes form the inward chevron pattern that
  // echoes the V-notch shape.
  const stripePoints = (y: number) =>
    `0,${y} 50,${y - chevronRise} 100,${y} ` +
    `100,${y + STRIPE_THICKNESS} 50,${y - chevronRise + STRIPE_THICKNESS} 0,${y + STRIPE_THICKNESS}`;

  return (
    <Svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={StyleSheet.absoluteFill}
    >
      <Defs>
        <ClipPath id="redBgNotch">
          <Polygon points={clipPoints} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#redBgNotch)">
        <Rect x="0" y="0" width="100" height="100" fill={RED_BASE} />
        {stripes.map((y, i) => (
          <Polygon key={i} points={stripePoints(y)} fill={RED_STRIPE} />
        ))}
      </G>
      {/* Black outline traces the two edges of the V-notch. Drawn on
          top of the clipped red, with non-scaling-stroke so its
          thickness stays consistent regardless of aspect stretch. */}
      <Polyline
        points={notchOutlinePoints}
        stroke={NOTCH_OUTLINE}
        strokeWidth={NOTCH_OUTLINE_WIDTH}
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    </Svg>
  );
}
