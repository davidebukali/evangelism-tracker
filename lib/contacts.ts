import type * as ExpoContacts from 'expo-contacts';

let contactsModule: typeof ExpoContacts | null = null;

export async function getContactsModule(): Promise<typeof ExpoContacts> {
  if (!contactsModule) {
    contactsModule = await import('expo-contacts');
  }
  return contactsModule;
}
