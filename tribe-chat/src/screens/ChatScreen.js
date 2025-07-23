// src/screens/ChatScreen.js
useEffect(() => {
  const interval = setInterval(() => {
    useMessagesStore.getState().checkForUpdates();
  }, 15000); // Check every 15 seconds

  return () => clearInterval(interval);
}, []);