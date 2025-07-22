import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';
import { api } from '../api/api';

export const useParticipantsStore = create(
  persist(
    (set) => ({
      participants: {},
      setParticipants: (list) =>
        set((state) => {
          const map = {};
          list.forEach((p) => {
            map[p.uuid] = p;
          });
          return { participants: map };
        }),
      fetchParticipants: async () => {
        const { data } = await api.get('/participants/all');
        set((state) => {
          const map = {};
          data.forEach((p) => {
            map[p.uuid] = p;
          });
          return { participants: map };
        });
      },
    }),
    {
      name: 'participants-storage',
      getStorage: () => AsyncStorage,
    }
  )
);
