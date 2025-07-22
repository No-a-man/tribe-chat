import { useEffect } from 'react';
import { checkAndHandleSession } from './src/api/sessionManager';
import { useMessagesStore } from './src/store/useMessagesStore';
import { useParticipantsStore } from './src/store/useParticipantsStore';
import { View, Text } from 'react-native';

export default function App() {
  const fetchMessages = useMessagesStore((s) => s.fetchLatestMessages);
  const fetchParticipants = useParticipantsStore((s) => s.fetchParticipants);

  useEffect(() => {
    (async () => {
      await checkAndHandleSession();
      await fetchParticipants();
      await fetchMessages();
    })();
  }, []);

  return (
    <View>
      <Text>Tribe Chat App (Loading Chat...)</Text>
    </View>
  );
}
