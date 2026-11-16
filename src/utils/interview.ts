// Tidspunkter vises alltid i norsk tid, uansett hvor kandidaten sitter.
const TZ = 'Europe/Oslo';

// En ledig tid identifiseres av starttidspunktet. Bookingen har i tillegg en fast id og Meet-lenken.
export type Slot = { starts_at: string; ends_at: string };
export type BookedSlot = Slot & { id: string; meet_url: string | null };

const dayKey = new Intl.DateTimeFormat('sv-SE', { timeZone: TZ }); // 2026-11-24
const dayLabel = new Intl.DateTimeFormat('nb-NO', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long' });
const timeLabel = new Intl.DateTimeFormat('nb-NO', { timeZone: TZ, hour: '2-digit', minute: '2-digit' });

export const formatDay = (iso: string) => {
  const text = dayLabel.format(new Date(iso));
  return text.charAt(0).toUpperCase() + text.slice(1); // «tirsdag 24. november» → «Tirsdag 24. november»
};
export const formatTime = (iso: string) => timeLabel.format(new Date(iso));
export const formatRange = (s: Slot) => `${formatTime(s.starts_at)}–${formatTime(s.ends_at)}`;

/** Gruppér tidene per dag i norsk tid, i rekkefølge. */
export function groupByDay(slots: Slot[]): { key: string; label: string; slots: Slot[] }[] {
  const days = new Map<string, Slot[]>();
  for (const s of [...slots].sort((a, b) => a.starts_at.localeCompare(b.starts_at))) {
    const key = dayKey.format(new Date(s.starts_at));
    days.set(key, [...(days.get(key) ?? []), s]);
  }
  return [...days].map(([key, list]) => ({ key, label: formatDay(list[0].starts_at), slots: list }));
}

const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, ''); // 20261124T090000Z

export function googleCalendarUrl(s: BookedSlot): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Intervju hos Rubberduck',
    dates: `${stamp(s.starts_at)}/${stamp(s.ends_at)}`,
    details: s.meet_url ? `Google Meet: ${s.meet_url}` : 'Intervju hos Rubberduck',
    location: s.meet_url ?? '',
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

const icsText = (v: string) => v.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

/** .ics-fil som kan åpnes i Apple Kalender, Outlook og de fleste andre. */
export function icsFile(s: BookedSlot): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Rubberduck//Intervju//NO',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${s.id}@rubberduck.no`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(s.starts_at)}`,
    `DTEND:${stamp(s.ends_at)}`,
    'SUMMARY:Intervju hos Rubberduck',
    ...(s.meet_url ? [`LOCATION:${icsText(s.meet_url)}`, `DESCRIPTION:${icsText(`Google Meet: ${s.meet_url}`)}`] : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n');
}
