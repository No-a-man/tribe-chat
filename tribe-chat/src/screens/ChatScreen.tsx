import React, { useMemo, useState } from 'react';
import {
  View, Text, FlatList, Image, StyleSheet,
  TextInput, TouchableOpacity, KeyboardAvoidingView,
  Platform, SafeAreaView,
} from 'react-native';
import { useMessageStore } from '../stores/messageStore';
import { useParticipantStore } from '../stores/participantStore';
import { groupMessages } from '../utils/groupMessages';

// -- Fallback image
function ImageWithFallback({ uri, style }: { uri: string, style: any }) {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <View style={[style, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#2b2b2b' }]}>
        <Text style={{ color: '#fff', fontSize: 12 }}>Unable to download image</Text>
      </View>
    );
  }
  return (
    <Image
      source={{ uri }}
      style={style}
      resizeMode="cover"
      onError={() => setError(true)}
    />
  );
}

// -- Types
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

  const currentUserId = 'you'; // change to real id/session logic

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
      <View style={[
        styles.messageGroupContainer,
        isOwnGroup ? styles.ownMessageGroup : styles.otherMessageGroup
      ]}>
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
            hour: '2-digit', minute: '2-digit'
          });
          const quotedMsg = msg.replyToMessageUuid ? messageMap[msg.replyToMessageUuid] : null;
          const hasImage = Array.isArray(msg.attachments) && msg.attachments.length > 0 && msg.attachments[0].type === 'image';

          // Add extra margin to prevent overlap with next message
          const bubbleStyle = [
            styles.bubble,
            isOwnGroup ? styles.ownBubble : styles.otherBubble,
            msgIndex > 0 && (isOwnGroup ? styles.ownConsecutiveBubble : styles.otherConsecutiveBubble),
            msgIndex === 0 && (isOwnGroup ? styles.ownFirstBubble : styles.otherFirstBubble),
            msgIndex === messageGroup.length - 1 && (isOwnGroup ? styles.ownLastBubble : styles.otherLastBubble),
            hasReactions && styles.bubbleWithReactions
          ];

          return (
            <View key={msg.uuid} style={bubbleStyle}>
              {/* Quoted/Reply */}
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

              {/* Image */}
              {hasImage && (
                <ImageWithFallback
                  uri={msg.attachments![0].url}
                  style={[
                    styles.image,
                    msg.attachments![0].width && msg.attachments![0].height
                      ? { width: Math.min(200, msg.attachments![0].width), height: Math.min(200, msg.attachments![0].height) }
                      : {}
                  ]}
                />
              )}

              {/* WhatsApp style reactions: ABSOLUTE, overflows bubble */}
              {hasReactions && (
                <View style={[
                  styles.reactionRowWhatsApp,
                  isOwnGroup ? styles.ownReactionRowWhatsApp : styles.otherReactionRowWhatsApp
                ]}>
                  {msg.reactions?.map((reaction) => (
                    <Text key={reaction.uuid} style={styles.reactionWhatsApp}>{reaction.value}</Text>
                  ))}
                  {/* Optionally add a count like WhatsApp */}
                  {msg.reactions && msg.reactions.length > 1 &&
                    <Text style={styles.reactionCount}>{msg.reactions.length}</Text>
                  }
                </View>
              )}

              <View style={styles.bottomRowContainer}>
                <Text style={styles.timestamp}>{time}</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.container}>
          {groupedMessages.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 32, color: '#bbb' }}>
              No messages yet
            </Text>
          ) : (
            <FlatList
              data={groupedMessages}
              renderItem={renderItem}
              keyExtractor={(item, index) => item[0].uuid || String(index)}
              contentContainerStyle={styles.listContainer}
              keyboardShouldPersistTaps="handled"
            />
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message"
              placeholderTextColor="#bbb"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              selectionColor="#ffde59"
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ----------- Styles -----------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111',
    paddingTop: 8, paddingBottom: 8,
  },
  flex: { flex: 1 },
  container: {
    flex: 1, marginTop: 8, marginBottom: 8,
  },
  listContainer: { padding: 16, paddingBottom: 80 },
  messageGroupContainer: { marginBottom: 12 },
  ownMessageGroup: { alignSelf: 'flex-end' },
  otherMessageGroup: { alignSelf: 'flex-start' },
  header: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 6,
  },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  name: { fontWeight: 'bold', marginRight: 6, color: '#fff' },
  bubble: {
    borderRadius: 8,
    padding: 10,
    maxWidth: '80%',
    position: 'relative',
    marginBottom: 16,
    backgroundColor: '#eee',
  },
  bubbleWithReactions: {
    marginBottom: 32, // Give space for floating reactions
  },
  ownBubble: {
    backgroundColor: '#ffde59', alignSelf: 'flex-end',
  },
  otherBubble: {
    backgroundColor: '#e7e7e9', alignSelf: 'flex-start',
  },
  ownConsecutiveBubble: { marginTop: 4, borderTopRightRadius: 4 },
  otherConsecutiveBubble: { marginTop: 4, borderTopLeftRadius: 4 },
  ownFirstBubble: { borderBottomRightRadius: 4 },
  otherFirstBubble: { borderBottomLeftRadius: 4 },
  ownLastBubble: { borderTopRightRadius: 4 },
  otherLastBubble: { borderTopLeftRadius: 4 },
  ownMessageText: { color: '#222' },
  otherMessageText: { color: '#111' },
  edited: { fontSize: 10, fontStyle: 'italic', color: '#777' },
  image: {
    width: 150, height: 100, marginTop: 6, borderRadius: 8, backgroundColor: '#111'
  },
  quotedBox: {
    borderLeftWidth: 3,
    borderLeftColor: '#25D366',
    backgroundColor: '#222',
    paddingVertical: 3, paddingHorizontal: 8,
    marginBottom: 6, borderRadius: 5,
  },
  quotedText: { fontSize: 12, color: '#cfcfcf', fontStyle: 'italic' },
  timestamp: {
    fontSize: 10, color: '#888', marginRight: 4,
  },
  bottomRowContainer: {
    flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 6,
  },

  // --- WhatsApp Reaction Row Styles ---
  reactionRowWhatsApp: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 20,
    minHeight: 32,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 18,
    // Slight shadow
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 2, elevation: 1,
    // WhatsApp style: overlap corner of bubble
    bottom: -18,
  },
  ownReactionRowWhatsApp: {
    left: 18, // right side overlap for your messages
    alignSelf: 'flex-end',
  },
  otherReactionRowWhatsApp: {
    left: 18, // left side overlap for others
    alignSelf: 'flex-start',
  },
  reactionWhatsApp: {
    fontSize: 20,
    marginHorizontal: 1,
    marginVertical: 0,
  },
  reactionCount: {
    fontSize: 16, color: '#777', marginLeft: 4, fontWeight: 'bold'
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#222',
    padding: 8,
    backgroundColor: '#202124',
    minHeight: 50,
    marginBottom: 0, // NO gap
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 8,
    backgroundColor: '#18191a',
    color: '#fff',
  },
  sendButton: {
    backgroundColor: '#ffde59',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#111',
    fontWeight: 'bold',
  },
});
