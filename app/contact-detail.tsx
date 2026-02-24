import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams, router } from 'expo-router';
import { useContacts } from '@/hooks/useContacts';
import { useRingtones } from '@/hooks/useRingtones';
import { StorageService } from '@/utils/storage';

export default function ContactDetailScreen() {
  const colorScheme = useColorScheme();
  const { contactId } = useLocalSearchParams<{ contactId: string }>();
  const { getContactById } = useContacts();
  const { ringtones, getRingtoneById } = useRingtones();
  const [selectedRingtoneId, setSelectedRingtoneId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const contact = getContactById(contactId as string);

  useEffect(() => {
    loadContactRingtone();
  }, [contactId]);

  const loadContactRingtone = async () => {
    const ringtoneId = await StorageService.getContactRingtone(contactId as string);
    setSelectedRingtoneId(ringtoneId);
  };

  const handleRingtoneSelect = async (ringtoneId: string) => {
    try {
      setLoading(true);
      await StorageService.setContactRingtone(contactId as string, ringtoneId);
      setSelectedRingtoneId(ringtoneId);
      Alert.alert('Success', 'Ringtone assigned successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to assign ringtone');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRingtone = () => {
    Alert.alert(
      'Remove Custom Ringtone',
      'This will restore the default ringtone for this contact.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const settings = await StorageService.getSettings();
              settings.contactMappings = settings.contactMappings.filter(
                (m) => m.contactId !== contactId
              );
              await StorageService.saveSettings(settings);
              setSelectedRingtoneId(null);
              Alert.alert('Removed', 'Ringtone removed successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to remove ringtone');
            }
          },
        },
      ]
    );
  };

  if (!contact) {
    return (
      <ThemedView style={styles.centerContainer}>
        <IconSymbol name="exclamationmark.triangle" size={64} color="#FF6B6B" />
        <ThemedText style={styles.errorText}>Contact not found</ThemedText>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
          onPress={() => router.back()}>
          <ThemedText style={styles.buttonText}>Go Back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const selectedRingtone = selectedRingtoneId ? getRingtoneById(selectedRingtoneId) : null;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].tint} />
        </TouchableOpacity>
        <ThemedText type="title">Contact Details</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView>
        <View style={styles.contactCard}>
          <View style={[styles.largeAvatar, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
            <ThemedText style={styles.largeAvatarText}>
              {contact.name.charAt(0).toUpperCase()}
            </ThemedText>
          </View>
          <ThemedText type="title" style={styles.contactName}>
            {contact.name}
          </ThemedText>
          {contact.phoneNumbers && contact.phoneNumbers.length > 0 && (
            <View style={styles.phoneNumbers}>
              {contact.phoneNumbers.map((phone, index) => (
                <View key={index} style={styles.phoneItem}>
                  <IconSymbol name="phone.fill" size={16} color={Colors[colorScheme ?? 'light'].icon} />
                  <ThemedText style={styles.phoneText}>{phone.number}</ThemedText>
                  <ThemedText style={styles.phoneLabel}>({phone.label})</ThemedText>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Custom Ringtone
          </ThemedText>

          {selectedRingtone && (
            <View style={[styles.currentRingtone, { backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7' }]}>
              <View style={styles.ringtoneInfo}>
                <IconSymbol name="bell.fill" size={20} color={Colors[colorScheme ?? 'light'].tint} />
                <ThemedText type="defaultSemiBold">{selectedRingtone.name}</ThemedText>
              </View>
              <TouchableOpacity onPress={handleRemoveRingtone}>
                <IconSymbol name="xmark.circle.fill" size={24} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          )}

          <ThemedText style={styles.sectionDescription}>
            Select a custom ringtone for this contact
          </ThemedText>
        </View>

        <View style={styles.ringtoneList}>
          {ringtones.map((ringtone) => (
            <TouchableOpacity
              key={ringtone.id}
              style={[
                styles.ringtoneItem,
                { borderBottomColor: colorScheme === 'dark' ? '#38383A' : '#E5E5EA' },
                selectedRingtoneId === ringtone.id && { backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7' },
              ]}
              onPress={() => handleRingtoneSelect(ringtone.id)}
              disabled={loading}>
              <View style={styles.ringtoneItemContent}>
                <View style={[styles.ringtoneIcon, { backgroundColor: ringtone.isCustom ? '#FF6B6B' : Colors[colorScheme ?? 'light'].tint }]}>
                  <IconSymbol
                    name={ringtone.isDefault ? 'bell.badge.fill' : 'music.note'}
                    size={18}
                    color="#FFFFFF"
                  />
                </View>
                <View style={styles.ringtoneDetails}>
                  <ThemedText type="defaultSemiBold">{ringtone.name}</ThemedText>
                  <ThemedText style={styles.ringtoneType}>
                    {ringtone.isDefault ? 'Default' : ringtone.isCustom ? 'Custom' : 'System'}
                  </ThemedText>
                </View>
              </View>
              {selectedRingtoneId === ringtone.id && (
                <IconSymbol name="checkmark.circle.fill" size={24} color={Colors[colorScheme ?? 'light'].tint} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    gap: 16,
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
  contactCard: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  largeAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeAvatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contactName: {
    marginTop: 8,
  },
  phoneNumbers: {
    gap: 8,
    marginTop: 8,
  },
  phoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phoneText: {
    fontSize: 14,
  },
  phoneLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  sectionDescription: {
    opacity: 0.6,
    fontSize: 14,
  },
  currentRingtone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  ringtoneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  ringtoneList: {
    paddingBottom: 32,
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
  errorText: {
    opacity: 0.7,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
