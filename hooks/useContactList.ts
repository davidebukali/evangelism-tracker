import useDatabase, { DatabaseContact } from '@/hooks/useDatabase';
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

export default function useContactList({
  initialLimit = 20,
}: UseContactListOptions): UseContactListResponse {
  const { getContacts } = useDatabase();
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
        const offset = reset ? 0 : data.length;
        
        // Fetch paginated contacts from the local SQLite database
        const rows = await getContacts(initialLimit, offset);

        const newItems: PhoneContact[] = rows.map((contact: DatabaseContact) => ({
          id: contact.device_contact_id ?? String(contact.id),
          name: `${contact.first_name} ${contact.last_name}`.trim(),
          phone: contact.phone,
          photo: null, // SQLite doesn't currently store photo URIs
        }));

        setData((prev) => (reset ? newItems : [...prev, ...newItems]));
        setHasMore(newItems.length === initialLimit);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred fetching from DB';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [data.length, hasMore, initialLimit, isLoading, getContacts]
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
