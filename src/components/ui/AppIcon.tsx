import { Ionicons } from '@expo/vector-icons';

import { useAppTheme } from '@/theme/ThemeProvider';
import { accent } from '@/theme/tokens';

export type AppIconName =
  | 'home'
  | 'transactions'
  | 'connections'
  | 'more'
  | 'add'
  | 'receive'
  | 'send'
  | 'pay'
  | 'eye'
  | 'eye-off'
  | 'scan'
  | 'bell'
  | 'accounts'
  | 'cards'
  | 'investments'
  | 'settings'
  | 'chevron-forward'
  | 'warning'
  | 'sync';

const ICON_MAP: Record<AppIconName, keyof typeof Ionicons.glyphMap> = {
  home: 'home-outline',
  transactions: 'receipt-outline',
  connections: 'link-outline',
  more: 'grid-outline',
  add: 'add',
  receive: 'arrow-down-outline',
  send: 'arrow-up-outline',
  pay: 'card-outline',
  eye: 'eye-outline',
  'eye-off': 'eye-off-outline',
  scan: 'scan-outline',
  bell: 'notifications-outline',
  accounts: 'wallet-outline',
  cards: 'card-outline',
  investments: 'trending-up-outline',
  settings: 'settings-outline',
  'chevron-forward': 'chevron-forward',
  warning: 'warning-outline',
  sync: 'sync-outline',
};

interface AppIconProps {
  name: AppIconName;
  size?: number;
  color?: string;
  active?: boolean;
}

export function AppIcon({ name, size = 22, color, active }: AppIconProps) {
  const { theme } = useAppTheme();
  const resolvedColor = color ?? (active ? theme.colors.tabBarActive : theme.colors.textMuted);

  return <Ionicons name={ICON_MAP[name]} size={size} color={resolvedColor} />;
}

export function CenterTabIcon({ active }: { active?: boolean }) {
  return <Ionicons name="swap-horizontal" size={24} color="#FFFFFF" />;
}

export { accent };
