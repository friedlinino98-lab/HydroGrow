import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DayLog {
  dateStr: string;
  dayName: string;
  dayNum: string;
  amountMl: number;
}

export function Stats() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [weeklyData, setWeeklyData] = useState<DayLog[]>([]);
  const [averageMl, setAverageMl] = useState<number>(0);
  const [dateRangeText, setDateRangeText] = useState<string>('');

  const fetch7DaysData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const days: DayLog[] = [];
      const today = new Date();

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const dayName = d.toLocaleDateString('de-DE', { weekday: 'short' });
        const dayNum = String(d.getDate());

        days.push({
          dateStr,
          dayName,
          dayNum,
          amountMl: 0,
        });
      }

      const startDate = new Date(days[0].dateStr);
      const endDate = new Date(days[6].dateStr);
      const formatHeaderDate = (date: Date) =>
        date.toLocaleDateString('de-DE', { month: 'short', day: 'numeric' }).toUpperCase();

      setDateRangeText(`${formatHeaderDate(startDate)} - ${formatHeaderDate(endDate)}`);

      const startDateStr = days[0].dateStr;
      const { data: logsData, error } = await supabase
        .from('water_logs')
        .select('amount_ml, date')
        .eq('user_id', user.id)
        .gte('date', startDateStr);

      if (error) throw error;

      if (logsData) {
        logsData.forEach((log) => {
          const match = days.find((d) => d.dateStr === log.date);
          if (match) {
            match.amountMl += log.amount_ml;
          }
        });
      }

      const totalMl = days.reduce((sum, d) => sum + d.amountMl, 0);
      const avg = Math.round(totalMl / 7);

      setWeeklyData(days);
      setAverageMl(avg);
    } catch (err: any) {
      console.error('Fehler beim Laden der Statistik:', err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetch7DaysData();
  }, [fetch7DaysData]);

  if (loading) {
    return <div className="p-8 text-center text-[var(--text-secondary)]">Statistik wird geladen...</div>;
  }

  const maxVal = Math.max(...weeklyData.map((d) => d.amountMl), 3000);
  const chartHeight = 180;
  const chartWidth = 320;
  const paddingX = 30;

  const points = weeklyData.map((d, index) => {
    const x = paddingX + index * ((chartWidth - 2 * paddingX) / (weeklyData.length - 1));
    const y = chartHeight - (d.amountMl / maxVal) * (chartHeight - 40) - 20;
    return { x, y, amountMl: d.amountMl, dayName: d.dayName, dayNum: d.dayNum };
  });

  const pathD = points.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto space-y-6">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-2xl flex flex-col items-center">
        <div className="flex items-center gap-4 mb-6">
          <button className="p-1 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]">
            <ChevronLeft size={20} />
          </button>
          <span className="text-xs font-bold uppercase tracking-widest bg-[var(--surface-secondary)] border border-[var(--border)] px-4 py-1.5 rounded-full text-[var(--text-primary)]">
            {dateRangeText}
          </span>
          <button className="p-1 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]">
            <ChevronRight size={20} />
          </button>
        </div>

        <p className="text-sm text-center text-[var(--text-secondary)] mb-6 px-4">
          Dein 7-Tage-Trinkdurchschnitt liegt bei{' '}
          <span className="font-bold text-[var(--text-primary)]">{averageMl} ml</span> pro Tag.
        </p>

        <div className="w-full relative my-2">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
            {[0, 0.33, 0.66, 1].map((ratio, i) => {
              const yVal = chartHeight - ratio * (chartHeight - 40) - 20;
              return (
                <line
                  key={i}
                  x1={paddingX - 10}
                  y1={yVal}
                  x2={chartWidth - paddingX + 10}
                  y2={yVal}
                  stroke="var(--border)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}

            <path d={pathD} fill="none" stroke="var(--text-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {points.map((pt, i) => (
              <g key={i}>
                <text
                  x={pt.x}
                  y={pt.y - 12}
                  textAnchor="middle"
                  fill="var(--text-primary)"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {pt.amountMl > 0 ? `${pt.amountMl}` : '0'}
                </text>

                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  fill="var(--surface)"
                  stroke="var(--text-primary)"
                  strokeWidth="2.5"
                />
              </g>
            ))}
          </svg>

          <div className="flex justify-between px-2 mt-4 text-center">
            {points.map((pt, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-[10px] uppercase font-semibold text-[var(--text-secondary)]">
                  {pt.dayName}
                </span>
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  {pt.dayNum}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full mt-8 pt-6 border-t border-[var(--border)]">
          <div className="bg-[var(--surface-secondary)] border border-[var(--border)] p-4 rounded-2xl text-center">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)]">
              7-Tage-Schnitt
            </span>
            <span className="text-2xl font-extrabold text-[var(--text-primary)] mt-1 block">
              {averageMl} <span className="text-xs font-normal text-[var(--text-secondary)]">ml</span>
            </span>
          </div>

          <div className="bg-[var(--surface-secondary)] border border-[var(--border)] p-4 rounded-2xl text-center">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)]">
              Gesamt (7 Tage)
            </span>
            <span className="text-2xl font-extrabold text-[var(--text-primary)] mt-1 block">
              {weeklyData.reduce((acc, d) => acc + d.amountMl, 0)}{' '}
              <span className="text-xs font-normal text-[var(--text-secondary)]">ml</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}