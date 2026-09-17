import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import { useChatStore } from '../store/chatStore';

const MAX_LENGTH = 400;

export function Composer() {
  const [text, setText] = useState('');
  const sendMessage = useChatStore((state) => state.sendMessage);

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setText('');
    sendMessage(trimmed);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Start typing..."
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          maxLength={MAX_LENGTH}
          multiline
        />
        <Pressable
          onPress={send}
          disabled={!text.trim()}
          style={[styles.sendButton, !text.trim() && styles.sendButtonDisabled]}>
          <Text style={styles.sendLabel}>➤</Text>
        </Pressable>
      </View>
      <Text style={styles.counter}>
        {text.length}/{MAX_LENGTH}
      </Text>
    </View>
  );
}

const SEND_BUTTON_SIZE = 40;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.background,
    borderRadius: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 120,
  },
  sendButton: {
    width: SEND_BUTTON_SIZE,
    height: SEND_BUTTON_SIZE,
    borderRadius: SEND_BUTTON_SIZE / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendLabel: {
    ...typography.bodyBold,
    color: colors.surface,
  },
  counter: {
    ...typography.caption,
    color: colors.textSecondary,
    alignSelf: 'flex-end',
    marginTop: spacing.xs / 2,
  },
});
