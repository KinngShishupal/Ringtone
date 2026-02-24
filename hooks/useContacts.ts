import { useState, useEffect } from 'react';
import * as Contacts from 'expo-contacts';
import { Contact } from '@/types';

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const requestPermission = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      return status === 'granted';
    } catch (err) {
      setError('Failed to request contacts permission');
      return false;
    }
  };

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Contacts.getPermissionsAsync();
      
      if (status !== 'granted') {
        const granted = await requestPermission();
        if (!granted) {
          setError('Contacts permission denied');
          setLoading(false);
          return;
        }
      }

      setHasPermission(true);

      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.Name,
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Image,
        ],
        sort: Contacts.SortTypes.FirstName,
      });

      const formattedContacts: Contact[] = data.map((contact) => ({
        id: contact.id,
        name: contact.name || 'Unknown',
        phoneNumbers: contact.phoneNumbers?.map((phone) => ({
          number: phone.number || '',
          label: phone.label || 'mobile',
        })),
        imageAvailable: contact.imageAvailable,
        image: contact.image,
      }));

      setContacts(formattedContacts);
    } catch (err) {
      setError('Failed to load contacts');
      console.error('Error loading contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchContacts = (query: string): Contact[] => {
    if (!query.trim()) {
      return contacts;
    }

    const lowerQuery = query.toLowerCase();
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(lowerQuery) ||
        contact.phoneNumbers?.some((phone) =>
          phone.number.includes(query)
        )
    );
  };

  const getContactById = (contactId: string): Contact | undefined => {
    return contacts.find((contact) => contact.id === contactId);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  return {
    contacts,
    loading,
    error,
    hasPermission,
    requestPermission,
    loadContacts,
    searchContacts,
    getContactById,
  };
};
