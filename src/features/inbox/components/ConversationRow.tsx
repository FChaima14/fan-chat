import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import type { ConversationRow as ConversationRowType } from '../types';

function ConversationRowBase({ row, onPress }: { row: ConversationRowType; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarInitial}>{row.fullName.charAt(0)}</Text>
        <View style={[styles.statusDot, { backgroundColor: row.online ? colors.success : colors.border }]} />
      </View>

      <View style={styles.body}>
        <View style={styles.topLine}>
          <Text style={styles.fullName} numberOfLines={1}>
            {row.fullName} <Text style={styles.username}>{row.username}</Text>
          </Text>
        </View>
        <Text style={styles.preview} numberOfLines={1}>
          {row.preview}
        </Text>
      </View>

      <Text style={styles.timeAgo}>{row.timeAgo}</Text>
    </Pressable>
  );
}

export const ConversationRow = memo(ConversationRowBase);

const AVATAR_SIZE = 48;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
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
    ...typography.bodyBold,
    color: colors.surface,
  },
  statusDot: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.background,
  },
  body: {
    flex: 1,
    gap: spacing.xs / 2,
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  username: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '400',
  },
  preview: {
    ...typography.body,
    color: colors.textSecondary,
  },
  timeAgo: {
    ...typography.caption,
    color: colors.textSecondary,
    alignSelf: 'flex-start',
  },
});
