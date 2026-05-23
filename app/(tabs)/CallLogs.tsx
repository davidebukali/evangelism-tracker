import { StyleSheet, Text, View } from 'react-native';

export default function CallLogs() {
  return (
    <View style={styles.container}>
      <Text>Call Logs</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
