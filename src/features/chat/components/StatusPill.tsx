import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import type { MessageStatus } from '../types';

const LABELS: Record<MessageStatus, string> = {
  pending: 'Waiting…',
  sending: 'Sending…',
  failed: 'Failed',
};

function StatusPillBase({ status, errorMessage }: { status: MessageStatus; errorMessage?: string }) {
  const tone = status === 'failed' ? colors.danger : colors.textSecondary;
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: tone }]}>{LABELS[status]}</Text>
      {errorMessage ? <Text style={[styles.label, { color: tone }]}>· {errorMessage}</Text> : null}
    </View>
  );
}

export const StatusPill = memo(StatusPillBase);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs / 2,
  },
  label: {
    ...typography.caption,
  },
});
