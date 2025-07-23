import create from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/api';
import { groupMessagesWithDates } from '../utils/groupMessages';

export const useMessagesStore = create(
  persist(
    (set, get) => ({
      messages: [],
      lastUpdateTime: 0,
      hasMore: true,
      pendingMessages: [],

      // Initial data loading
      initialize: async () => {
        await Promise.all([
          get().fetchLatestMessages(),
          get().checkForUpdates()
        ]);
      },

      // Fetch latest messages
      fetchLatestMessages: async () => {
        try {
          const { data } = await api.get('/messages/latest');
          set({
            messages: data,
            lastUpdateTime: Date.now(),
            hasMore: data.length === 25
          });
        } catch (error) {
          console.error('Failed to fetch messages:', error);
        }
      },

      // Load older messages
      loadOlderMessages: async () => {
        if (!get().hasMore) return;

        const oldest = get().messages[get().messages.length - 1];
        try {
          const { data } = await api.get(`/messages/older/${oldest.uuid}`);
          set({
            messages: [...get().messages, ...data],
            hasMore: data.length === 25
          });
        } catch (error) {
          console.error('Failed to load older messages:', error);
        }
      },

      // Check for message updates
      checkForUpdates: async () => {
        try {
          const { data: updates } = await api.get(`/messages/updates/${get().lastUpdateTime}`);
          if (updates.length > 0) {
            set(state => ({
              messages: mergeUpdates(state.messages, updates),
              lastUpdateTime: Date.now()
            }));
          }
        } catch (error) {
          console.error('Failed to check for updates:', error);
        }
      },

      // Send new message
      sendMessage: async (text, replyTo = null) => {
        const newMsg = {
          uuid: `local-${Date.now()}`,
          text,
          sender: 'you',
          sentAt: new Date().toISOString(),
          replyToMessage: replyTo,
          pending: true
        };

        set(state => ({
          messages: [newMsg, ...state.messages],
          pendingMessages: [...state.pendingMessages, newMsg]
        }));

        try {
          const { data } = await api.post('/messages/new', { text, replyTo });
          set(state => ({
            messages: state.messages.map(msg =>
              msg.uuid === newMsg.uuid ? data : msg
            ),
            pendingMessages: state.pendingMessages.filter(
              msg => msg.uuid !== newMsg.uuid
            )
          }));
        } catch (error) {
          if (!error.isOffline) {
            set(state => ({
              messages: state.messages.filter(msg => msg.uuid !== newMsg.uuid)
            }));
          }
        }
      },

      // Add reaction
      addReaction: (messageId, emoji) => {
        set(state => ({
          messages: state.messages.map(msg =>
            msg.uuid === messageId
              ? {
                  ...msg,
                  reactions: [
                    ...(msg.reactions || []),
                    {
                      emoji,
                      participant: 'you',
                      timestamp: new Date().toISOString()
                    }
                  ]
                }
              : msg
          )
        }));
      },

      // Process offline queue
      processQueue: async () => {
        const successes = [];

        for (const msg of get().pendingMessages) {
          try {
            const { data } = await api.post('/messages/new', {
              text: msg.text,
              replyTo: msg.replyToMessage
            });

            successes.push(msg.uuid);
            set(state => ({
              messages: state.messages.map(m =>
                m.uuid === msg.uuid ? data : m
              )
            }));
          } catch (error) {
            console.error(`Failed to send message ${msg.uuid}:`, error);
          }
        }

        set(state => ({
          pendingMessages: state.pendingMessages.filter(
            msg => !successes.includes(msg.uuid)
          )
        }));
      }
    }),
    {
      name: 'messages-store',
      getStorage: () => AsyncStorage,
      partialize: (state) => ({
        messages: state.messages,
        lastUpdateTime: state.lastUpdateTime,
        pendingMessages: state.pendingMessages
      })
    }
  )
);

// Helper to merge updates
function mergeUpdates(existing, updates) {
  const updatedIds = new Set(updates.map(u => u.uuid));
  const filtered = existing.filter(msg => !updatedIds.has(msg.uuid));
  return [...updates, ...filtered];
}
