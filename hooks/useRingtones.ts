import { useState, useEffect } from 'react';
import { Ringtone } from '@/types';
import { RingtoneManager } from '@/utils/ringtoneManager';

export const useRingtones = () => {
  const [ringtones, setRingtones] = useState<Ringtone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRingtones = async () => {
    try {
      setLoading(true);
      setError(null);
      const allRingtones = await RingtoneManager.getAllRingtones();
      setRingtones(allRingtones);
    } catch (err) {
      setError('Failed to load ringtones');
      console.error('Error loading ringtones:', err);
    } finally {
      setLoading(false);
    }
  };

  const addCustomRingtone = async (): Promise<Ringtone | null> => {
    try {
      const newRingtone = await RingtoneManager.pickCustomRingtone();
      if (newRingtone) {
        setRingtones((prev) => [...prev, newRingtone]);
        return newRingtone;
      }
      return null;
    } catch (err) {
      setError('Failed to add custom ringtone');
      console.error('Error adding custom ringtone:', err);
      return null;
    }
  };

  const deleteRingtone = async (ringtone: Ringtone): Promise<boolean> => {
    try {
      const success = await RingtoneManager.deleteCustomRingtone(ringtone);
      if (success) {
        setRingtones((prev) => prev.filter((r) => r.id !== ringtone.id));
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to delete ringtone');
      console.error('Error deleting ringtone:', err);
      return false;
    }
  };

  const getRingtoneById = (ringtoneId: string): Ringtone | undefined => {
    return ringtones.find((r) => r.id === ringtoneId);
  };

  const getSystemRingtones = (): Ringtone[] => {
    return ringtones.filter((r) => !r.isCustom);
  };

  const getCustomRingtones = (): Ringtone[] => {
    return ringtones.filter((r) => r.isCustom);
  };

  useEffect(() => {
    loadRingtones();
  }, []);

  return {
    ringtones,
    loading,
    error,
    loadRingtones,
    addCustomRingtone,
    deleteRingtone,
    getRingtoneById,
    getSystemRingtones,
    getCustomRingtones,
  };
};
