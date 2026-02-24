import React, { useState } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRingtones } from '@/hooks/useRingtones';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ringtone } from '@/types';

export default function RingtonesScreen() {
  const colorScheme = useColorScheme();
  const { ringtones, loading, addCustomRingtone, deleteRingtone, getSystemRingtones, getCustomRingtones } = useRingtones();
  const [activeTab, setActiveTab] = useState<'all' | 'system' | 'custom'>('all');

  const handleAddCustomRingtone = async () => {
    const newRingtone = await addCustomRingtone();
    if (newRingtone) {
      Alert.alert('Success', `Added ${newRingtone.name} to your ringtones`);
    }
  };

  const handleDeleteRingtone = (ringtone: Ringtone) => {
    Alert.alert(
      'Delete Ringtone',
      `Are you sure you want to delete "${ringtone.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteRingtone(ringtone);
            if (success) {
              Alert.alert('Deleted', 'Ringtone removed successfully');
            }
          },
        },
      ]
    );
  };

  const getFilteredRingtones = () => {
    switch (activeTab) {
      case 'system':
        return getSystemRingtones();
      case 'custom':
        return getCustomRingtones();
      default:
        return ringtones;
    }
  };

  const filteredRingtones = getFilteredRingtones();

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
        <ThemedText style={styles.loadingText}>Loading ringtones...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Ringtones Library
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          {ringtones.length} ringtone{ringtones.length !== 1 ? 's' : ''} available
        </ThemedText>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'all' && { backgroundColor: Colors[colorScheme ?? 'light'].tint },
          ]}
          onPress={() => setActiveTab('all')}>
          <ThemedText style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'system' && { backgroundColor: Colors[colorScheme ?? 'light'].tint },
          ]}
          onPress={() => setActiveTab('system')}>
          <ThemedText style={[styles.tabText, activeTab === 'system' && styles.activeTabText]}>
            System
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'custom' && { backgroundColor: Colors[colorScheme ?? 'light'].tint },
          ]}
          onPress={() => setActiveTab('custom')}>
          <ThemedText style={[styles.tabText, activeTab === 'custom' && styles.activeTabText]}>
            Custom
          </ThemedText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredRingtones}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.ringtoneItem, { borderBottomColor: colorScheme === 'dark' ? '#38383A' : '#E5E5EA' }]}>
            <View style={styles.ringtoneInfo}>
              <View style={[styles.ringtoneIcon, { backgroundColor: item.isCustom ? '#FF6B6B' : Colors[colorScheme ?? 'light'].tint }]}>
                <IconSymbol
                  name={item.isDefault ? 'bell.badge.fill' : 'music.note'}
                  size={20}
                  color="#FFFFFF"
                />
              </View>
              <View style={styles.ringtoneDetails}>
                <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                <ThemedText style={styles.ringtoneType}>
                  {item.isDefault ? 'Default' : item.isCustom ? 'Custom' : 'System'}
                </ThemedText>
              </View>
            </View>
            {item.isCustom && (
              <TouchableOpacity
                onPress={() => handleDeleteRingtone(item)}
                style={styles.deleteButton}>
                <IconSymbol name="trash" size={20} color="#FF6B6B" />
              </TouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={
          <ThemedView style={styles.emptyContainer}>
            <IconSymbol name="music.note" size={64} color={Colors[colorScheme ?? 'light'].icon} />
            <ThemedText style={styles.emptyText}>No ringtones found</ThemedText>
          </ThemedView>
        }
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
        onPress={handleAddCustomRingtone}>
        <IconSymbol name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.6,
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  ringtoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  ringtoneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  ringtoneIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringtoneDetails: {
    flex: 1,
    gap: 2,
  },
  ringtoneType: {
    fontSize: 12,
    opacity: 0.6,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    opacity: 0.6,
  },
  loadingText: {
    marginTop: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
