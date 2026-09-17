import CalendarIcon from '@/assets/images/tabIcons/calendar-2.svg';
import DashboardIcon from '@/assets/images/tabIcons/dashboard.svg';
import MoreMenuIcon from '@/assets/images/tabIcons/more_menu.svg';
import WalletIcon from '@/assets/images/tabIcons/wallet-2.svg';
import { colors } from '@/shared/theme/colors';
import { spacing } from '@/shared/theme/spacing';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';

// Sourced from the icon SVGs themselves (their original fill color before it
// was swapped for currentColor so this box color could tint them white).
const ICON_BOX_COLOR = '#3F3F46';

const BOX_SIZE = 50;
const ICON_SIZE = 24;
const PLUS_SIZE = 24;

function TabIcon({ Icon }: { Icon: typeof DashboardIcon }) {
  return (
    <View style={styles.box}>
      <Icon width={ICON_SIZE} height={ICON_SIZE} color={colors.textPrimary} />
    </View>
  );
}

function ComposeTabIcon() {
  return (
    <View style={[styles.box, styles.centerBox]}>
      <View style={styles.plusHorizontal} />
      <View style={styles.plusVertical} />
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
        tabBarItemStyle: styles.tabBarItem,
      }}>
      <Tabs.Screen name="analytics" options={{ tabBarIcon: () => <TabIcon Icon={DashboardIcon} /> }} />
      <Tabs.Screen name="wallet" options={{ tabBarIcon: () => <TabIcon Icon={WalletIcon} /> }} />
      <Tabs.Screen name="index" options={{ tabBarIcon: () => <ComposeTabIcon /> }} />
      <Tabs.Screen name="explore" options={{ tabBarIcon: () => <TabIcon Icon={CalendarIcon} /> }} />
      <Tabs.Screen name="more" options={{ tabBarIcon: () => <TabIcon Icon={MoreMenuIcon} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 0,
    borderTopLeftRadius: spacing.xl,
    borderTopRightRadius: spacing.xl,
    height: 88,
    paddingTop: spacing.lg,
  },
  tabBarItem: {
    height: BOX_SIZE,
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBox: {
    backgroundColor: colors.primary,
  },
  plusHorizontal: {
    position: 'absolute',
    width: PLUS_SIZE,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.surface,
  },
  plusVertical: {
    position: 'absolute',
    width: 3,
    height: PLUS_SIZE,
    borderRadius: 2,
    backgroundColor: colors.surface,
  },
});
