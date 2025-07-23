import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

/**
 * Screen showing participant details
 */
export default function ParticipantScreen() {
  const route = useRoute();
  const { participant } = route.params;

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: participant.avatar || 'https://i.imgur.com/abc123.jpg' }} 
        style={styles.avatar}
      />
      <Text style={styles.name}>{participant.name}</Text>
      
      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Status</Text>
        <Text style={styles.detailValue}>
          {participant.lastSeen ? 'Last seen ' + formatLastSeen(participant.lastSeen) : 'Online'}
        </Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Member Since</Text>
        <Text style={styles.detailValue}>
          {new Date(participant.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
}

function formatLastSeen(timestamp) {
  const now = new Date();
  const lastSeen = new Date(timestamp);
  const diffMinutes = Math.floor((now - lastSeen) / (1000 * 60));

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
  return `${Math.floor(diffMinutes / 1440)} days ago`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  detailContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  }
});