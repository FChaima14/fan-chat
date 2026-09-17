import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { typography } from '@/shared/theme/typography';

// TODO: out of scope for this phase — placeholder so the tab bar has
// somewhere to navigate to.
export function ComingSoonScreen({ label }: { label: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label} — coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
