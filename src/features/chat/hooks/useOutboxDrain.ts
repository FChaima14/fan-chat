import { useEffect, useState } from 'react';
import { backend } from '@/mocks/backend';
import { useChatStore } from '../store/chatStore';

const POLL_MS = 1000;

// TODO: replace polling backend.offline with a real connectivity listener
// (e.g. NetInfo) once this app talks to a real backend.
export function useOutboxDrain() {
  const hydrate = useChatStore((state) => state.hydrate);
  const reconnect = useChatStore((state) => state.reconnect);
  const [isOffline, setIsOffline] = useState(backend.offline);

  useEffect(() => {
    hydrate().then(() => reconnect());
  }, [hydrate, reconnect]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsOffline((was) => {
        if (was && !backend.offline) reconnect();
        return backend.offline;
      });
    }, POLL_MS);
    return () => clearInterval(interval);
  }, [reconnect]);

  return { isOffline };
}
