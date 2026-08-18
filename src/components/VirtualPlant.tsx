import React from 'react';

interface VirtualPlantProps {
  plantState: 'burned' | 'thirsty' | 'ok' | 'overwatered';
  progress: number;
  currentAmount: number;
  minimumAmount: number;
  targetAmount: number;
  maximumAmount: number;
}

export function VirtualPlant({
  plantState,
  progress,
  currentAmount,
  minimumAmount,
  targetAmount,
  maximumAmount,
}: VirtualPlantProps) {
  // Farbzuweisung basierend auf dem Zustand
  const getPlantColors = () => {
    switch (plantState) {
      case 'thirsty':
        return {
          stem: '#B58D3D', // Gelb-Braun
          leaves: '#C29B38',
          accent: '#8C6721',
          bgGlow: 'rgba(194, 155, 56, 0.15)',
          statusText: 'Durstig',
        };
      case 'ok':
        return {
          stem: '#2E7D32', // Saftiges Grün
          leaves: '#4CAF50',
          accent: '#81C784',
          bgGlow: 'rgba(76, 175, 80, 0.15)',
          statusText: 'Optimal',
        };
      case 'overwatered':
        return {
          stem: '#616161', // Grau
          leaves: '#757575',
          accent: '#9E9E9E',
          bgGlow: 'rgba(117, 117, 117, 0.15)',
          statusText: 'Zu viel',
        };
      case 'burned':
      default:
        return {
          stem: '#4E342E', // Ausgetrocknetes Dunkelbraun
          leaves: '#5D4037',
          accent: '#3E2723',
          bgGlow: 'rgba(93, 64, 55, 0.15)',
          statusText: 'Kritisch trocken',
        };
    }
  };

  const colors = getPlantColors();

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between relative overflow-hidden">
      {/* Hintergrund-Glow je nach Zustand */}
      <div
        className="absolute inset-0 transition-colors duration-700 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${colors.bgGlow} 0%, transparent 70%)` }}
      />

      {/* SVG Pflanze */}
      <div className="w-48 h-48 my-4 relative z-10 flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-full h-full transition-all duration-500">
          {/* Blumentopf */}
          <path d="M65 140 L135 140 L125 180 L75 180 Z" fill="#333333" stroke="#555555" strokeWidth="2" />
          <rect x="60" y="132" width="80" height="10" rx="2" fill="#444444" stroke="#555555" strokeWidth="2" />

          {/* Stängel */}
          <path
            d="M100 132 Q95 90 100 50"
            fill="none"
            stroke={colors.stem}
            strokeWidth="6"
            strokeLinecap="round"
            className="transition-colors duration-500"
          />

          {/* Blätter Links */}
          <path
            d="M98 100 Q70 90 75 110 Q90 115 98 102"
            fill={colors.leaves}
            className="transition-colors duration-500"
          />
          <path
            d="M99 75 Q75 60 82 80 Q93 85 99 77"
            fill={colors.leaves}
            className="transition-colors duration-500"
          />

          {/* Blätter Rechts */}
          <path
            d="M102 90 Q130 80 125 100 Q110 105 102 92"
            fill={colors.leaves}
            className="transition-colors duration-500"
          />
          <path
            d="M101 65 Q125 50 118 70 Q107 75 101 67"
            fill={colors.leaves}
            className="transition-colors duration-500"
          />

          {/* Blümchen – Nur sichtbar im 'ok'-Zustand */}
          {plantState === 'ok' && (
            <g className="animate-fade-in">
              {/* Blume Mitte */}
              <circle cx="100" cy="50" r="6" fill="#FFD54F" />
              <circle cx="94" cy="50" r="4" fill="#E91E63" />
              <circle cx="106" cy="50" r="4" fill="#E91E63" />
              <circle cx="100" cy="44" r="4" fill="#E91E63" />
              <circle cx="100" cy="56" r="4" fill="#E91E63" />

              {/* Kleine Blume Seite */}
              <circle cx="125" cy="100" r="4" fill="#FFD54F" />
              <circle cx="121" cy="100" r="3" fill="#64B5F6" />
              <circle cx="129" cy="100" r="3" fill="#64B5F6" />
              <circle cx="125" cy="96" r="3" fill="#64B5F6" />
              <circle cx="125" cy="104" r="3" fill="#64B5F6" />
            </g>
          )}
        </svg>
      </div>

      {/* Status-Badge */}
      <div className="z-10 text-center">
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-500"
          style={{
            backgroundColor: colors.bgGlow,
            color: colors.leaves,
            border: `1px solid ${colors.accent}`,
          }}
        >
          {colors.statusText}
        </span>
      </div>
    </div>
  );
}