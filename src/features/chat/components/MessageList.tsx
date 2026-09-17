import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { backend, type ServerMessage } from '@/mocks/backend';
import { spacing } from '@/shared/theme/spacing';
import { useChatThread } from '../hooks/useChatThread';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { ThreadRow } from '../types';
import { DateSeparator } from './DateSeparator';
import { MessageBubble } from './MessageBubble';

const PAGE_SIZE = 40;

function renderItem({ item }: ListRenderItemInfo<ThreadRow>) {
  if (item.kind === 'separator') return <DateSeparator label={item.label} />;
  return <MessageBubble row={item} />;
}

function keyExtractor(row: ThreadRow) {
  return row.clientId;
}

export function MessageList() {
  const [history, setHistory] = useState<ServerMessage[]>([]);
  const [oldestSeqLoaded, setOldestSeqLoaded] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const beforeSeq = oldestSeqLoaded ?? Number.MAX_SAFE_INTEGER;
      const page = await backend.page(beforeSeq, PAGE_SIZE);
      if (page.length === 0) {
        setHasMore(false);
        return;
      }
      setHistory((prev) => [...page, ...prev]);
      setOldestSeqLoaded(page[0].seq);
      if (page.length < PAGE_SIZE) setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, oldestSeqLoaded]);

  // Fires the first page load once on mount. Deliberately not depending on
  // `loadMore` (its identity changes as paging state updates) — re-running on
  // every change would fetch every page immediately instead of one per scroll.
  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
  useEffect(() => {
    loadMore();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */

  const rows = useChatThread(history);
  const reducedMotion = useReducedMotion();

  return (
    <FlashList
      data={rows}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onStartReached={loadMore}
      onStartReachedThreshold={0.4}
      maintainVisibleContentPosition={{
        startRenderingFromBottom: true,
        autoscrollToBottomThreshold: 0.2,
        animateAutoScrollToBottom: !reducedMotion,
      }}
      contentContainerStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.md,
  },
});
