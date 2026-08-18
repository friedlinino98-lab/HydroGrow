import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { getLocalDateString } from '../lib/waterUtils';
import { UserSettings } from '../types/water';

const DEFAULT_SETTINGS: UserSettings = {
  user_id: '',
  min_water_ml: 1500,
  target_water_ml: 2500,
  max_water_ml: 3500,
};

export function useWaterData() {
  const { user, loading: authLoading } = useAuth();
  const [currentMl, setCurrentMl] = useState<number>(0);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    // Wenn Auth noch lädt, warten wir ab
    if (authLoading) return;

    // Wenn kein Benutzer eingeloggt ist, brechen wir das Laden sofort ab
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const todayStr = getLocalDateString();

      // 1. Einstellungen aus Supabase laden
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (settingsError) {
        console.error('Fehler beim Laden der Einstellungen:', settingsError.message);
      } else if (settingsData) {
        setSettings(settingsData);
      } else {
        // Fallback: Neue Einstellungen für den Benutzer anlegen
        const newSet = { ...DEFAULT_SETTINGS, user_id: user.id };
        const { data: createdSettings } = await supabase
          .from('user_settings')
          .insert([newSet])
          .select()
          .single();

        if (createdSettings) setSettings(createdSettings);
      }

      // 2. Heutigen Wasserstand berechnen
      const { data: logsData, error: logsError } = await supabase
        .from('water_logs')
        .select('amount_ml')
        .eq('user_id', user.id)
        .eq('date', todayStr);

      if (logsError) {
        console.error('Fehler beim Laden der Wasser-Logs:', logsError.message);
      } else if (logsData) {
        const total = logsData.reduce((sum, log) => sum + log.amount_ml, 0);
        setCurrentMl(total);
      }
    } catch (error) {
      console.error('Unerwarteter Fehler in useWaterData:', error);
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addWater = async (amountMl: number) => {
    if (!user) return;

    // Optimistisches Update
    setCurrentMl((prev) => Math.max(0, prev + amountMl));

    try {
      const todayStr = getLocalDateString();
      const { error } = await supabase.from('water_logs').insert([
        {
          user_id: user.id,
          amount_ml: amountMl,
          date: todayStr,
        },
      ]);

      if (error) {
        console.error('Fehler beim Speichern:', error.message);
        fetchData();
      }
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      fetchData();
    }
  };

  return {
    currentMl,
    settings,
    loading: loading || authLoading,
    addWater,
    refreshData: fetchData,
  };
}