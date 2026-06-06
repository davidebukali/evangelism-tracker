import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Contacts',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="CallLogs"
        options={{
          title: 'Call Logs',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="phone" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'About',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="info-circle" color={color} />,
        }}
      />
    </Tabs>
  );
}
