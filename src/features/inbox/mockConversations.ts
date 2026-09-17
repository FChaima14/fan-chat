import type { ConversationRow } from './types';

export const MOCK_CONVERSATIONS: ConversationRow[] = Array.from({ length: 11 }, (_, i) => ({
  id: `conversation-${i}`,
  fullName: 'Full Name',
  username: '@username',
  preview: 'You: Lorem ipsum dolor sit am...',
  timeAgo: '30s ago',
  online: i % 3 !== 0,
}));
