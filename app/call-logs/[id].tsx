import { commonStyles, spacing } from '@/assets/styles/theme';
import InfiniteList from '@/components/InfiniteList';
import { useContactCallLogs } from '@/hooks/useCallLogs';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import type { CallLog } from 'react-native-call-log';
import { List, Text } from 'react-native-paper';

function formatDuration(duration: number) {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }

  return `${minutes}m ${seconds}s`;
}

export default function ContactCallLogsScreen() {
  const navigation = useNavigation();
  const { phoneNumber, name } = useLocalSearchParams<{
    id: string;
    phoneNumber?: string;
    name?: string;
  }>();

  const contactName = Array.isArray(name) ? name[0] : name;
  const selectedPhoneNumber = Array.isArray(phoneNumber) ? phoneNumber[0] : phoneNumber;
  const { data, isLoading, error, refetch } = useContactCallLogs(selectedPhoneNumber);

  useEffect(() => {
    if (contactName) {
      navigation.setOptions({ title: contactName });
    }
  }, [contactName, navigation]);

  const renderCallLog = (item: CallLog) => (
    <List.Item
      title={item.dateTime}
      description={`Duration ${formatDuration(Number(item.duration) || 0)}`}
      left={(props) => <List.Icon {...props} icon="phone-outgoing" />}
    />
  );

  return (
    <View style={commonStyles.container}>
      <InfiniteList
        style={{ flex: 1 }}
        data={data}
        renderItem={renderCallLog}
        onLoadMore={() => {}}
        isLoading={isLoading}
        hasMore={false}
        error={error}
        onRetry={refetch}
        emptyText="No outgoing calls found for this contact"
        ListHeaderComponent={
          <View style={styles.header}>
            <Text variant="titleMedium">{contactName ?? 'Call history'}</Text>
            {selectedPhoneNumber ? (
              <Text variant="bodyMedium" style={styles.phone}>
                {selectedPhoneNumber}
              </Text>
            ) : null}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.sm,
  },
  phone: {
    marginTop: spacing.xs,
  },
});
