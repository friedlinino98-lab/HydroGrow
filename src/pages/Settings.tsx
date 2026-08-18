import React, { useState, useEffect } from 'react';
import { useWaterData } from '../hooks/useWaterData';

export const Settings: React.FC = () => {
  const { settings, updateSettings, loading } = useWaterData();

  const [minVal, setMinVal] = useState(1500);
  const [targetVal, setTargetVal] = useState(2000);
  const [maxVal, setMaxVal] = useState(3000);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    if (settings) {
      setMinVal(settings.min_water_ml);
      setTargetVal(settings.target_water_ml);
      setMaxVal(settings.max_water_ml);
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setSaving(true);

    try {
      await updateSettings({
        min_water_ml: Number(minVal),
        target_water_ml: Number(targetVal),
        max_water_ml: Number(maxVal),
      });
      setMsg({ text: 'Einstellungen erfolgreich gespeichert!', isError: false });
    } catch (err: any) {
      setMsg({ text: err.message || 'Fehler beim Speichern.', isError: true });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-white text-center">Lade Einstellungen...</div>;

  return (
    <div className="max-w-md mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold text-emerald-400 mb-6">Trinkziele anpassen</h1>

      {msg && (
        <div className={`p-4 rounded-xl mb-4 border text-sm ${msg.isError ? 'bg-red-950/50 border-red-800 text-red-400' : 'bg-emerald-950/50 border-emerald-800 text-emerald-400'}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Mindestwert (ml)</label>
          <input
            type="number"
            value={minVal}
            onChange={(e) => setMinVal(Number(e.target.value))}
            className="w-full rounded-xl bg-slate-800 border border-slate-700 py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Tagesziel (ml)</label>
          <input
            type="number"
            value={targetVal}
            onChange={(e) => setTargetVal(Number(e.target.value))}
            className="w-full rounded-xl bg-slate-800 border border-slate-700 py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Maximalwert (ml)</label>
          <input
            type="number"
            value={maxVal}
            onChange={(e) => setMaxVal(Number(e.target.value))}
            className="w-full rounded-xl bg-slate-800 border border-slate-700 py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl transition disabled:opacity-50 mt-4"
        >
          {saving ? 'Speichert...' : 'Einstellungen Speichern'}
        </button>
      </form>
    </div>
  );
};