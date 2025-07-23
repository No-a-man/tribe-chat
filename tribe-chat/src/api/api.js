import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const API_BASE = 'https://dummy-chat-server.tribechat.com/api';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Request interceptor for offline handling
api.interceptors.request.use(async (config) => {
  const isOnline = (await NetInfo.fetch()).isConnected;
  
  if (!isOnline) {
    const error = new Error('Network request failed: Offline');
    error.isOffline = true;
    throw error;
  }

  const sessionUuid = await AsyncStorage.getItem('session-uuid');
  if (sessionUuid) {
    config.headers['X-Session-ID'] = sessionUuid;
  }

  return config;
});

// Response interceptor for session handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.clear();
    }
    return Promise.reject(error);
  }
);