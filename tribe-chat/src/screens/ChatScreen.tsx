import React, { useMemo, useState } from 'react';
import {
  View, Text, FlatList, Image, StyleSheet,
  TextInput, TouchableOpacity, KeyboardAvoidingView, Platform
} from 'react-native';
import { useMessageStore } from '../stores/messageStore';
import { useParticipantStore } from '../stores/participantStore';
import { groupMessages } from '../utils/groupMessages';

interface Reaction {
  uuid: string;
  participantUuid: string;
  value: string;
}

interface Message {
  uuid: string;
  authorUuid: string;
  text: string;
  sentAt: number;
  updatedAt: number;
  replyToMessageUuid?: string;
  attachments?: {
    uuid: string;
    type: string;
    url: string;
    width?: number;
    height?: number;
  }[];
  reactions?: Reaction[];
}

interface Participant {
  uuid: string;
  name: string;
  avatarUrl: string;
  updatedAt: number;
}

export default function ChatScreen() {
  const messages = useMessageStore(s => s.list) as Message[];
  const participants = useParticipantStore(s => s.list) as Participant[];
  const [input, setInput] = useState('');

  // Map of all messages for fast lookup by uuid
  const messageMap = useMemo(() => {
    const map: { [uuid: string]: Message } = {};
    messages.forEach(m => { map[m.uuid] = m; });
    return map;
  }, [messages]);

  const participantsMap = useMemo(() => {
    return participants.reduce((acc, p) => {
      acc[p.uuid] = p;
      return acc;
    }, {} as { [uuid: string]: Participant });
  }, [participants]);

  const groupedMessages = useMemo(() => {
    const sortedMessages = [...messages].sort((a, b) => a.sentAt - b.sentAt);
    return groupMessages(sortedMessages);
  }, [messages]);

  const currentUserId = 'you';

  // Message send handler
  const sendMessage = () => {
    if (input.trim() === '') return;
    useMessageStore.getState().addMessage({
      uuid: Math.random().toString(),
      authorUuid: currentUserId,
      text: input.trim(),
      sentAt: Date.now(),
      updatedAt: Date.now(),
      reactions: [],
    });
    setInput('');
  };

  const renderItem = ({ item: messageGroup }: { item: Message[] }) => {
    const firstMessage = messageGroup[0];
    const author = participantsMap[firstMessage.authorUuid];
    const isOwnGroup = firstMessage.authorUuid === currentUserId;

    return (
      <View style={[styles.messageGroupContainer, isOwnGroup ? styles.ownMessageGroup : styles.otherMessageGroup]}>
        {!isOwnGroup && (
          <View style={styles.header}>
            <Image source={{ uri: author?.avatarUrl }} style={styles.avatar} />
            <Text style={styles.name}>{author?.name ?? 'Unknown'}</Text>
          </View>
        )}

        {messageGroup.map((msg, msgIndex) => {
          const hasReactions = msg.reactions && msg.reactions.length > 0;
          const isEdited = msg.updatedAt && msg.updatedAt !== msg.sentAt;
          const time = new Date(Number(msg.sentAt)).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });

          // Find quoted/original message if replyToMessageUuid is set
          const quotedMsg = msg.replyToMessageUuid ? messageMap[msg.replyToMessageUuid] : null;

          return (
            <View
              key={msg.uuid}
              style={[
                styles.bubble,
                isOwnGroup ? styles.ownBubble : styles.otherBubble,
                msgIndex > 0 && (isOwnGroup ? styles.ownConsecutiveBubble : styles.otherConsecutiveBubble),
                msgIndex === 0 && (isOwnGroup ? styles.ownFirstBubble : styles.otherFirstBubble),
                msgIndex === messageGroup.length - 1 && (isOwnGroup ? styles.ownLastBubble : styles.otherLastBubble),
              ]}
            >
              {/* Quoted/Reply Box */}
              {quotedMsg && (
                <View style={styles.quotedBox}>
                  <Text style={styles.quotedText} numberOfLines={2}>
                    {quotedMsg.text || '[Message not found]'}
                  </Text>
                </View>
              )}

              <Text style={isOwnGroup ? styles.ownMessageText : styles.otherMessageText}>
                {msg.text}
                {isEdited ? <Text style={styles.edited}> (edited)</Text> : null}
              </Text>

{/* Show image if this message has an image attachment */}
{Array.isArray(msg.attachments) && msg.attachments.length > 0 && msg.attachments[0].type === 'image' && (
  <Image
    source={{ uri: msg.attachments[0].url }}
    style={[
      styles.image,
      // Optionally, you can scale based on attachment width/height
      msg.attachments[0].width && msg.attachments[0].height
        ? { width: Math.min(200, msg.attachments[0].width), height: Math.min(200, msg.attachments[0].height) }
        : {}
    ]}
    resizeMode="cover"
  />
)}


              <View style={styles.bottomRowContainer}>
                <Text style={styles.timestamp}>{time}</Text>
                {hasReactions && (
                  <View style={styles.reactionBubble}>
                    <View style={styles.reactionRow}>
                      {msg.reactions?.map((reaction) => (
                        <Text key={reaction.uuid} style={styles.reaction}>{reaction.value}</Text>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {groupedMessages.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 32, color: '#888' }}>
          No messages yet
        </Text>
      ) : (
        <FlatList
          data={groupedMessages}
          renderItem={renderItem}
          keyExtractor={(item, index) => item[0].uuid || String(index)}
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          inverted
        />
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  messageGroupContainer: { marginBottom: 12 },
  ownMessageGroup: { alignSelf: 'flex-end' },
  otherMessageGroup: { alignSelf: 'flex-start' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  name: { fontWeight: 'bold', marginRight: 6 },
  bubble: {
    borderRadius: 8,
    padding: 10,
    maxWidth: '80%',
    position: 'relative',
    marginBottom: 16,
  },
  ownBubble: {
    backgroundColor: '#d1f7c4',
    alignSelf: 'flex-end',
  },
  otherBubble: {
    backgroundColor: '#eee',
    alignSelf: 'flex-start',
  },
  ownConsecutiveBubble: { marginTop: 4, borderTopRightRadius: 4 },
  otherConsecutiveBubble: { marginTop: 4, borderTopLeftRadius: 4 },
  ownFirstBubble: { borderBottomRightRadius: 4 },
  otherFirstBubble: { borderBottomLeftRadius: 4 },
  ownLastBubble: { borderTopRightRadius: 4 },
  otherLastBubble: { borderTopLeftRadius: 4 },
  ownMessageText: { color: '#333' },
  otherMessageText: { color: '#333' },
  edited: { fontSize: 10, fontStyle: 'italic', color: '#555' },
  image: { width: 150, height: 100, marginTop: 6, borderRadius: 8 },
  quotedBox: {
    borderLeftWidth: 3,
    borderLeftColor: '#1e90ff',
    backgroundColor: '#f2f2f2',
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginBottom: 6,
    borderRadius: 5,
  },
  quotedText: {
    fontSize: 12,
    color: '#555',
    fontStyle: 'italic',
  },
  timestamp: {
    fontSize: 10,
    color: '#888',
    marginRight: 4,
  },
  bottomRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 6,
  },
  reactionBubble: {
    marginLeft: 6,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reactionRow: {
    flexDirection: 'row',
  },
  reaction: {
    fontSize: 16,
    marginHorizontal: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    backgroundColor: '#1e90ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
