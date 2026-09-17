import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

// Contact identity is hardcoded — the mock backend models one thread, not a
// per-contact profile, so there's nothing real to source this from yet.
const CONTACT = { fullName: 'Ethan Shoots', username: '@ethan_shoots', online: true };

export function ChatHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.back}>‹</Text>
        </Pressable>
        <Text style={styles.topTitle}>Chat with</Text>
        {/* TODO: wire up a real menu (report/block/mute) once that flow is scoped */}
        <Pressable hitSlop={12}>
          <Text style={styles.menu}>⋮</Text>
        </Pressable>
      </View>

      <View style={styles.identityRow}>
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>{CONTACT.fullName.charAt(0)}</Text>
            <View
              style={[styles.statusDot, { backgroundColor: CONTACT.online ? colors.success : colors.border }]}
            />
          </View>
          <View>
            <Text style={styles.name}>{CONTACT.fullName}</Text>
            <Text style={styles.username}>{CONTACT.username}</Text>
          </View>
        </View>

        <View style={styles.detailsButton}>
          <Text style={styles.detailsLabel}>★ Full Details</Text>
        </View>
      </View>
    </View>
  );
}

const AVATAR_SIZE = 36;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {
    fontSize: 26,
    color: colors.textPrimary,
    width: 20,
  },
  topTitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  menu: {
    fontSize: 20,
    color: colors.textPrimary,
    width: 20,
    textAlign: 'right',
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  name: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  username: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  detailsButton: {
    backgroundColor: colors.background,
    borderRadius: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  detailsLabel: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
});
