import { useSyncExternalStore } from 'react';

export type HolidayKey = 'christmas' | 'pride' | 'easter' | 'newyear' | 'halloween' | 'piday';

declare global {
  interface Window {
    setHoliday?: (holiday: string | null) => void;
  }
}

// Terminalkommandoen «holiday» setter en overstyring som gjelder hele siden, ikke bare banneret.
let override: HolidayKey | null = null;
const listeners = new Set<() => void>();

window.setHoliday = (holiday) => {
  override = (holiday?.toLowerCase() as HolidayKey) || null;
  listeners.forEach((l) => l());
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getEasterDate(year: number): Date {
  const f = Math.floor;
  const G = year % 19;
  const C = f(year / 100);
  const H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30;
  const I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11));
  const J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7;
  const L = I - J;
  const month = 3 + f((L + 40) / 44);
  const day = L + 28 - 31 * f(month / 4);
  return new Date(year, month - 1, day);
}

export function holidayForDate(date: Date): HolidayKey | null {
  const month = date.getMonth();
  const day = date.getDate();

  if (month === 2 && day === 14) return 'piday';
  if (month === 11 && day <= 26) return 'christmas';
  if (month === 5) return 'pride';

  const easter = getEasterDate(date.getFullYear());
  if (month === easter.getMonth() && Math.abs(day - easter.getDate()) <= 3) return 'easter';

  if ((month === 11 && day === 31) || (month === 0 && day === 1)) return 'newyear';
  if (month === 9 && day === 31) return 'halloween';
  return null;
}

export function useHoliday(): HolidayKey | null {
  const current = useSyncExternalStore(subscribe, () => override);
  return current ?? holidayForDate(new Date());
}
