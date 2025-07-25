import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { useMessageStore } from '../stores/messageStore';
import { useParticipantStore } from '../stores/participantStore';

export default function ChatScreen() {
  const messages = useMessageStore(s => s.list);
  const participants = useParticipantStore(s => s.list);

  const renderItem = ({ item, index }: any) => {
    const prev = messages[index - 1];
    const sameSender = prev?.participantUuid === item.participantUuid;
    const author = participants.find(p => p.uuid === item.participantUuid);
    console.log("Messages length:", messages.length);
    console.log("Participants:", participants);
    return (
      <View style={styles.messageBlock}>
        {!sameSender && (
          <View style={styles.header}>
            <Image source={{ uri: author?.avatarUrl }} style={styles.avatar} />
            <Text style={styles.name}>{author?.name}</Text>
            <Text style={styles.time}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
          </View>
        )}
        <View style={styles.bubble}>
          <Text>
            {item.text} {item.editedAt ? <Text style={styles.edited}>(edited)</Text> : null}
          </Text>
          {item.attachment?.imageUrl && (
            <Image source={{ uri: item.attachment.imageUrl }} style={styles.image} />
          )}
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={messages}
      renderItem={renderItem}
      keyExtractor={m => m.uuid}
      contentContainerStyle={{ padding: 16 }}
      inverted
    />
  );
}

const styles = StyleSheet.create({
  messageBlock: { marginBottom: 12 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  name: { fontWeight: 'bold', marginRight: 6 },
  time: { color: '#777', fontSize: 12 },
  bubble: {
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 10,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  edited: { fontSize: 10, fontStyle: 'italic' },
  image: { width: 150, height: 100, marginTop: 6, borderRadius: 8 },
});
