import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

function DateSeparatorBase({ label }: { label: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export const DateSeparator = memo(DateSeparatorBase);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
