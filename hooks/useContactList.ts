import { getContactsModule } from '@/lib/contacts';
import { PhoneContact } from '@/types/models';
import { useCallback, useState } from 'react';

interface UseContactListOptions {
  initialLimit?: number;
}

interface UseContactListResponse {
  data: PhoneContact[];
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => Promise<void>;
  retry: () => Promise<void>;
}

const NATIVE_MODULE_MESSAGE =
  'Contacts native module is missing. Rebuild the app with: npx expo run:android';

export default function useContactList({
  initialLimit = 20,
}: UseContactListOptions): UseContactListResponse {
  const [data, setData] = useState<PhoneContact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(
    async (reset = false) => {
      if (isLoading || (!reset && !hasMore)) return;

      setIsLoading(true);
      setError(null);

      try {
        const Contacts = await getContactsModule();
        const fields = [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers] as const;

        const { status } = await Contacts.requestPermissionsAsync();
        if (status !== 'granted') {
          setError('Contacts permission is required');
          return;
        }

        const offset = reset ? 0 : data.length;
        const { data: newBatch } = await Contacts.getContactsAsync({
          fields: [...fields],
          pageSize: initialLimit,
          pageOffset: offset,
        });

        const newItems: PhoneContact[] = newBatch.map((contact) => ({
          id: contact.id ?? '',
          name: contact.name,
          phone: contact.phoneNumbers?.[0]?.number ?? '',
          photo: contact.image?.uri ?? null,
        }));

        setData((prev) => (reset ? newItems : [...prev, ...newItems]));
        setHasMore(newItems.length === initialLimit);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred';
        setError(
          message.includes('ExpoContacts') ? NATIVE_MODULE_MESSAGE : message
        );
      } finally {
        setIsLoading(false);
      }
    },
    [data.length, hasMore, initialLimit, isLoading]
  );

  const retry = useCallback(async () => {
    setHasMore(true);
    setError(null);
    await loadMore(true);
  }, [loadMore]);

  return {
    data,
    isLoading,
    hasMore,
    error,
    loadMore,
    retry,
  };
}
