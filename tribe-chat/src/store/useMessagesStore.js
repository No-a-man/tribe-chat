import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';
import { api } from '../api/api';

// src/store/useMessagesStore.js
export const useMessagesStore = create(persist(
  (set, get) => ({
    messages: [],
    lastUpdateTime: 0,
    
    // Add this new method
    checkForUpdates: async () => {
      const { lastUpdateTime } = get();
      const { data } = await api.get(`/messages/updates/${lastUpdateTime}`);
      
      if (data.length > 0) {
        set({
          messages: [...data, ...get().messages],
          lastUpdateTime: Date.now()
        });
      }
    },
    
    // Modify existing
    fetchLatestMessages: async () => {
      const { data } = await api.get('/messages/latest');
      set({ messages: data, lastUpdateTime: Date.now() });
    }
  }),
  { name: 'messages-store' }
));
