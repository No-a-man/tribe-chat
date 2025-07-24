import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from './src/screens/ChatScreen';
import { useSessionStore } from './src/stores/sessionStore';
import { useParticipantStore } from './src/stores/participantStore';
import { useMessageStore } from './src/stores/messageStore';

const Stack = createStackNavigator();

export default function App() {
  const fetchInfo = useSessionStore(s => s.fetchInfo);
  const fetchParticipants = useParticipantStore(s => s.fetchAll);
  const fetchMessages = useMessageStore(s => s.fetchLatest);

  useEffect(() => {
    (async () => {
      await fetchInfo();
      await fetchParticipants();
      await fetchMessages();
    })();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
