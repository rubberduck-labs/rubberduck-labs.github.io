import { useState } from 'react';
import { formatRange, groupByDay, type Slot } from '../utils/interview';

interface SlotPickerProps {
  slots: Slot[];
  selectedStart: string | null;
  onSelect: (slot: Slot) => void;
  /** Hvor mange tider som vises før «Vis flere dager». Hele dager tas med, så ingen dag deles. */
  initialCount?: number;
}

/** Ledige tider, gruppert per dag. Vet ikke noe om invitasjoner, så den kan brukes på åpne sider også. */
export function SlotPicker({ slots, selectedStart, onSelect, initialCount = 15 }: SlotPickerProps) {
  const [all, setAll] = useState(false);
  const days = groupByDay(slots);

  let shown = days;
  if (!all) {
    let count = 0;
    shown = [];
    for (const day of days) {
      shown.push(day);
      count += day.slots.length;
      if (count >= initialCount) break;
    }
  }
  const hidden = days.length - shown.length;

  return (
    <div className="space-y-6">
      {shown.map((day) => (
        <fieldset key={day.key}>
          <legend className="mb-2 text-sm font-semibold text-custom-dark dark:text-white">{day.label}</legend>
          <div className="flex flex-wrap gap-2">
            {day.slots.map((slot) => {
              const selected = slot.starts_at === selectedStart;
              return (
                <button
                  key={slot.starts_at}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelect(slot)}
                  className={`rounded-md border px-4 py-2 text-sm font-medium tabular-nums transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-custom-dark dark:focus-visible:ring-white ${
                    selected
                      ? 'border-custom-dark bg-custom-dark text-white dark:border-white dark:bg-white dark:text-custom-dark'
                      : 'border-custom-dark/25 bg-white text-custom-dark hover:border-custom-dark dark:border-white/25 dark:bg-zinc-800 dark:text-white dark:hover:border-white'
                  }`}
                >
                  {formatRange(slot)}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setAll(true)}
          className="text-sm font-medium text-custom-dark underline underline-offset-2 dark:text-white"
        >
          Vis flere dager ({hidden})
        </button>
      )}
    </div>
  );
}
