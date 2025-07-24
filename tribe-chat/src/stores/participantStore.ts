import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/api';

interface Participant {
  uuid: string;
  name: string;
  avatarUrl: string;
  updatedAt: number;
}

interface ParticipantState {
  list: Participant[];
  lastUpdatedAt: number;
  fetchAll: () => Promise<void>;
  fetchUpdates: () => Promise<void>;
}

export const useParticipantStore = create<ParticipantState>((set, get) => ({
  list: [],
  lastUpdatedAt: Date.now(),

  fetchAll: async () => {
    const res = await api.get<Participant[]>('/participants/all');
    set({ list: res.data, lastUpdatedAt: Date.now() });
    await AsyncStorage.setItem('participants', JSON.stringify(res.data));
  },

  fetchUpdates: async () => {
    const res = await api.get<Participant[]>(`/participants/updates/${get().lastUpdatedAt}`);
    const updates = res.data;
    const merged = [
      ...get().list.filter(p => !updates.find((u: Participant) => u.uuid === p.uuid)),
      ...updates,
    ];
    set({ list: merged, lastUpdatedAt: Date.now() });
    await AsyncStorage.setItem('participants', JSON.stringify(merged));
  },
}));
