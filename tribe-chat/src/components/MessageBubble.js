import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity,
  StyleSheet,
  Alert 
} from 'react-native';
import QuotedMessage from './QuotedMessage';
import ReactionBar from './ReactionBar';

export default function MessageBubble({ 
  message, 
  isCurrentUser, 
  participants 
}) {
  const showActionMenu = () => {
    Alert.alert(
      'Message Actions',
      null,
      [
        {
          text: 'Add Reaction',
          onPress: () => {/* Open reaction picker */}
        },
        {
          text: 'Reply',
          onPress: () => {/* Set reply mode */} 
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isCurrentUser ? styles.currentUser : styles.otherUser
      ]}
      onLongPress={showActionMenu}
    >
      {/* Quoted message */}
      {message.replyToMessage && (
        <QuotedMessage 
          message={message.replyToMessage}
          participants={participants}
        />
      )}

      {/* Message text */}
      <Text style={styles.text}>{message.text}</Text>

      {/* Edited indicator */}
      {message.edited && (
        <Text style={styles.edited}>(edited)</Text>
      )}

      {/* Image attachment */}
      {message.attachment && (
        <Image
          source={{ uri: message.attachment.url }}
          style={styles.attachment}
        />
      )}

      {/* Reactions */}
      {message.reactions?.length > 0 && (
        <ReactionBar reactions={message.reactions} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginVertical: 4,
  },
  currentUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderBottomRightRadius: 0,
  },
  otherUser: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderBottomLeftRadius: 0,
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
  edited: {
    fontSize: 12,
    color: 'gray',
    fontStyle: 'italic',
    marginTop: 4,
  },
  attachment: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginTop: 8,
  }
});