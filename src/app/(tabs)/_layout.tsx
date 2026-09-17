import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { spacing } from '@/shared/theme/spacing';

// TODO: swap these glyph placeholders for the real icon set once Figma
// exports the tab assets — only "Chats" (index) is a real, built screen.
const TAB_ICONS: Record<string, string> = {
  analytics: '📈',
  wallet: '💳',
  index: '💬',
  explore: '📅',
  more: '▦',
};

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapFocused]}>
      <Text style={styles.iconGlyph}>{TAB_ICONS[name] ?? '•'}</Text>
    </View>
  );
}

export default function AppTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}>
      <Tabs.Screen
        name="analytics"
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="analytics" focused={focused} /> }}
      />
      <Tabs.Screen
        name="wallet"
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="wallet" focused={focused} /> }}
      />
      <Tabs.Screen
        name="index"
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="index" focused={focused} /> }}
      />
      <Tabs.Screen
        name="explore"
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="explore" focused={focused} /> }}
      />
      <Tabs.Screen
        name="more"
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="more" focused={focused} /> }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    height: 64,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapFocused: {
    backgroundColor: colors.background,
  },
  iconGlyph: {
    fontSize: 18,
  },
});
