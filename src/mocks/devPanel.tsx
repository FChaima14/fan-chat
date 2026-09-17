import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useChatStore } from '@/features/chat/store/chatStore';
import { colors } from '@/shared/theme/colors';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import { backend } from './backend';

// Dev-only failure injection for the chat feature — exercises the same
// offline/lost-response/incoming paths the outbox drain and reconnect logic
// are built to handle. Never rendered outside __DEV__ (see ChatDevPanel export).
function ChatDevPanelInner() {
  const [offline, setOffline] = useState(backend.offline);
  const reconnect = useChatStore((state) => state.reconnect);

  const toggleOffline = () => {
    backend.offline = !backend.offline;
    setOffline(backend.offline);
    if (!backend.offline) reconnect();
  };

  const dropNextResponse = () => {
    backend.dropNextResponse = true;
  };

  const injectIncoming = async (count: number) => {
    await backend.injectIncoming(count);
    await reconnect();
  };

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Dev panel</Text>
      <View style={styles.row}>
        <PanelButton label={offline ? 'Go online' : 'Go offline'} onPress={toggleOffline} active={offline} />
        <PanelButton label="Drop next response" onPress={dropNextResponse} />
        <PanelButton label="Inject 3 incoming" onPress={() => injectIncoming(3)} />
      </View>
    </View>
  );
}

function PanelButton({ label, onPress, active }: { label: string; onPress: () => void; active?: boolean }) {
  return (
    <Pressable onPress={onPress} style={[styles.button, active && styles.buttonActive]}>
      <Text style={[styles.buttonLabel, active && styles.buttonLabelActive]}>{label}</Text>
    </Pressable>
  );
}

export const ChatDevPanel = __DEV__ ? ChatDevPanelInner : () => null;

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.textPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  title: {
    ...typography.caption,
    color: colors.surface,
    opacity: 0.6,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  button: {
    backgroundColor: colors.surface,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  buttonActive: {
    backgroundColor: colors.warning,
  },
  buttonLabel: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  buttonLabelActive: {
    color: colors.textPrimary,
  },
});
