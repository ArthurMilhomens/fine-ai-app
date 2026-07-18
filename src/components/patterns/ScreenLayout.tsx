import type { ComponentProps } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';
import { ScrollView } from '@/components/ui/scroll-view';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

import { OfflineBanner } from './OfflineBanner';

const TAB_BAR_HEIGHT = 100;

type ScrollViewProps = ComponentProps<typeof ScrollView>;

interface ScreenLayoutProps extends ScrollViewProps {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
}

export function ScreenLayout({
  children,
  scroll = true,
  padded = true,
  ...props
}: ScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const { isOffline } = useNetworkStatus();

  const content = (
    <>
      {isOffline ? <OfflineBanner /> : null}
      <Box className={padded ? 'px-4' : undefined}>{children}</Box>
    </>
  );

  if (!scroll) {
    return (
      <Box
        className="flex-1 bg-background"
        style={{
          paddingTop: insets.top,
          paddingBottom: TAB_BAR_HEIGHT + insets.bottom,
        }}>
        {content}
      </Box>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: TAB_BAR_HEIGHT + insets.bottom,
      }}
      showsVerticalScrollIndicator={false}
      {...props}>
      {content}
    </ScrollView>
  );
}
