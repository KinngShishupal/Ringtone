export interface Contact {
  id: string;
  name: string;
  phoneNumbers?: Array<{
    number: string;
    label: string;
  }>;
  imageAvailable?: boolean;
  image?: {
    uri: string;
  };
}

export interface Ringtone {
  id: string;
  name: string;
  uri: string;
  duration?: number;
  isCustom: boolean;
  isDefault?: boolean;
}

export interface SIMCard {
  id: string;
  displayName: string;
  slotIndex: number;
  carrierName?: string;
}

export interface ContactRingtoneMapping {
  contactId: string;
  ringtoneId: string;
}

export interface SIMRingtoneMapping {
  simId: string;
  ringtoneId: string;
}

export interface RingtoneSettings {
  contactMappings: ContactRingtoneMapping[];
  simMappings: SIMRingtoneMapping[];
  defaultRingtoneId?: string;
}
