import useDatabase from '@/hooks/useDatabase';
import { PhoneContact } from '@/types/models';
import { useEffect, useState } from 'react';

export default function useContactSearch(query: string) {
  const { searchContacts } = useDatabase();
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
        const searchResults = await searchContacts(query);

        if (isMounted) {
          const newItems: PhoneContact[] = searchResults.map((contact) => ({
            id: contact.device_contact_id ?? String(contact.id),
            name: `${contact.first_name} ${contact.last_name}`.trim(),
            phone: contact.phone,
            photo: null,
          }));
          setData(newItems);
        }
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'An error occurred';
          setError(message);
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
  }, [query, searchContacts]);

  return { data, isLoading, error };
}
