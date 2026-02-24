import AsyncStorage from '@react-native-async-storage/async-storage';
import { RingtoneSettings, ContactRingtoneMapping, SIMRingtoneMapping } from '@/types';

const STORAGE_KEYS = {
  RINGTONE_SETTINGS: '@ringtone_settings',
  CONTACT_MAPPINGS: '@contact_ringtone_mappings',
  SIM_MAPPINGS: '@sim_ringtone_mappings',
  DEFAULT_RINGTONE: '@default_ringtone',
};

export const StorageService = {
  async getSettings(): Promise<RingtoneSettings> {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.RINGTONE_SETTINGS);
      if (settings) {
        return JSON.parse(settings);
      }
      return {
        contactMappings: [],
        simMappings: [],
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      return {
        contactMappings: [],
        simMappings: [],
      };
    }
  },

  async saveSettings(settings: RingtoneSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.RINGTONE_SETTINGS,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  },

  async setContactRingtone(contactId: string, ringtoneId: string): Promise<void> {
    try {
      const settings = await this.getSettings();
      const existingIndex = settings.contactMappings.findIndex(
        (m) => m.contactId === contactId
      );

      if (existingIndex >= 0) {
        settings.contactMappings[existingIndex].ringtoneId = ringtoneId;
      } else {
        settings.contactMappings.push({ contactId, ringtoneId });
      }

      await this.saveSettings(settings);
    } catch (error) {
      console.error('Error setting contact ringtone:', error);
      throw error;
    }
  },

  async getContactRingtone(contactId: string): Promise<string | null> {
    try {
      const settings = await this.getSettings();
      const mapping = settings.contactMappings.find(
        (m) => m.contactId === contactId
      );
      return mapping?.ringtoneId || null;
    } catch (error) {
      console.error('Error getting contact ringtone:', error);
      return null;
    }
  },

  async setSIMRingtone(simId: string, ringtoneId: string): Promise<void> {
    try {
      const settings = await this.getSettings();
      const existingIndex = settings.simMappings.findIndex(
        (m) => m.simId === simId
      );

      if (existingIndex >= 0) {
        settings.simMappings[existingIndex].ringtoneId = ringtoneId;
      } else {
        settings.simMappings.push({ simId, ringtoneId });
      }

      await this.saveSettings(settings);
    } catch (error) {
      console.error('Error setting SIM ringtone:', error);
      throw error;
    }
  },

  async getSIMRingtone(simId: string): Promise<string | null> {
    try {
      const settings = await this.getSettings();
      const mapping = settings.simMappings.find((m) => m.simId === simId);
      return mapping?.ringtoneId || null;
    } catch (error) {
      console.error('Error getting SIM ringtone:', error);
      return null;
    }
  },

  async setDefaultRingtone(ringtoneId: string): Promise<void> {
    try {
      const settings = await this.getSettings();
      settings.defaultRingtoneId = ringtoneId;
      await this.saveSettings(settings);
    } catch (error) {
      console.error('Error setting default ringtone:', error);
      throw error;
    }
  },

  async getDefaultRingtone(): Promise<string | null> {
    try {
      const settings = await this.getSettings();
      return settings.defaultRingtoneId || null;
    } catch (error) {
      console.error('Error getting default ringtone:', error);
      return null;
    }
  },

  async clearAllSettings(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.RINGTONE_SETTINGS);
    } catch (error) {
      console.error('Error clearing settings:', error);
      throw error;
    }
  },
};
