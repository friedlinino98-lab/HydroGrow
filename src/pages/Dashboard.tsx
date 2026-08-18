import React, { useState } from 'react';
import { useWaterData } from '../hooks/useWaterData';
import { VirtualPlant } from '../components/VirtualPlant';
import { WaterActionModal } from '../components/WaterActionModal';
import { getPlantState } from '../lib/waterUtils';
import { Plus, Minus, RotateCcw } from 'lucide-react';

export function Dashboard() {
  const { currentMl, settings, loading, addWater } = useWaterData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [removeAmount, setRemoveAmount] = useState<string>('');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-[var(--text-secondary)] font-medium animate-pulse">
          Lädt Dashboard...
        </div>
      </div>
    );
  }

  const min = settings.min_water_ml;
  const target = settings.target_water_ml;
  const max = settings.max_water_ml;
  const percentage = Math.round((currentMl / target) * 100);
  const plantState = getPlantState(currentMl, min, target, max);

  const quickAddAmounts = [100, 200, 250, 330, 500, 750, 1000];

  const handleRemoveWater = async () => {
    const amount = parseInt(removeAmount, 10);
    if (!isNaN(amount) && amount > 0) {
      await addWater(-amount);
      setRemoveAmount('');
    }
  };

  const handleResetAll = async () => {
    if (currentMl === 0) return;

    const confirmed = window.confirm(
      'Möchtest du die heutige Wassermenge wirklich komplett auf 0 ml zurücksetzen?'
    );

    if (confirmed) {
      await addWater(-currentMl);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pflanzenstatus & Bild */}
        <VirtualPlant
          plantState={plantState}
          progress={percentage}
          currentAmount={currentMl}
          minimumAmount={min}
          targetAmount={target}
          maximumAmount={max}
        />

        {/* Heute Getrunken & Fortschritt */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <span className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold">
              Heute Getrunken
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)]">
                {currentMl}
              </span>
              <span className="text-lg text-[var(--text-secondary)]">/ {target} ml</span>
            </div>

            {/* Fortschrittsbalken */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2 text-[var(--text-secondary)] font-medium">
                <span>Fortschritt</span>
                <span>{percentage}%</span>
              </div>
              <div className="w-full h-3 bg-[var(--surface-secondary)] rounded-full overflow-hidden border border-[var(--border)]">
                <div
                  className="h-full bg-[var(--accent)] transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Richtwerte Breakdown */}
          <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-[var(--border)] text-center text-xs">
            <div className="p-2 rounded-lg bg-[var(--surface-secondary)]">
              <span className="block text-[var(--text-secondary)]">Mindestwert</span>
              <span className="font-semibold text-[var(--text-primary)]">{min} ml</span>
            </div>
            <div className="p-2 rounded-lg bg-[var(--surface-secondary)]">
              <span className="block text-[var(--text-secondary)]">Ziel</span>
              <span className="font-semibold text-[var(--text-primary)]">{target} ml</span>
            </div>
            <div className="p-2 rounded-lg bg-[var(--surface-secondary)]">
              <span className="block text-[var(--text-secondary)]">Maximalwert</span>
              <span className="font-semibold text-[var(--text-primary)]">{max} ml</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wasser hinzufügen & korrigieren */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Schnell Hinzufügen Section */}
        <div className="md:col-span-2 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-4">
            Schnell Hinzufügen
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickAddAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => addWater(amount)}
                className="py-3 px-4 bg-[var(--surface-secondary)] border border-[var(--border)] hover:border-[var(--text-secondary)] text-[var(--text-primary)] rounded-xl font-medium transition-all active:scale-95"
              >
                +{amount} ml
              </button>
            ))}
            <button
              onClick={() => setIsModalOpen(true)}
              className="py-3 px-4 bg-[var(--text-primary)] text-[var(--background)] rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95"
            >
              <Plus size={18} />
              <span>Eigene Menge</span>
            </button>
          </div>
        </div>

        {/* Menge Abziehen / Korrigieren & Reset */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Wasser Abziehen
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Falsche Eingabe gemacht? Ziehe Beträge ab oder setze alles zurück.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="number"
                value={removeAmount}
                onChange={(e) => setRemoveAmount(e.target.value)}
                placeholder="z. B. 250"
                className="w-full bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-secondary)]"
              />
              <button
                onClick={handleRemoveWater}
                className="py-2 px-3 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-xl font-medium text-sm flex items-center gap-1 transition-all active:scale-95 whitespace-nowrap"
              >
                <Minus size={16} />
                <span>Abziehen</span>
              </button>
            </div>

            {/* Reset All Button */}
            <button
              onClick={handleResetAll}
              disabled={currentMl === 0}
              className="w-full py-2 px-3 bg-red-600/20 border border-red-600/40 text-red-400 hover:bg-red-600/30 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <RotateCcw size={14} />
              <span>Alles zurücksetzen (0 ml)</span>
            </button>
          </div>
        </div>
      </div>

      <WaterActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddWater={addWater}
      />
    </div>
  );
}