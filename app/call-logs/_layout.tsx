import { Stack } from 'expo-router';

export default function CallLogsLayout() {
  return (
    <Stack screenOptions={{ presentation: 'fullScreenModal' }}>
      <Stack.Screen name="[id]" options={{ title: 'Call history' }} />
    </Stack>
  );
}
