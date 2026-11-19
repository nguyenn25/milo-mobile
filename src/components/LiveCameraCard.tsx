import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  height?: number;
}

export const LiveCameraCard: React.FC<Props> = ({ height = 220 }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Live camera</Text>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <View style={[styles.feedPlaceholder, { height }]}>
        <Ionicons name="videocam-outline" size={32} color="#7A7A7A" />
        <Text style={styles.feedLabel}>Live camera feed</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E1E1E',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#7A7A7A',
  },
  liveText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7A7A7A',
    letterSpacing: 0.5,
  },
  feedPlaceholder: {
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  feedLabel: {
    fontSize: 13,
    color: '#7A7A7A',
  },
});
