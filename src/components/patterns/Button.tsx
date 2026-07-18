import {
  Button as GsButton,
  ButtonSpinner,
  ButtonText,
} from '@/components/ui/button';
import { Pressable } from '@/components/ui/pressable';
import { Box } from '@/components/ui/box';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

const variantMap = {
  primary: 'default',
  secondary: 'secondary',
  ghost: 'outline',
  danger: 'destructive',
} as const;

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
}: ButtonProps) {
  return (
    <GsButton
      onPress={onPress}
      disabled={disabled || loading}
      variant={variantMap[variant]}
      size="lg"
      className="w-full rounded-md">
      {loading ? <ButtonSpinner /> : null}
      <ButtonText className="text-base font-semibold">
        {loading ? 'Carregando...' : label}
      </ButtonText>
    </GsButton>
  );
}

export function IconButton({
  icon,
  onPress,
}: {
  icon: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="h-11 w-11 items-center justify-center rounded-sm bg-secondary">
      <Box className="items-center justify-center">{icon}</Box>
    </Pressable>
  );
}
