import type { ComponentProps } from 'react';

import { Card as GsCard } from '@/components/ui/card';

type GsCardProps = ComponentProps<typeof GsCard>;

interface CardProps extends GsCardProps {
  elevated?: boolean;
}

export function Card({ elevated, className, children, ...props }: CardProps) {
  return (
    <GsCard
      className={[
        'rounded-lg border border-border p-6',
        elevated ? 'bg-secondary' : 'bg-card',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}>
      {children}
    </GsCard>
  );
}
