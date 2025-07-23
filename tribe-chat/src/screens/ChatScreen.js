import React, { useEffect } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet,
  ActivityIndicator 
} from 'react-native';
import { useMessagesStore, useParticipantsStore } from '../store';
import MessageGroup from '../components/MessageGroup';
import ChatInput from '../components/ChatInput';
import DateSeparator from '../components/DateSeparator';
import { groupMessagesWithDates } from '../utils/groupMessages';

export default function ChatScreen() {
  const messages = useMessagesStore(state => state.messages);
  const participants = useParticipantsStore(state => state.participants);
  const fetchLatest = useMessagesStore(state => state.fetchLatestMessages);
  const loadOlder = useMessagesStore(state => state.loadOlderMessages);
  const checkUpdates = useMessagesStore(state => state.checkForUpdates);
  const loading = useMessagesStore(state => state.loading);

  // Group messages with date separators
  const groupedMessages = groupMessagesWithDates(messages);

  // Initial load and periodic updates
  useEffect(() => {
    fetchLatest();
    
    const interval = setInterval(() => {
      checkUpdates();
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        inverted
        data={groupedMessages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          if (item.type === 'date') {
            return <DateSeparator date={item.date} />;
          }
          return (
            <MessageGroup
              group={item.messages}
              participant={participants[item.messages[0].sender]}
            />
          );
        }}
        onEndReached={loadOlder}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator style={styles.loader} /> : null
        }
        contentContainerStyle={styles.listContent}
        windowSize={7}
      />
      
      <ChatInput />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingBottom: 16,
  },
  loader: {
    marginVertical: 16,
  }
});