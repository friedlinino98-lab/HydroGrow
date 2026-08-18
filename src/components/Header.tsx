import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Droplets, LogOut } from 'lucide-react';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-[var(--surface)] border-b border-[var(--border)] px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl text-[var(--accent)]">
          <Droplets size={22} />
        </div>
        <h1 className="text-lg font-bold tracking-wide text-[var(--text-primary)]">
          HydroGrow
        </h1>
      </div>

      {user && (
        <button
          onClick={signOut}
          title="Abmelden"
          className="p-2 text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <LogOut size={20} />
        </button>
      )}
    </header>
  );
}