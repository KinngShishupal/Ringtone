import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

const RingtoneNativeModule = NativeModulesProxy.RingtoneNative;

export interface RingtoneNativeModule {
  setRingtoneForContact(contactId: string, ringtoneUri: string): Promise<boolean>;
  setDefaultRingtone(ringtoneUri: string): Promise<boolean>;
  getRingtoneForContact(contactId: string): Promise<string | null>;
  isRingtonePermissionGranted(): Promise<boolean>;
  requestRingtonePermission(): Promise<boolean>;
}

export default {
  async setRingtoneForContact(contactId: string, ringtoneUri: string): Promise<boolean> {
    if (!RingtoneNativeModule) {
      console.warn('RingtoneNative module not available. This feature requires native Android support.');
      return false;
    }
    try {
      return await RingtoneNativeModule.setRingtoneForContact(contactId, ringtoneUri);
    } catch (error) {
      console.error('Error setting ringtone for contact:', error);
      return false;
    }
  },

  async setDefaultRingtone(ringtoneUri: string): Promise<boolean> {
    if (!RingtoneNativeModule) {
      console.warn('RingtoneNative module not available. This feature requires native Android support.');
      return false;
    }
    try {
      return await RingtoneNativeModule.setDefaultRingtone(ringtoneUri);
    } catch (error) {
      console.error('Error setting default ringtone:', error);
      return false;
    }
  },

  async getRingtoneForContact(contactId: string): Promise<string | null> {
    if (!RingtoneNativeModule) {
      return null;
    }
    try {
      return await RingtoneNativeModule.getRingtoneForContact(contactId);
    } catch (error) {
      console.error('Error getting ringtone for contact:', error);
      return null;
    }
  },

  async isRingtonePermissionGranted(): Promise<boolean> {
    if (!RingtoneNativeModule) {
      return false;
    }
    try {
      return await RingtoneNativeModule.isRingtonePermissionGranted();
    } catch (error) {
      console.error('Error checking ringtone permission:', error);
      return false;
    }
  },

  async requestRingtonePermission(): Promise<boolean> {
    if (!RingtoneNativeModule) {
      return false;
    }
    try {
      return await RingtoneNativeModule.requestRingtonePermission();
    } catch (error) {
      console.error('Error requesting ringtone permission:', error);
      return false;
    }
  },
};
