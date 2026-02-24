import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams, router } from 'expo-router';
import { useRingtones } from '@/hooks/useRingtones';
import { StorageService } from '@/utils/storage';

export default function RingtonePickerScreen() {
  const colorScheme = useColorScheme();
  const { simId, type } = useLocalSearchParams<{ simId: string; type: string }>();
  const { ringtones, getRingtoneById } = useRingtones();
  const [selectedRingtoneId, setSelectedRingtoneId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCurrentRingtone();
  }, [simId]);

  const loadCurrentRingtone = async () => {
    if (type === 'sim' && simId) {
      const ringtoneId = await StorageService.getSIMRingtone(simId);
      setSelectedRingtoneId(ringtoneId);
    }
  };

  const handleRingtoneSelect = async (ringtoneId: string) => {
    try {
      setLoading(true);
      if (type === 'sim' && simId) {
        await StorageService.setSIMRingtone(simId, ringtoneId);
        setSelectedRingtoneId(ringtoneId);
        Alert.alert('Success', 'Ringtone assigned successfully', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to assign ringtone');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].tint} />
        </TouchableOpacity>
        <ThemedText type="title">Select Ringtone</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={ringtones}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.ringtoneItem,
              { borderBottomColor: colorScheme === 'dark' ? '#38383A' : '#E5E5EA' },
              selectedRingtoneId === item.id && { backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7' },
            ]}
            onPress={() => handleRingtoneSelect(item.id)}
            disabled={loading}>
            <View style={styles.ringtoneItemContent}>
              <View style={[styles.ringtoneIcon, { backgroundColor: item.isCustom ? '#FF6B6B' : Colors[colorScheme ?? 'light'].tint }]}>
                <IconSymbol
                  name={item.isDefault ? 'bell.badge.fill' : 'music.note'}
                  size={18}
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
            {selectedRingtoneId === item.id && (
              <IconSymbol name="checkmark.circle.fill" size={24} color={Colors[colorScheme ?? 'light'].tint} />
            )}
          </TouchableOpacity>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  ringtoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  ringtoneItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  ringtoneIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
});
