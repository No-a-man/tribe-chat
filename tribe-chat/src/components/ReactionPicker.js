import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

/**
 * @param {Object} props
 * @param {Function} props.onSelect
 */
export default function ReactionPicker({ onSelect }) {
  const reactions = ['👍', '❤️', '😄', '😮', '😂', '😢'];

  return (
    <View style={styles.container}>
      {reactions.map(emoji => (
        <TouchableOpacity
          key={emoji}
          style={styles.reactionOption}
          onPress={() => onSelect(emoji)}
        >
          <Text style={styles.emoji}>{emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  reactionOption: {
    padding: 8,
  },
  emoji: {
    fontSize: 20,
  }
});