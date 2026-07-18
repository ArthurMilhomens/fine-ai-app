import { Tabs } from 'expo-router';
import { View } from 'react-native';

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Tabs.Screen name="index" options={{ title: 'Início' }} />
        <Tabs.Screen name="transactions" options={{ title: 'Extrato' }} />
        <Tabs.Screen name="connections" options={{ title: 'Bancos' }} />
        <Tabs.Screen name="more" options={{ title: 'Mais' }} />
      </Tabs>
    </View>
  );
}
