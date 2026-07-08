import { useEffect, useRef } from 'react';

import { connectionsApi } from '@/api/endpoints/connections';
import type { Connection, ConnectionStatus } from '@/types/api';
import { sleep } from '@/utils/helpers';

const POLL_INTERVAL_MS = 2500;
const POLL_TIMEOUT_MS = 60000;

const TERMINAL_STATUSES: ConnectionStatus[] = ['CONNECTED', 'ERROR', 'EXPIRED', 'DISCONNECTED'];

interface UseConnectionPollingOptions {
  connectionId: string | null;
  enabled?: boolean;
  onUpdate?: (connection: Connection) => void;
  onComplete?: (connection: Connection) => void;
  onTimeout?: () => void;
}

export function useConnectionPolling({
  connectionId,
  enabled = true,
  onUpdate,
  onComplete,
  onTimeout,
}: UseConnectionPollingOptions) {
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!connectionId || !enabled) return;

    cancelledRef.current = false;
    const startTime = Date.now();

    async function poll() {
      while (!cancelledRef.current) {
        if (Date.now() - startTime > POLL_TIMEOUT_MS) {
          onTimeout?.();
          break;
        }

        try {
          const connection = await connectionsApi.get(connectionId!);
          onUpdate?.(connection);

          if (TERMINAL_STATUSES.includes(connection.status) || connection.status === 'CONNECTED') {
            if (connection.status !== 'SYNCING') {
              onComplete?.(connection);
              break;
            }
          }
        } catch {
          break;
        }

        await sleep(POLL_INTERVAL_MS);
      }
    }

    poll();

    return () => {
      cancelledRef.current = true;
    };
  }, [connectionId, enabled, onUpdate, onComplete, onTimeout]);
}
