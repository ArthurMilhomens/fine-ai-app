import { useEffect } from 'react';

import { LoadingScreen } from '@/components/patterns/Skeleton';
import { useAuth } from '@/auth/useAuth';

export default function SplashScreen() {
  const { bootstrap, isBootstrapping } = useAuth();

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  if (isBootstrapping) {
    return <LoadingScreen />;
  }

  return null;
}
