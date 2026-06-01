import { buttonStyles, commonStyles, spacing } from '@/assets/styles/theme';
import InfiniteList from '@/components/InfiniteList';
import { useContactCallLogs } from '@/hooks/useCallLogs';
import { useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { Alert, Linking, StyleSheet, View } from 'react-native';
import type { CallLog } from 'react-native-call-log';
import { Button, List, Text } from 'react-native-paper';

function formatDuration(duration: number) {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }

  return `${minutes}m ${seconds}s`;
}

export default function ContactCallLogsScreen() {
  const { phoneNumber, name } = useLocalSearchParams<{
    id: string;
    phoneNumber?: string;
    name?: string;
  }>();

  const contactName = Array.isArray(name) ? name[0] : name;
  const selectedPhoneNumber = Array.isArray(phoneNumber) ? phoneNumber[0] : phoneNumber;
  const {
    data,
    isLoading,
    error,
    permissionStatus,
    refetch,
    openPermissionSettings,
  } = useContactCallLogs(selectedPhoneNumber);
  const needsSettings = permissionStatus === 'never_ask_again';

  const handleCallNow = useCallback(async () => {
    if (!selectedPhoneNumber) {
      Alert.alert('Phone number missing', 'This contact does not have a phone number.');
      return;
    }

    try {
      await Linking.openURL(`tel:${selectedPhoneNumber.trim()}`);
    } catch {
      Alert.alert('Unable to call', 'This device cannot open the phone dialer.');
    }
  }, [selectedPhoneNumber]);

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
        onRetry={needsSettings ? openPermissionSettings : refetch}
        retryLabel={needsSettings ? 'Open Settings' : 'Retry'}
        emptyText="No outgoing calls found for this contact"
        ListHeaderComponent={
          <View style={styles.header}>
            <Text variant="titleMedium">{contactName ?? 'Call history'}</Text>
            {selectedPhoneNumber ? (
              <Text variant="bodyMedium" style={styles.phone}>
                {selectedPhoneNumber}
              </Text>
            ) : null}
            <Button
              mode="contained"
              icon="phone"
              style={buttonStyles.actionButton}
              contentStyle={buttonStyles.actionButtonContent}
              disabled={!selectedPhoneNumber}
              onPress={handleCallNow}
            >
              Call Now
            </Button>
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
    marginBottom: spacing.md,
  },
});
