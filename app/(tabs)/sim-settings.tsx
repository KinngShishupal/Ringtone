import React, { useState, useEffect } from 'react';
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
import { useSIMCards } from '@/hooks/useSIMCards';
import { useRingtones } from '@/hooks/useRingtones';
import { StorageService } from '@/utils/storage';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';

export default function SIMSettingsScreen() {
  const colorScheme = useColorScheme();
  const { simCards, loading } = useSIMCards();
  const { ringtones, getRingtoneById } = useRingtones();
  const [simRingtoneMap, setSimRingtoneMap] = useState<Record<string, string>>({});

  useEffect(() => {
    loadSIMRingtoneMappings();
  }, [simCards]);

  const loadSIMRingtoneMappings = async () => {
    const settings = await StorageService.getSettings();
    const map: Record<string, string> = {};
    settings.simMappings.forEach((mapping) => {
      map[mapping.simId] = mapping.ringtoneId;
    });
    setSimRingtoneMap(map);
  };

  const handleSIMPress = (simId: string) => {
    router.push({
      pathname: '/ringtone-picker',
      params: { simId, type: 'sim' },
    });
  };

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
        <ThemedText style={styles.loadingText}>Loading SIM cards...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          SIM Card Settings
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Set custom ringtones for each SIM card
        </ThemedText>
      </View>

      <FlatList
        data={simCards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const ringtoneId = simRingtoneMap[item.id];
          const ringtone = ringtoneId ? getRingtoneById(ringtoneId) : null;

          return (
            <TouchableOpacity
              style={[styles.simCard, { backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF' }]}
              onPress={() => handleSIMPress(item.id)}>
              <View style={styles.simHeader}>
                <View style={[styles.simIcon, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
                  <IconSymbol name="simcard.fill" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.simInfo}>
                  <ThemedText type="defaultSemiBold">{item.displayName}</ThemedText>
                  {item.carrierName && (
                    <ThemedText style={styles.carrierText}>{item.carrierName}</ThemedText>
                  )}
                </View>
              </View>

              <View style={styles.ringtoneSection}>
                <View style={styles.ringtoneInfo}>
                  <IconSymbol
                    name="bell.fill"
                    size={16}
                    color={ringtone ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].icon}
                  />
                  <ThemedText style={styles.ringtoneLabel}>
                    {ringtone ? ringtone.name : 'Default Ringtone'}
                  </ThemedText>
                </View>
                <IconSymbol name="chevron.right" size={20} color={Colors[colorScheme ?? 'light'].icon} />
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.infoBox}>
        <IconSymbol name="info.circle" size={20} color={Colors[colorScheme ?? 'light'].tint} />
        <ThemedText style={styles.infoText}>
          Tap on a SIM card to assign a custom ringtone. This ringtone will play for all calls received on that SIM.
        </ThemedText>
      </View>
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
    paddingBottom: 20,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.6,
    fontSize: 14,
  },
  listContent: {
    padding: 20,
    gap: 16,
  },
  simCard: {
    borderRadius: 12,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  simHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  simIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  simInfo: {
    flex: 1,
    gap: 2,
  },
  carrierText: {
    fontSize: 12,
    opacity: 0.6,
  },
  ringtoneSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  ringtoneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  ringtoneLabel: {
    fontSize: 14,
  },
  loadingText: {
    marginTop: 12,
  },
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    margin: 20,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: '#1565C0',
  },
});
