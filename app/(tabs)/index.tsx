import { commonStyles } from '@/assets/styles/theme';
import AnimatedButton from '@/components/AnimatedButton';
import InfiniteList from '@/components/InfiniteList';
import useContactList from '@/hooks/useContactList';
import useContactSearch from '@/hooks/useContactSearch';
import { useDebounce } from '@/hooks/useDebounce';
import { PhoneContact } from '@/types/models';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Avatar, List, Searchbar } from 'react-native-paper';

export default function Index() {
  const { 
    data: listData, 
    isLoading: isListLoading, 
    hasMore, 
    error: listError, 
    loadMore, 
    retry 
  } = useContactList({
    initialLimit: 20,
  });

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const { 
    data: searchData, 
    isLoading: isSearchLoading, 
    error: searchError 
  } = useContactSearch(debouncedQuery);

  useFocusEffect(
    useCallback(() => {
      retry();
    }, [retry])
  );

  const isSearching = debouncedQuery.trim().length > 0;
  
  const displayData = isSearching ? searchData : listData;
  const displayLoading = isSearching ? isSearchLoading : isListLoading;
  const displayError = isSearching ? searchError : listError;
  const displayHasMore = isSearching ? false : hasMore;
  const displayLoadMore = isSearching ? () => {} : loadMore;
  const displayRetry = isSearching ? () => {} : retry;

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
        data={displayData}
        renderItem={renderContacts}
        onLoadMore={displayLoadMore}
        isLoading={displayLoading}
        hasMore={displayHasMore}
        error={displayError}
        onRetry={displayRetry}
        emptyText={isSearching ? 'No contacts match your search' : 'No contacts to display'}
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

