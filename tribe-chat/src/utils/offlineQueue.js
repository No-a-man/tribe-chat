import { api } from '../api/api';
import { useMessagesStore } from '../store/useMessagesStore';

export const processOfflineQueue = async (pendingMessages) => {
  for (const message of pendingMessages) {
    try {
      const serverMessage = await api.post('/messages/new', {
        text: message.text
      });
      
      // Update store with server message
      useMessagesStore.getState().replaceMessage(
        message.uuid, 
        serverMessage
      );
    } catch (error) {
      console.error(`Failed to send message ${message.uuid}`, error);
    }
  }
};

// Network detection wrapper
export const withOfflineHandling = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error.message.includes('offline')) {
        error.isOffline = true;
      }
      throw error;
    }
  };
};