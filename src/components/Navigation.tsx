import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart2, Settings } from 'lucide-react';

export default function Navigation() {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/stats', label: 'Statistik', icon: BarChart2 },
    { path: '/settings', label: 'Einstellungen', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:relative md:w-64 bg-[var(--surface)] border-t md:border-t-0 md:border-r border-[var(--border)] p-2 md:p-4 z-40">
      <div className="flex md:flex-col justify-around md:justify-start gap-1 md:gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-[var(--text-primary)] text-[var(--background)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]'
                }`
              }
            >
              <Icon size={20} />
              <span className="hidden md:inline">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}