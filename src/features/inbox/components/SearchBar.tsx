import SortIcon from '@/assets/images/chatIcons/sort.svg';
import { colors } from '@/shared/theme/colors';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import { StyleSheet, TextInput, View } from 'react-native';

export function SearchBar() {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search for conversations"
        placeholderTextColor={colors.textSecondary}
        style={styles.input}
      />
      <View style={styles.sortBox}>
        <SortIcon width={16} height={16} color={colors.textPrimary} />
      </View>
    </View>
  );
}

const SORT_BOX_SIZE = 40;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1
  },
  sortBox: {
    width: SORT_BOX_SIZE,
    height: SORT_BOX_SIZE,
    borderRadius: spacing.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1
  },
});
