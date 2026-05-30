import { commonStyles, spacing } from '@/assets/styles/theme';
import InfiniteList from '@/components/InfiniteList';
import { ContactCallLogSummary, useCallLogContacts } from '@/hooks/useCallLogs';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Badge, List } from 'react-native-paper';

export default function CallLogs() {
  const { data, isLoading, error, refetch } = useCallLogContacts();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const renderCallLogContact = (item: ContactCallLogSummary) => (
    <List.Item
      title={item.name}
      description={item.mostRecentDateTime || item.phone}
      left={(props) => <List.Icon {...props} icon="phone-outgoing" />}
      right={() => (
        <View style={styles.trailing}>
          <Badge size={24}>{item.callCount}</Badge>
          <List.Icon icon="chevron-right" />
        </View>
      )}
      onPress={() =>
        router.push({
          pathname: '/call-logs/[id]',
          params: {
            id: String(item.id),
            phoneNumber: item.phone,
            name: item.name,
          },
        })
      }
    />
  );

  return (
    <View style={commonStyles.container}>
      <InfiniteList
        style={{ flex: 1 }}
        data={data}
        renderItem={renderCallLogContact}
        onLoadMore={() => {}}
        isLoading={isLoading}
        hasMore={false}
        error={error}
        onRetry={refetch}
        emptyText="No outgoing calls found for saved contacts"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.sm,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
