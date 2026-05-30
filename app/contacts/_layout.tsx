import { Stack } from "expo-router";

export default function ContactsLayout() {
  return (
    <Stack>
      <Stack.Screen name="CreateContact" options={{ title: 'Add Contact', headerShown: true }} />
      <Stack.Screen name="edit/[id]" options={{ title: 'Edit Contact', headerShown: true }} />
    </Stack>
  );
}
