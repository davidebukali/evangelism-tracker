import { Contact } from '@/types/models';
import { useCallback, useState } from 'react';

interface UseContactListOptions {
  initialLimit?: number;
}

interface UseContactListResponse {
  data: Contact[];
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => Promise<void>;
  retry: () => Promise<void>;
}

export default function useContactList({
  initialLimit = 20,
}: UseContactListOptions): UseContactListResponse {
  const [data, setData] = useState<Contact[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const newItems: Contact[] = [
        { id: 1, name: 'John Doe', phone: '0712345678', photo: 'https://picsum.photos/200' },
        { id: 2, name: 'Jane Doe', phone: '1234567890', photo: null },
        { id: 3, name: 'John Smith', phone: '1234567890', photo: null },
        { id: 4, name: 'Jane Smith', phone: '1234567890', photo: null },
        { id: 5, name: 'John Doe', phone: '1234567890', photo: null },
        { id: 6, name: 'Jane Doe', phone: '1234567890', photo: null },
      ];
      setData((prev) => [...prev, ...newItems]);
      setHasMore(newItems.length === initialLimit);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, initialLimit]);

  const retry = useCallback(async () => {
    setPage(1);
    setData([]);
    setHasMore(true);
    setError(null);
    setIsLoading(true);

    try {
      const newItems = [
        { id: 1, name: 'John Doe', phone: '1234567890', photo: 'https://picsum.photos/200' }, 
        { id: 2, name: 'Jane Doe', phone: '1234567890', photo: null },
        { id: 3, name: 'John Smith', phone: '1234567890', photo: null },
        { id: 4, name: 'Jane Smith', phone: '1234567890', photo: null },
        { id: 5, name: 'John Doe', phone: '1234567890', photo: null },
        { id: 6, name: 'Jane Doe', phone: '1234567890', photo: null },
      ];
      setData(newItems);
      setHasMore(newItems.length === initialLimit);
      setPage(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [initialLimit]);

  return {
    data,
    isLoading,
    hasMore,
    error,
    loadMore,
    retry
  };
}
