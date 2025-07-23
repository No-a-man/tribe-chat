import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';

/**
 * @param {Object} props
 * @param {string} props.query
 * @param {Function} props.onSelect
 */
export default function MentionList({ query, onSelect }) {
  const participants = useParticipantsStore(state => state.participants);
  
  const filteredParticipants = Object.values(participants).filter(
    p => p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredParticipants}
        keyExtractor={item => item.uuid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => onSelect(item)}
          >
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyboardShouldPersistTaps="always"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    maxHeight: 200,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 100,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  name: {
    fontSize: 16,
  }
});