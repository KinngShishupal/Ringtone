import * as MediaLibrary from 'expo-media-library';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Ringtone } from '@/types';

export const RingtoneManager = {
  async requestPermissions(): Promise<boolean> {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  },

  async getSystemRingtones(): Promise<Ringtone[]> {
    const defaultRingtones: Ringtone[] = [
      {
        id: 'default_1',
        name: 'Classic Ring',
        uri: 'system://ringtone/classic',
        isCustom: false,
        isDefault: true,
      },
      {
        id: 'default_2',
        name: 'Digital',
        uri: 'system://ringtone/digital',
        isCustom: false,
      },
      {
        id: 'default_3',
        name: 'Melody',
        uri: 'system://ringtone/melody',
        isCustom: false,
      },
      {
        id: 'default_4',
        name: 'Pulse',
        uri: 'system://ringtone/pulse',
        isCustom: false,
      },
      {
        id: 'default_5',
        name: 'Echo',
        uri: 'system://ringtone/echo',
        isCustom: false,
      },
    ];

    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return defaultRingtones;
      }

      const media = await MediaLibrary.getAssetsAsync({
        mediaType: 'audio',
        first: 50,
      });

      const audioRingtones: Ringtone[] = media.assets
        .filter((asset) => asset.duration && asset.duration < 30)
        .map((asset) => ({
          id: asset.id,
          name: asset.filename.replace(/\.[^/.]+$/, ''),
          uri: asset.uri,
          duration: asset.duration,
          isCustom: false,
        }));

      return [...defaultRingtones, ...audioRingtones];
    } catch (error) {
      console.error('Error loading system ringtones:', error);
      return defaultRingtones;
    }
  },

  async pickCustomRingtone(): Promise<Ringtone | null> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return null;
      }

      const asset = result.assets[0];
      const fileInfo = await FileSystem.getInfoAsync(asset.uri);

      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }

      const ringtoneDir = `${FileSystem.documentDirectory}ringtones/`;
      const dirInfo = await FileSystem.getInfoAsync(ringtoneDir);

      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(ringtoneDir, {
          intermediates: true,
        });
      }

      const fileName = asset.name;
      const newPath = `${ringtoneDir}${fileName}`;

      await FileSystem.copyAsync({
        from: asset.uri,
        to: newPath,
      });

      const customRingtone: Ringtone = {
        id: `custom_${Date.now()}`,
        name: fileName.replace(/\.[^/.]+$/, ''),
        uri: newPath,
        isCustom: true,
      };

      return customRingtone;
    } catch (error) {
      console.error('Error picking custom ringtone:', error);
      return null;
    }
  },

  async deleteCustomRingtone(ringtone: Ringtone): Promise<boolean> {
    try {
      if (!ringtone.isCustom) {
        return false;
      }

      const fileInfo = await FileSystem.getInfoAsync(ringtone.uri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(ringtone.uri);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting custom ringtone:', error);
      return false;
    }
  },

  async getCustomRingtones(): Promise<Ringtone[]> {
    try {
      const ringtoneDir = `${FileSystem.documentDirectory}ringtones/`;
      const dirInfo = await FileSystem.getInfoAsync(ringtoneDir);

      if (!dirInfo.exists) {
        return [];
      }

      const files = await FileSystem.readDirectoryAsync(ringtoneDir);

      const customRingtones: Ringtone[] = files.map((file) => ({
        id: `custom_${file}`,
        name: file.replace(/\.[^/.]+$/, ''),
        uri: `${ringtoneDir}${file}`,
        isCustom: true,
      }));

      return customRingtones;
    } catch (error) {
      console.error('Error loading custom ringtones:', error);
      return [];
    }
  },

  async getAllRingtones(): Promise<Ringtone[]> {
    const [systemRingtones, customRingtones] = await Promise.all([
      this.getSystemRingtones(),
      this.getCustomRingtones(),
    ]);

    return [...systemRingtones, ...customRingtones];
  },
};
