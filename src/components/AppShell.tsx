import { RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FloatingNavbar } from '@/components/navigation/FloatingNavbar';
import { Box } from '@/components/ui/box';
import { ScrollView } from '@/components/ui/scroll-view';

interface AppShellProps {
  children: React.ReactNode;
  showNav?: boolean;
  scroll?: boolean;
  /** Pull-to-refresh. Only applies when scroll is enabled. */
  refreshing?: boolean;
  onRefresh?: () => void | Promise<void>;
}

/**
 * Shell base do protótipo: fundo tema, glow âmbar ambiente no topo
 * e navbar flutuante com Liquid Glass na parte inferior.
 */
export function AppShell({
  children,
  showNav = true,
  scroll = true,
  refreshing = false,
  onRefresh,
}: AppShellProps) {
  const insets = useSafeAreaInsets();

  const content = scroll ? (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: showNav ? 128 + insets.bottom : 40 + insets.bottom,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical
      bounces
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="transparent"
            colors={['transparent']}
            progressBackgroundColor="transparent"
          />
        ) : undefined
      }>
      {children}
    </ScrollView>
  ) : (
    <Box
      className="flex-1"
      style={{
        paddingTop: insets.top,
        paddingBottom: showNav ? 128 + insets.bottom : 40 + insets.bottom,
      }}>
      {children}
    </Box>
  );

  return (
    <Box className="flex-1 bg-background">
      <Box
        pointerEvents="none"
        className="absolute -top-[120px] self-center h-[520px] w-[520px] rounded-full bg-warning/10"
      />
      {content}
      {showNav ? <FloatingNavbar /> : null}
    </Box>
  );
}
