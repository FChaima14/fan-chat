import { useMemo } from 'react';
import type { ServerMessage } from '@/mocks/backend';
import { useChatStore } from '../store/chatStore';
import type { ThreadRow } from '../types';

function dayLabel(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  const isSameDay = date.toDateString() === today.toDateString();
  if (isSameDay) return 'Today';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

// confirmed (by seq) first, then outbox items not yet confirmed (by createdAt),
// with a "Today" / date separator inserted wherever the calendar day changes.
// A row only moves once, from the outbox tail into its seq position, when it
// confirms — see CLAUDE.md "Thread ordering". `paginatedHistory` lets callers
// (MessageList) fold in older pages fetched from backend.page().
export function useChatThread(paginatedHistory: ServerMessage[] = []): ThreadRow[] {
  const liveThread = useChatStore((state) => state.thread);
  const outbox = useChatStore((state) => state.outbox);

  return useMemo(() => {
    const byClientId = new Map<string, ServerMessage>();
    for (const message of paginatedHistory) byClientId.set(message.clientId, message);
    for (const message of liveThread) byClientId.set(message.clientId, message);
    const confirmed = [...byClientId.values()].sort((a, b) => a.seq - b.seq);

    const pending = [...outbox].sort((a, b) => a.createdAt - b.createdAt);

    const rows: ThreadRow[] = [];
    let lastLabel: string | null = null;

    for (const message of confirmed) {
      const label = dayLabel(message.createdAt);
      if (label !== lastLabel) {
        rows.push({ kind: 'separator', clientId: `separator-${label}-${message.seq}`, label });
        lastLabel = label;
      }
      rows.push({ kind: 'confirmed', ...message });
    }

    for (const entry of pending) {
      const label = dayLabel(entry.createdAt);
      if (label !== lastLabel) {
        rows.push({ kind: 'separator', clientId: `separator-${label}-${entry.clientId}`, label });
        lastLabel = label;
      }
      rows.push({
        kind: 'outgoing',
        clientId: entry.clientId,
        text: entry.text,
        createdAt: entry.createdAt,
        status: entry.status,
        error: entry.error,
      });
    }

    return rows;
  }, [paginatedHistory, liveThread, outbox]);
}
