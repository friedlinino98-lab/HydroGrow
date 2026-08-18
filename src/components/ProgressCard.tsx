import React from 'react';

interface ProgressCardProps {
  currentMl: number;
  targetMl: number;
  percentage: number;
  statusMessage: string;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  currentMl,
  targetMl,
  percentage,
  statusMessage,
}) => {
  const cappedPercentage = Math.min(percentage, 100);

  return (
    <div className="w-full rounded-2xl bg-slate-900 border border-slate-800 p-6 text-white shadow-lg">
      <div className="text-center mb-4">
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Heute getrunken</span>
        <div className="text-4xl font-black text-emerald-400 mt-1">
          {currentMl} <span className="text-xl font-normal text-slate-400">/ {targetMl} ml</span>
        </div>
      </div>

      <div className="relative w-full h-4 bg-slate-800 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-out"
          style={{ width: `${cappedPercentage}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className="font-bold text-emerald-400">{percentage}%</span>
        <span className="text-slate-300 font-medium">{statusMessage}</span>
      </div>
    </div>
  );
};