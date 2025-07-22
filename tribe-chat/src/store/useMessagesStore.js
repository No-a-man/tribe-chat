import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';
import { api } from '../api/api';

export const useMessagesStore = create(
  persist(
    (set) => ({
      messages: [],
      setMessages: (msgs) => set({ messages: msgs }),
      fetchLatestMessages: async () => {
        const { data } = await api.get('/messages/latest');
        set({ messages: data });
      },
    }),
    {
      name: 'messages-storage',
      getStorage: () => AsyncStorage,
    }
  )
);
