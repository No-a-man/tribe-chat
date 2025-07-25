// app/_layout.tsx
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useSessionStore } from '../src/stores/sessionStore';
import { useParticipantStore } from '../src/stores/participantStore';
import { useMessageStore } from '../src/stores/messageStore';

export default function Layout() {
  const fetchInfo = useSessionStore(s => s.fetchInfo);
  const fetchParticipants = useParticipantStore(s => s.fetchAll);
  const fetchMessages = useMessageStore(s => s.fetchLatest);

  useEffect(() => {
    const init = async () => {
      console.log('⚙️ Running layout init...');
      await fetchInfo();
      await fetchParticipants();
      await fetchMessages();
    };
    init();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
