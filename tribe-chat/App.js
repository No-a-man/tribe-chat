import { useEffect } from 'react';
import { checkAndHandleSession } from './src/api/sessionManager';
import { useMessagesStore } from './src/store/useMessagesStore';
import { useParticipantsStore } from './src/store/useParticipantsStore';
import RootNavigator from './RootNavigator'; // Assuming RootNavigator is in a file   named RootNavigator.js


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
    <RootNavigator />

  );
}
