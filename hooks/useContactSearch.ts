import { getContactsModule } from '@/lib/contacts';
import { PhoneContact } from '@/types/models';
import { useEffect, useState } from 'react';

const NATIVE_MODULE_MESSAGE =
  'Contacts native module is missing. Rebuild the app with: npx expo run:android';

export default function useContactSearch(query: string) {
  const [data, setData] = useState<PhoneContact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setData([]);
      setError(null);
      return;
    }

    let isMounted = true;

    const performSearch = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const Contacts = await getContactsModule();
        const fields = [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers] as const;

        const { status } = await Contacts.requestPermissionsAsync();
        if (status !== 'granted') {
          if (isMounted) setError('Contacts permission is required');
          return;
        }

        const { data: searchResults } = await Contacts.getContactsAsync({
          fields: [...fields],
          name: query.trim(), 
        });

        if (isMounted) {
          const newItems: PhoneContact[] = searchResults.map((contact) => ({
            id: contact.id ?? '',
            name: contact.name,
            phone: contact.phoneNumbers?.[0]?.number ?? '',
            photo: contact.image?.uri ?? null,
          }));
          setData(newItems);
        }
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'An error occurred';
          setError(
            message.includes('ExpoContacts') ? NATIVE_MODULE_MESSAGE : message
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    performSearch();

    return () => {
      isMounted = false;
    };
  }, [query]);

  return { data, isLoading, error };
}
