import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatHeader } from '@/features/chat/components/ChatHeader';
import { ConnectionBanner } from '@/features/chat/components/ConnectionBanner';
import { Composer } from '@/features/chat/components/Composer';
import { MessageList } from '@/features/chat/components/MessageList';
import { useOutboxDrain } from '@/features/chat/hooks/useOutboxDrain';
import { ChatDevPanel } from '@/mocks/devPanel';
import { colors } from '@/shared/theme/colors';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { isOffline } = useOutboxDrain();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ChatHeader />
      <ConnectionBanner isOffline={isOffline} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}>
        <MessageList />
        <ChatDevPanel />
        <Composer />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
});
