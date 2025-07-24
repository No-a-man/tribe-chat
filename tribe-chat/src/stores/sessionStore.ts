import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/api';

interface SessionState {
  sessionUuid: string | null;
  apiVersion: number | null;
  fetchInfo: () => Promise<void>;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessionUuid: null,
  apiVersion: null,

  fetchInfo: async () => {
    const res = await api.get('/info');
    const { sessionUuid, apiVersion } = res.data;
    const prevUuid = get().sessionUuid;
    if (prevUuid && prevUuid !== sessionUuid) {
      await AsyncStorage.multiRemove(['messages', 'participants']);
    }
    set({ sessionUuid, apiVersion });
  },
}));
