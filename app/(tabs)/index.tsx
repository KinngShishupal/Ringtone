import React, { useState } from 'react';
import {
  StyleSheet,
  FlatList,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useContacts } from '@/hooks/useContacts';
import { useRingtones } from '@/hooks/useRingtones';
import { StorageService } from '@/utils/storage';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ContactsScreen() {
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const { contacts, loading, error, hasPermission, requestPermission } = useContacts();
  const { getRingtoneById } = useRingtones();
  const [ringtoneMap, setRingtoneMap] = useState<Record<string, string>>({});

  React.useEffect(() => {
    loadRingtoneMappings();
  }, [contacts]);

  const loadRingtoneMappings = async () => {
    const settings = await StorageService.getSettings();
    const map: Record<string, string> = {};
    settings.contactMappings.forEach((mapping) => {
      map[mapping.contactId] = mapping.ringtoneId;
    });
    setRingtoneMap(map);
  };

  const filteredContacts = searchQuery
    ? contacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.phoneNumbers?.some((phone) =>
            phone.number.includes(searchQuery)
          )
      )
    : contacts;

  const handleContactPress = (contactId: string) => {
    router.push({
      pathname: '/contact-detail',
      params: { contactId },
    });
  };

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
        <ThemedText style={styles.loadingText}>Loading contacts...</ThemedText>
      </ThemedView>
    );
  }

  if (!hasPermission) {
    return (
      <ThemedView style={styles.centerContainer}>
        <IconSymbol name="person.crop.circle.badge.exclamationmark" size={64} color={Colors[colorScheme ?? 'light'].icon} />
        <ThemedText type="title" style={styles.permissionTitle}>
          Contacts Access Required
        </ThemedText>
        <ThemedText style={styles.permissionText}>
          This app needs access to your contacts to assign custom ringtones.
        </ThemedText>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
          onPress={requestPermission}>
          <ThemedText style={styles.buttonText}>Grant Permission</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <IconSymbol name="exclamationmark.triangle" size={64} color="#FF6B6B" />
        <ThemedText type="title" style={styles.errorTitle}>
          Error Loading Contacts
        </ThemedText>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Contacts
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
        </ThemedText>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7' }]}>
        <IconSymbol name="magnifyingglass" size={20} color={Colors[colorScheme ?? 'light'].icon} />
        <TextInput
          style={[styles.searchInput, { color: Colors[colorScheme ?? 'light'].text }]}
          placeholder="Search contacts..."
          placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <IconSymbol name="xmark.circle.fill" size={20} color={Colors[colorScheme ?? 'light'].icon} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const ringtoneId = ringtoneMap[item.id];
          const ringtone = ringtoneId ? getRingtoneById(ringtoneId) : null;

          return (
            <TouchableOpacity
              style={[styles.contactItem, { borderBottomColor: colorScheme === 'dark' ? '#38383A' : '#E5E5EA' }]}
              onPress={() => handleContactPress(item.id)}>
              <View style={styles.contactInfo}>
                <View style={[styles.avatar, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
                  <ThemedText style={styles.avatarText}>
                    {item.name.charAt(0).toUpperCase()}
                  </ThemedText>
                </View>
                <View style={styles.contactDetails}>
                  <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                  {ringtone && (
                    <View style={styles.ringtoneTag}>
                      <IconSymbol name="bell.fill" size={12} color={Colors[colorScheme ?? 'light'].tint} />
                      <ThemedText style={styles.ringtoneText}>{ringtone.name}</ThemedText>
                    </View>
                  )}
                </View>
              </View>
              <IconSymbol name="chevron.right" size={20} color={Colors[colorScheme ?? 'light'].icon} />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <ThemedView style={styles.emptyContainer}>
            <IconSymbol name="person.crop.circle" size={64} color={Colors[colorScheme ?? 'light'].icon} />
            <ThemedText style={styles.emptyText}>No contacts found</ThemedText>
          </ThemedView>
        }
      />
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
    paddingBottom: 10,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contactDetails: {
    flex: 1,
    gap: 4,
  },
  ringtoneTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ringtoneText: {
    fontSize: 12,
    opacity: 0.6,
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
  permissionTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
    paddingHorizontal: 20,
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
  errorTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    opacity: 0.7,
  },
});
