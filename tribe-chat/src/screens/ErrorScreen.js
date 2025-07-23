import { View, Text, Button, StyleSheet } from 'react-native';

export default function ErrorScreen({ error, onRetry }) {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>Error: {error}</Text>
      <Button title="Retry" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
});