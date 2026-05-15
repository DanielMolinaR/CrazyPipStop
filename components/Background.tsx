import * as React from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Image, type ImageContentFit, type ImageSource } from 'expo-image';

// Drop-in replacement for react-native's <ImageBackground>, but the
// underlying image renders via expo-image with `cachePolicy: 'memory-disk'`
// so the decoded bitmap is kept in memory across mount/unmount cycles.
//
// Why this exists: every screen mount in this app uses a stretched-fit
// background pattern. RN's <ImageBackground> doesn't aggressively cache
// decoded bitmaps, so every forward navigation (Home -> Game -> Resolve)
// re-decoded the gray pattern from disk — visibly slow on iPad.

// Map RN's ImageBackground `resizeMode` prop to expo-image's `contentFit`.
const CONTENT_FIT: Record<ResizeMode, ImageContentFit> = {
  cover: 'cover',
  contain: 'contain',
  stretch: 'fill',
  center: 'none',
};

type ResizeMode = 'cover' | 'contain' | 'stretch' | 'center';

interface BackgroundProps {
  source: ImageSource | number;
  resizeMode?: ResizeMode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export default function Background({
  source,
  resizeMode = 'cover',
  className,
  style,
  children,
}: BackgroundProps) {
  return (
    <View className={className} style={style}>
      <Image
        source={source}
        style={StyleSheet.absoluteFill}
        contentFit={CONTENT_FIT[resizeMode]}
        cachePolicy="memory-disk"
      />
      {children}
    </View>
  );
}
