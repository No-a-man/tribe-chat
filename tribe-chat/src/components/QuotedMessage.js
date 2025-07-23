import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * @param {Object} props
 * @param {Object} props.message
 * @param {Object} props.participants
 */
export default function QuotedMessage({ message, participants }) {
  const sender = participants[message.sender];
  
  return (
    <View style={styles.container}>
      <Text style={styles.senderText}>
        Replying to {sender?.name || 'Unknown'}
      </Text>
      <Text 
        style={styles.messageText}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {message.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  senderText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  messageText: {
    fontSize: 14,
    color: 'gray',
  }
});