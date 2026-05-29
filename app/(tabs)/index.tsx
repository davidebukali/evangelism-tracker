import { commonStyles } from '@/assets/styles/theme';
import AnimatedButton from '@/components/AnimatedButton';
import InfiniteList from '@/components/InfiniteList';
import useContactList from '@/hooks/useContactList';
import { PhoneContact } from '@/types/models';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';
import { Avatar, List } from 'react-native-paper';

export default function Index() {
  const { data, isLoading, hasMore, error, loadMore, retry } = useContactList({
    initialLimit: 20,
  });

  useFocusEffect(
    useCallback(() => {
      // Trigger a refresh whenever the screen comes into focus
      retry();
    }, [retry])
  );

  const renderContacts = (item: PhoneContact) => (
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
    />

  );

  return (
    <View style={commonStyles.container}>
      <InfiniteList
        style={{ flex: 1 }}
        data={data}
        renderItem={renderContacts}
        onLoadMore={loadMore}
        isLoading={isLoading}
        hasMore={hasMore}
        error={error}
        onRetry={retry}
        emptyText="No contacts to display"
      />
      <AnimatedButton label="Add contact" onPress={() => {
        router.navigate("/contacts/CreateContact")
      }} />
    </View>
  );
}
