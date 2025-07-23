import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * @param {Object} props
 * @param {Array} props.reactions
 */
export default function ReactionBar({ reactions }) {
  // Group reactions by emoji
  const reactionGroups = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = 1;
    } else {
      acc[reaction.emoji]++;
    }
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      {Object.entries(reactionGroups).map(([emoji, count]) => (
        <TouchableOpacity 
          key={emoji}
          style={styles.reaction}
          onPress={() => console.log('Reaction details', emoji)}
        >
          <Text style={styles.emoji}>{emoji}</Text>
          {count > 1 && <Text style={styles.count}>{count}</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  reaction: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 14,
  },
  count: {
    fontSize: 12,
    marginLeft: 2,
    color: '#666',
  }
});