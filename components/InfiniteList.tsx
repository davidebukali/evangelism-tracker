import { colors, spacing } from '@/assets/styles/theme';
import React from 'react';
import {
  FlatList,
  FlatListProps,
  StyleSheet,
  View
} from 'react-native';
import { Text } from 'react-native-paper';

interface InfiniteListProps<T> extends Omit<FlatListProps<T>, 'renderItem' | 'data'> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactElement | null;
  onLoadMore: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyText?: string;
}

export default function InfiniteList<T extends { id: string | number }>({
  data,
  renderItem,
  onLoadMore,
  isLoading = false,
  hasMore = true,
  error = null,
  onRetry,
  emptyText,
  ...flatListProps
}: InfiniteListProps<T>) {
  const handleEndReached = () => {
    if (!isLoading && hasMore) {
      onLoadMore();
    }
  };

  const renderEmpty = () => {
    if (data.length === 0 && !isLoading) {
      return (
        <View style={styles.emptyContainer}>
          {error ? (
            <>
              <Text variant="bodyMedium" style={styles.errorText}>
                {error}
              </Text>
              {onRetry && (
                <Text
                  variant="labelLarge"
                  style={styles.retryButton}
                  onPress={onRetry}
                >
                  Retry
                </Text>
              )}
            </>
          ) : (
            <Text variant="bodyMedium">{emptyText}</Text>
          )}
        </View>
      );
    }
    return null;
  };

  return (
    <FlatList
      data={data}
      renderItem={({ item, index }) => renderItem(item, index)}
      keyExtractor={(item, index) => String(index)}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.3}
      ListEmptyComponent={renderEmpty}
      scrollEnabled
      {...flatListProps}
    />
  );
}

const styles = StyleSheet.create({
  endText: {
    color: colors.outline,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  errorText: {
    color: colors.error,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  retryButton: {
    color: colors.primary,
    marginTop: spacing.md,
    textDecorationLine: 'underline',
  },
});
