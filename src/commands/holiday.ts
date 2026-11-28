import { Command, CommandContext } from './types';

const MODES = [
  { name: 'christmas', description: 'Show Christmas banner' },
  { name: 'pride', description: 'Show Pride banner' },
  { name: 'easter', description: 'Show Easter banner' },
  { name: 'newyear', description: 'Show New Year banner' },
  { name: 'halloween', description: 'Show Halloween banner' },
  { name: 'piday', description: 'Show Pi Day banner' },
  { name: 'reset', description: 'Reset to automatic mode' },
];
const VALID = MODES.map((m) => m.name);
const WIDTH = Math.max(...VALID.map((m) => m.length));

// Knapper, ikke lenker med href="#": med HashRouter ville «#» sendt deg til forsiden, og knapper virker med tastaturet.
const BUTTON_STYLE =
  'background:none;border:0;padding:0;font:inherit;color:#fde047;text-decoration:underline;cursor:pointer';

// Terminalen viser linjene som HTML, så tekst som skal vises som den er, må escapes.
const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Terminalen kan lukkes og åpnes igjen, så klikkene skal alltid skrive til den som er åpen nå.
let currentSetLines: CommandContext['setLines'] | null = null;

function applyHoliday(mode: string) {
  window.setHoliday?.(mode === 'reset' ? null : mode);
  currentSetLines?.((prev) => [
    ...prev,
    {
      content:
        mode === 'reset'
          ? '🔄 Reset to automatic holiday mode'
          : `🎉 Holiday mode set to: ${mode}. Close the terminal to see your work.`,
      type: 'output',
    },
  ]);
}

function handleClick(e: Event) {
  const target = (e.target as HTMLElement).closest<HTMLElement>('[data-holiday]');
  if (!target) return;
  e.preventDefault();
  const mode = target.dataset.holiday;
  if (mode && VALID.includes(mode)) applyHoliday(mode);
}

export const holidayCommand: Command = {
  name: 'holiday',
  description: 'Set holiday mode (christmas, pride, easter, newyear, halloween, piday, or reset)',
  execute: async (args, { setLines }) => {
    currentSetLines = setLines;
    document.removeEventListener('click', handleClick);
    document.addEventListener('click', handleClick);

    if (args.length === 0) {
      setLines((prev) => [
        ...prev,
        { content: 'Usage: holiday &lt;mode&gt;, or click one:', type: 'output' },
        ...MODES.map((m) => ({
          content: `  <button type="button" data-holiday="${m.name}" style="${BUTTON_STYLE}">${m.name}</button>${' '.repeat(WIDTH - m.name.length)}  - ${m.description}`,
          type: 'output' as const,
        })),
      ]);
      return;
    }

    const mode = args[0].toLowerCase();
    if (!VALID.includes(mode)) {
      setLines((prev) => [
        ...prev,
        { content: `Invalid mode: ${escapeHtml(mode)}`, type: 'output' },
        { content: 'Valid modes: ' + VALID.join(', '), type: 'output' },
      ]);
      return;
    }

    applyHoliday(mode);
  },
};
