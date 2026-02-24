import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { SIMCard } from '@/types';

export const useSIMCards = () => {
  const [simCards, setSimCards] = useState<SIMCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSIMCards = async () => {
    try {
      setLoading(true);
      setError(null);

      if (Platform.OS === 'android') {
        const mockSIMCards: SIMCard[] = [
          {
            id: 'sim1',
            displayName: 'SIM 1',
            slotIndex: 0,
            carrierName: 'Carrier 1',
          },
          {
            id: 'sim2',
            displayName: 'SIM 2',
            slotIndex: 1,
            carrierName: 'Carrier 2',
          },
        ];
        setSimCards(mockSIMCards);
      } else {
        const singleSIM: SIMCard[] = [
          {
            id: 'sim1',
            displayName: 'Primary SIM',
            slotIndex: 0,
            carrierName: 'Carrier',
          },
        ];
        setSimCards(singleSIM);
      }
    } catch (err) {
      setError('Failed to load SIM cards');
      console.error('Error loading SIM cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSIMById = (simId: string): SIMCard | undefined => {
    return simCards.find((sim) => sim.id === simId);
  };

  useEffect(() => {
    loadSIMCards();
  }, []);

  return {
    simCards,
    loading,
    error,
    loadSIMCards,
    getSIMById,
  };
};
