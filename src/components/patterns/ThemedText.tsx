import type { ComponentProps } from 'react';

import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

type TextProps = ComponentProps<typeof Text>;

interface ThemedTextProps extends Omit<TextProps, 'size'> {
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'label';
  muted?: boolean;
}

const sizeMap = {
  title: '3xl',
  subtitle: 'xl',
  body: 'md',
  caption: 'sm',
  label: 'sm',
} as const;

export function ThemedText({
  variant = 'body',
  muted,
  className,
  children,
  ...props
}: ThemedTextProps) {
  const colorClass = muted ? 'text-muted-foreground' : 'text-foreground';

  if (variant === 'title') {
    return (
      <Heading size="3xl" className={[colorClass, 'font-bold', className].filter(Boolean).join(' ')}>
        {children}
      </Heading>
    );
  }

  if (variant === 'subtitle') {
    return (
      <Heading size="xl" className={[colorClass, 'font-semibold', className].filter(Boolean).join(' ')}>
        {children}
      </Heading>
    );
  }

  return (
    <Text
      size={sizeMap[variant]}
      className={[
        colorClass,
        variant === 'label' ? 'font-medium' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}>
      {children}
    </Text>
  );
}
