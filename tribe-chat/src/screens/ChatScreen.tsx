import React, { useMemo } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { useMessageStore } from '../stores/messageStore';
import { useParticipantStore } from '../stores/participantStore';
import { groupMessages } from '../utils/groupMessages';

// Interfaces (can be moved to src/types/index.ts)
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
  editedAt?: number;
  attachment?: {
    imageUrl?: string;
  };
  reactions?: Reaction[];
    updatedAt: number;

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

  const currentUserId = 'you'; // Replace with dynamic session UUID if needed

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
<Text style={styles.time}>
  {isNaN(Number(firstMessage.sentAt))
    ? 'Invalid Date'
    : new Date(Number(firstMessage.sentAt)).toLocaleTimeString()}
</Text>

          </View>
        )}
{messageGroup.map((msg, msgIndex) => {
  const hasReactions = msg.reactions && msg.reactions.length > 0;

  return (
    <View
      key={msg.uuid}
      style={[
        styles.messageWrapper,
        hasReactions && styles.messageWithReactionsSpacing,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isOwnGroup ? styles.ownBubble : styles.otherBubble,
          msgIndex > 0 && (isOwnGroup ? styles.ownConsecutiveBubble : styles.otherConsecutiveBubble),
          msgIndex === 0 && (isOwnGroup ? styles.ownFirstBubble : styles.otherFirstBubble),
          msgIndex === messageGroup.length - 1 && (isOwnGroup ? styles.ownLastBubble : styles.otherLastBubble),
        ]}
      >
        <Text style={isOwnGroup ? styles.ownMessageText : styles.otherMessageText}>
          {msg.text} {msg.editedAt ? <Text style={styles.edited}>(edited)</Text> : null}
        </Text>

        {msg.attachment?.imageUrl && (
          <Image source={{ uri: msg.attachment.imageUrl }} style={styles.image} />
        )}
      </View>

      {hasReactions && (
        <View
          style={[
            styles.reactionRow,
            isOwnGroup ? styles.ownReactionRow : styles.otherReactionRow,
          ]}
        >
{msg.reactions?.map((reaction) => (
  <Text key={reaction.uuid} style={styles.reaction}>
    {reaction.value}
  </Text>
))}
        </View>
      )}
    </View>
  );
})}
      </View>
    );
  };

  return (
    <>
      {groupedMessages.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 32, color: '#888' }}>
          No messages yet
        </Text>
      ) : (
        <FlatList
          data={groupedMessages}
          renderItem={renderItem}
          keyExtractor={(item, index) => item[0].uuid || String(index)}
          contentContainerStyle={{ padding: 16 }}
          inverted
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  messageGroupContainer: {
    marginBottom: 12,
  },
  ownMessageGroup: {
    alignSelf: 'flex-end',
  },
  otherMessageGroup: {
    alignSelf: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  name: { fontWeight: 'bold', marginRight: 6 },
  time: { color: '#777', fontSize: 12 },
  bubble: {
    borderRadius: 8,
    padding: 10,
    maxWidth: '80%',
  },
  ownBubble: {
    backgroundColor: '#d1f7c4',
    alignSelf: 'flex-end',
    marginLeft: 'auto',
    marginRight: 0,
  },
  otherBubble: {
    backgroundColor: '#eee',
    alignSelf: 'flex-start',
    marginRight: 'auto',
    marginLeft: 0,
  },
  ownConsecutiveBubble: {
    marginTop: 4,
    borderTopRightRadius: 4,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  otherConsecutiveBubble: {
    marginTop: 4,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  ownFirstBubble: {
    borderBottomRightRadius: 4,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  otherFirstBubble: {
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  ownLastBubble: {
    borderTopRightRadius: 4,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  otherLastBubble: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  ownMessageText: {
    color: '#333',
  },
  otherMessageText: {
    color: '#333',
  },
  edited: { fontSize: 10, fontStyle: 'italic', color: '#555' },
  image: { width: 150, height: 100, marginTop: 6, borderRadius: 8 },



reactionText: {
  fontSize: 13,
  fontWeight: '500',
},



messageWrapper: {
  position: 'relative',
},

messageWithReactionsSpacing: {
  marginBottom: 20, // adjust to give space for reactions
},

reactionRow: {
  flexDirection: 'row',
  alignSelf: 'flex-end',
  backgroundColor: '#fff',
  paddingHorizontal: 6,
  paddingVertical: 2,
  marginTop: -8,         // ✅ This pulls the row closer to the bubble
  marginRight: 8,        // ✅ Align to right side of bubble
  borderRadius: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 1,
  elevation: 1,
},


ownReactionRow: {
  alignSelf: 'flex-end',
  marginRight: 12,
},

otherReactionRow: {
  alignSelf: 'flex-start',
  marginLeft: 12,
},

reaction: {
  fontSize: 16,
  marginHorizontal: 2,
},



});





