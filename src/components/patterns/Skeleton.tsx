import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { useAppTheme } from '@/theme/ThemeProvider';

type SkeletonWidth = number | `${number}%` | '100%';

/**
 * Bone with an internal shimmer wave (clipped to the element bounds).
 */
export function Skeleton({
  height = 16,
  width = '100%' as SkeletonWidth,
  radius = 8,
}: {
  height?: number;
  width?: SkeletonWidth;
  radius?: number;
}) {
  const { theme } = useAppTheme();
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    );
  }, [progress]);

  const waveStyle = useAnimatedStyle(() => {
    const travel = measuredWidth * 2;
    return {
      transform: [{ translateX: -measuredWidth + progress.value * travel }],
    };
  }, [measuredWidth]);

  const base = theme.colors.skeleton;
  const highlight = theme.dark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.7)';

  return (
    <View
      onLayout={(e) => {
        const next = e.nativeEvent.layout.width;
        if (next > 0 && next !== measuredWidth) setMeasuredWidth(next);
      }}
      style={{
        height,
        width,
        borderRadius: radius,
        overflow: 'hidden',
        backgroundColor: base,
      }}>
      {measuredWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: measuredWidth,
            },
            waveStyle,
          ]}>
          <LinearGradient
            colors={[base, highlight, base]}
            locations={[0.15, 0.5, 0.85]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}

/** Full-screen boot / route gate — skeleton, never a spinner. */
export function LoadingScreen() {
  return (
    <Box className="flex-1 bg-background px-6 pt-16">
      <VStack className="gap-6">
        <Skeleton height={40} width={40} radius={20} />
        <Skeleton height={24} width="55%" />
        <Skeleton height={160} radius={28} />
        <Skeleton height={88} radius={20} />
        <Skeleton height={88} radius={20} />
        <Skeleton height={120} radius={20} />
      </VStack>
    </Box>
  );
}

/** Generic vertical list of card placeholders. */
export function ListSkeleton({ rows = 4, padded = true }: { rows?: number; padded?: boolean }) {
  const { theme } = useAppTheme();
  return (
    <View style={[styles.list, !padded && styles.listFlush]}>
      {Array.from({ length: rows }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}>
          <Skeleton height={14} width="45%" />
          <Skeleton height={12} width="70%" />
          <Skeleton height={20} width="35%" />
        </View>
      ))}
    </View>
  );
}

/** Single detail card placeholder. */
export function DetailSkeleton({ padded = true }: { padded?: boolean } = {}) {
  const { theme } = useAppTheme();
  return (
    <View style={[styles.detailWrap, !padded && styles.listFlush]}>
      <View
        style={[
          styles.detailCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}>
        <Skeleton height={18} width="50%" />
        <Skeleton height={12} width="35%" />
        <Skeleton height={32} width="60%" />
        <Skeleton height={12} width="45%" />
        <Skeleton height={12} width="55%" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 24, gap: 12 },
  listFlush: { paddingHorizontal: 0 },
  card: {
    gap: 12,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
  },
  detailWrap: { paddingHorizontal: 24 },
  detailCard: {
    gap: 12,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
  },
});
