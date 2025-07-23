// src/components/MessageBubble.js
export default function MessageBubble({ message, isCurrentUser, participants }) {
  const participant = participants[message.sender];
  // In MessageBubble.js
{message.attachment && (
  <TouchableOpacity 
    onPress={() => navigation.navigate('ImagePreview', { uri: message.attachment.url })}
  >
    <Image 
      source={{ uri: message.attachment.url }}
      style={styles.attachment}
    />
  </TouchableOpacity>
)}
// Add to MessageBubble.js
const handleLongPress = () => {
  Alert.alert(
    'Message Actions',
    null,
    [
      { text: 'Add Reaction', onPress: () => showReactionPicker(message.uuid) },
      { text: 'Reply', onPress: () => startReply(message) },
      { text: 'Cancel', style: 'cancel' }
    ]
  );
};
  return (
    <View style={[styles.bubble, isCurrentUser ? styles.right : styles.left]}>
      {!isCurrentUser && (
        <View style={styles.header}>
          <Image source={{ uri: participant.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{participant.name}</Text>
          <Text style={styles.time}>{dayjs(message.sentAt).format('h:mm A')}</Text>
        </View>
      )}
      <Text style={styles.text}>{message.text}</Text>
      {message.edited && <Text style={styles.edited}>(edited)</Text>}
      {message.reactions?.length > 0 && <ReactionsBar reactions={message.reactions} />}
    </View>
  );
}