import { View, Text, StyleSheet } from 'react-native';
import { formatDate } from '../utils/dateUtils';

export default function DateSeparator({ date }) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.dateText}>{formatDate(date)}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dateText: {
    marginHorizontal: 12,
    color: '#757575',
    fontSize: 14,
  }
});