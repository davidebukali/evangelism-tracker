import InfiniteList from '@/app/components/InfiniteList';
import useContactList from '@/app/hooks/useContactList';
import { spacing } from '@/assets/styles/theme';
import { Contact } from '@/types/models';
import { useEffect } from 'react';
import { Avatar, List } from 'react-native-paper';

export default function Index() {
  const { data, isLoading, hasMore, error, loadMore, retry } = useContactList({
    initialLimit: 20,
  });

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  const renderContacts = (item: Contact) => (
    <List.Item
      title={item.name}
      description={item.phone}
      left={(props) => 
        item.photo ? (
          <Avatar.Image
            size={40}
            source={{ uri: item.photo as string }}
          />
        ) : (
          <List.Icon {...props} icon="account" />
        )
      }
      right={(props) => <List.Icon {...props} icon="chevron-right" />}
      containerStyle={{ marginLeft: spacing.sm }}
    />
  );

  return (
    <InfiniteList
      data={data}
      renderItem={renderContacts}
      onLoadMore={loadMore}
      isLoading={isLoading}
      hasMore={hasMore}
      error={error}
      onRetry={retry}
      emptyText="No contacts to display"
    />
  );
}
