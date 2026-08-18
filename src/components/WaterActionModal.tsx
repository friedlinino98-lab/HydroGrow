import React, { useState } from 'react';

interface WaterActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWater: (amount: number) => Promise<void>;
}

const PRESET_AMOUNTS = [100, 200, 250, 330, 500, 750, 1000];

export const WaterActionModal: React.FC<WaterActionModalProps> = ({ isOpen, onClose, onAddWater }) => {
  const [customAmount, setCustomAmount] = useState<string>('250');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAdd = async (amount: number) => {
    setError(null);
    setLoading(true);
    try {
      await onAddWater(amount);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Fehler beim Speichern.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customAmount, 10);
    if (isNaN(parsed) || parsed <= 0) {
      setError('Bitte gib eine gültige Menge ein.');
      return;
    }
    handleAdd(parsed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-emerald-400">Wasser hinzufügen</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">✕</button>
        </div>

        {error && <div className="mb-4 text-sm text-red-400 bg-red-950/50 p-3 rounded-lg border border-red-800">{error}</div>}

        <p className="text-sm text-slate-400 mb-3">Schnellauswahl:</p>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {PRESET_AMOUNTS.map((amt) => (
            <button
              key={amt}
              disabled={loading}
              onClick={() => handleAdd(amt)}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-emerald-600/20 hover:border-emerald-500 border border-slate-700 font-medium transition text-sm disabled:opacity-50"
            >
              +{amt} ml
            </button>
          ))}
        </div>

        <p className="text-sm text-slate-400 mb-2">Eigene Menge:</p>
        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="number"
              min="1"
              max="5000"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500"
            />
            <span className="absolute right-3 top-2.5 text-slate-400 text-sm">ml</span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition disabled:opacity-50"
          >
            {loading ? '...' : 'Hinzufügen'}
          </button>
        </form>
      </div>
    </div>
  );
};