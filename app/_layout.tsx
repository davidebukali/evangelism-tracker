import { initializeDatabase } from "@/lib/database";
import { Stack } from "expo-router";
import { SQLiteProvider } from 'expo-sqlite';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider>
      <SQLiteProvider databaseName="evangelism.db" onInit={initializeDatabase}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="contacts" options={{ headerShown: false }} />
          <Stack.Screen
            name="call-logs"
            options={{ headerShown: false, presentation: 'fullScreenModal' }}
          />
        </Stack>
      </SQLiteProvider>
    </PaperProvider>
  );
}
