import { Tabs } from 'expo-router';
import { View } from 'react-native';

import { FloatingGlassTabBar } from '@/components/navigation/FloatingGlassTabBar';

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Tabs.Screen name="index" options={{ title: 'Início' }} />
        <Tabs.Screen name="transactions" options={{ title: 'Transações' }} />
        <Tabs.Screen name="connections" options={{ title: 'Conexões' }} />
        <Tabs.Screen name="more" options={{ title: 'Mais' }} />
      </Tabs>
      <FloatingGlassTabBar />
    </View>
  );
}
