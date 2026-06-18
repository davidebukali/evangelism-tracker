import { colors, commonStyles, inputStyles } from '@/assets/styles/theme';
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
  const [isExtended, setIsExtended] = useState(true);
  const debouncedQuery = useDebounce(query, 300);

  const { 
    data: searchData, 
    isLoading: isSearchLoading, 
    error: searchError 
  } = useContactSearch(debouncedQuery);

  useFocusEffect(
    useCallback(() => {
      retry();
      setIsExtended(true);
    }, [retry])
  );

  const isSearching = debouncedQuery.trim().length > 0;
  
  const displayData = isSearching ? searchData : listData;
  const displayLoading = isSearching ? isSearchLoading : isListLoading;
  const displayError = isSearching ? searchError : listError;
  const displayHasMore = isSearching ? false : hasMore;
  const displayLoadMore = isSearching ? () => {} : loadMore;
  const displayRetry = isSearching ? () => {} : retry;

  const renderContacts = (item: PhoneContact) => {    
    const firstInitial = item.name.trim().charAt(0);
    const lastInitial = item.name.trim().charAt(0);
    const initials = `${firstInitial}${lastInitial}`.trim();
    
    return (  
      <List.Item
        title={item.name}
        description={item.phone}
        left={(props) => 
          <Avatar.Text size={40} label={initials.toUpperCase()} />
        }
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
        onPress={() => router.push(`/contacts/view/${item.id}`)}
        titleStyle={{ color: colors.textPrimary }}
        descriptionStyle={{ color: colors.textSecondary }}
      />
    );
  }

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
            placeholder="Search contacts ..."
            onChangeText={setQuery}
            value={query}
            style={inputStyles.searchBar}
            inputStyle={{ color: colors.textPrimary }}
            placeholderTextColor={colors.textSecondary}
          />
        }
      />
      <AnimatedButton 
        label="Add contact"
        onPress={() => {
          setIsExtended((prev) => !prev);
          router.navigate("/contacts/CreateContact")
        }} 
        initialExtended={isExtended}
      />
    </View>
  );
}
