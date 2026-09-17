import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConversationRow } from '@/features/inbox/components/ConversationRow';
import { SearchBar } from '@/features/inbox/components/SearchBar';
import { MOCK_CONVERSATIONS } from '@/features/inbox/mockConversations';
import type { ConversationRow as ConversationRowType } from '@/features/inbox/types';
import { colors } from '@/shared/theme/colors';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

function keyExtractor(row: ConversationRowType) {
  return row.id;
}

export default function ChatsListScreen() {
  const insets = useSafeAreaInsets();

  function renderItem({ item }: ListRenderItemInfo<ConversationRowType>) {
    return <ConversationRow row={item} onPress={() => router.push('/chat')} />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Chats</Text>
      <SearchBar />
      <FlashList data={MOCK_CONVERSATIONS} renderItem={renderItem} keyExtractor={keyExtractor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
});
