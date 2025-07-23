import React from 'react';
import { View, StyleSheet } from 'react-native';
import MessageBubble from './MessageBubble';

/**
 * @param {Object} props
 * @param {Array} props.group
 * @param {Object} props.participant
 */
export default function MessageGroup({ group, participant }) {
  return (
    <View style={styles.container}>
      {group.map((message, index) => (
        <MessageBubble
          key={message.uuid}
          message={message}
          isCurrentUser={message.sender === 'you'}
          participants={{ [participant.uuid]: participant }}
          showHeader={index === 0}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  }
});