// src/api/sessionManager.js
import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkAndHandleSession = async () => {
  const { data } = await api.get('/info');
  const storedSession = await AsyncStorage.getItem('session-uuid');
  if (storedSession !== data.sessionUuid) {
    await AsyncStorage.clear();
    await AsyncStorage.setItem('session-uuid', data.sessionUuid);
  }
};

