import { usePathname, useRouter } from "expo-router";
import {
  Grid3x3,
  Home,
  Link2,
  Receipt,
  type LucideIcon,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { GlassView } from "@/components/ui/liquid-glass";
import { Pressable } from "@/components/ui/pressable";
import { useAppTheme } from "@/theme/ThemeProvider";

type TabItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  href: string;
  match: (pathname: string) => boolean;
};

const TABS: TabItem[] = [
  {
    key: "inicio",
    label: "Início",
    icon: Home,
    href: "/(app)/(tabs)",
    match: (p) => p === "/" || p === "/index",
  },
  {
    key: "extrato",
    label: "Extrato",
    icon: Receipt,
    href: "/(app)/(tabs)/transactions",
    match: (p) => p.startsWith("/transactions"),
  },
  {
    key: "bancos",
    label: "Bancos",
    icon: Link2,
    href: "/(app)/(tabs)/connections",
    match: (p) => p.startsWith("/connections"),
  },
  {
    key: "mais",
    label: "Mais",
    icon: Grid3x3,
    href: "/(app)/(tabs)/more",
    match: (p) => p.startsWith("/more"),
  },
];

export function FloatingNavbar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useAppTheme();

  return (
    <Box
      pointerEvents="box-none"
      className="absolute left-4 right-4 z-50 items-center"
      style={{ bottom: Math.max(insets.bottom, 16) + 8 }}
    >
      <GlassView
        glassEffectStyle="none"
        isInteractive
        colorScheme={theme.dark ? "dark" : "light"}
        tintColor={
          theme.dark ? "rgba(28, 28, 30, 0.92)" : "rgba(255, 255, 255, 0.92)"
        }
        style={{
          backgroundColor: theme.dark
            ? "rgba(28, 28, 30, 0.92)"
            : "rgba(255, 255, 255, 0.92)",
        }}
        className="h-16 max-w-[280px] overflow-hidden rounded-full border border-border/60 shadow-lg shadow-black/40"
      >
        <HStack className="h-full w-full items-center justify-between">
          {TABS.map((tab) => {
            const active = tab.match(pathname);
            const Icon = tab.icon;
            return (
              <Pressable
                key={tab.key}
                accessibilityLabel={tab.label}
                onPress={() => router.navigate(tab.href as never)}
                className="flex-1 items-center justify-center"
              >
                <Box
                  className={[
                    "h-13 w-13 items-center justify-center rounded-full",
                    active ? "bg-primary shadow-md shadow-primary/45" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.4 : 1.8}
                    color={active ? "#FFFFFF" : theme.colors.textMuted}
                  />
                </Box>
              </Pressable>
            );
          })}
        </HStack>
      </GlassView>
    </Box>
  );
}
