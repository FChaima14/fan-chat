import { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

function ConnectionBannerBase({ isOffline }: { isOffline: boolean }) {
  if (!isOffline) return null;
  return <Text style={styles.banner}>You&rsquo;re offline — messages will send once you&rsquo;re back online</Text>;
}

export const ConnectionBanner = memo(ConnectionBannerBase);

const styles = StyleSheet.create({
  banner: {
    ...typography.caption,
    color: colors.textPrimary,
    backgroundColor: colors.warning,
    textAlign: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
});
