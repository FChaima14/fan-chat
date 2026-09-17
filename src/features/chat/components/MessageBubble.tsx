import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import type { SendErrorCode, ThreadRow } from '../types';
import { StatusPill } from './StatusPill';

const ERROR_MESSAGES: Record<SendErrorCode, string> = {
  NETWORK_UNAVAILABLE: 'No connection',
  RESPONSE_LOST: 'No connection',
  MESSAGE_TOO_LONG: 'Message is too long',
  NOT_SUBSCRIBED: 'Subscription required to send',
};

function MessageBubbleBase({ row }: { row: Extract<ThreadRow, { kind: 'confirmed' | 'outgoing' }> }) {
  const fromMe = row.kind === 'outgoing' || row.author === 'me';

  return (
    <View style={[styles.row, fromMe ? styles.rowMe : styles.rowThem]}>
      {!fromMe && (
        <View style={styles.avatar}>
          <Text style={styles.avatarInitial}>E</Text>
        </View>
      )}
      <View style={styles.column}>
        <View style={[styles.bubble, fromMe ? styles.bubbleMe : styles.bubbleThem]}>
          <Text style={[styles.text, fromMe ? styles.textMe : styles.textThem]}>{row.text}</Text>
        </View>
        {row.kind === 'outgoing' && (
          <StatusPill status={row.status} errorMessage={row.error ? ERROR_MESSAGES[row.error.code] : undefined} />
        )}
      </View>
    </View>
  );
}

export const MessageBubble = memo(MessageBubbleBase, (prev, next) => prev.row === next.row);

const AVATAR_SIZE = 28;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  rowMe: {
    justifyContent: 'flex-end',
  },
  rowThem: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.surface,
  },
  column: {
    maxWidth: '75%',
  },
  bubble: {
    borderRadius: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  bubbleMe: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: spacing.xs,
    alignSelf: 'flex-end',
  },
  bubbleThem: {
    backgroundColor: colors.background,
    borderBottomLeftRadius: spacing.xs,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.body,
  },
  textMe: {
    color: colors.surface,
  },
  textThem: {
    color: colors.textPrimary,
  },
});
