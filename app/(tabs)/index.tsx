import { commonStyles } from '@/assets/styles/theme';
import AnimatedButton from '@/components/AnimatedButton';
import InfiniteList from '@/components/InfiniteList';
import useContactList from '@/hooks/useContactList';
import { PhoneContact } from '@/types/models';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Avatar, List, Searchbar } from 'react-native-paper';

export default function Index() {
  const { data, isLoading, hasMore, error, loadMore, retry } = useContactList({
    initialLimit: 20,
  });
  const [query, setQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      retry();
    }, [retry])
  );

  const filteredData = useMemo(() => {
    if (!query.trim()) return data;
    const lower = query.toLowerCase();
    return data.filter((c) => c.name?.toLowerCase().includes(lower));
  }, [data, query]);

  const renderContacts = (item: PhoneContact) => (
    <List.Item
      title={item.name}
      description={item.phone}
      left={(props) => 
        item.photo ? (
          <Avatar.Image size={40} source={{ uri: item.photo as string }} />
        ) : (
          <List.Icon {...props} icon="account" />
        )
      }
      right={(props) => <List.Icon {...props} icon="chevron-right" />}
      onPress={() => router.push(`/contacts/edit/${item.id}`)}
    />
  );

  return (
    <View style={commonStyles.container}>
      <InfiniteList
        style={{ flex: 1 }}
        data={filteredData}
        renderItem={renderContacts}
        onLoadMore={loadMore}
        isLoading={isLoading}
        hasMore={hasMore}
        error={error}
        onRetry={retry}
        emptyText={query ? 'No contacts match your search' : 'No contacts to display'}
        ListHeaderComponent={
          <Searchbar
            placeholder="Search contacts..."
            onChangeText={setQuery}
            value={query}
          />
        }
      />
      <AnimatedButton label="Add contact" onPress={() => {
        router.navigate("/contacts/CreateContact")
      }} />
    </View>
  );
}

