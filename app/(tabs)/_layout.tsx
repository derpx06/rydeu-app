import { Redirect, Tabs } from 'expo-router';

import { CustomTabBar } from '@/components/navigation/custom-tab-bar';
import { useAppSelector } from '@/store';

export default function TabLayout() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <CustomTabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
