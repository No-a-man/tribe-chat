import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/api';

interface Message {
  uuid: string;
  text: string;
  authorUuid: string;
  sentAt: number;
  editedAt?: number;
  attachment?: { imageUrl: string };
}

interface MessageState {
  list: Message[];
  lastFetchedAt: number;
  fetchLatest: () => Promise<void>;
  fetchOlder: (beforeUuid: string) => Promise<void>;
  fetchUpdates: () => Promise<void>;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  list: [],
  lastFetchedAt: Date.now(),

  fetchLatest: async () => {
    const res = await api.get('/messages/latest');
    set({ list: res.data, lastFetchedAt: Date.now() });
    await AsyncStorage.setItem('messages', JSON.stringify(res.data));
  },

  fetchOlder: async (beforeUuid: string) => {
    const res = await api.get(`/messages/older/${beforeUuid}`);
    set(state => ({ list: [...res.data, ...state.list] }));
  },

fetchUpdates: async () => {
  const res = await api.get<Message[]>(`/messages/updates/${get().lastFetchedAt}`);
  const updates = res.data;
  const merged = [...get().list];

  updates.forEach((updated: Message) => {
    const index = merged.findIndex(m => m.uuid === updated.uuid);
    if (index >= 0) merged[index] = updated;
    else merged.push(updated);
  });

  set({ list: merged, lastFetchedAt: Date.now() });
  await AsyncStorage.setItem('messages', JSON.stringify(merged));
}
,
}));
