import { Command } from './types';

export const holidayCommand: Command = {
  name: 'holiday',
  description: 'Set holiday mode (christmas, pride, easter, newyear, halloween, piday, or reset)',
  execute: async (args, { setLines }) => {
    if (args.length === 0) {
      setLines(prev => [
        ...prev,
        { content: 'Usage: holiday <mode>', type: 'output' },
        { content: 'Available modes:', type: 'output' },
        { content: '  christmas  - Show Christmas banner', type: 'output' },
        { content: '  pride      - Show Pride banner', type: 'output' },
        { content: '  easter     - Show Easter banner', type: 'output' },
        { content: '  newyear    - Show New Year banner', type: 'output' },
        { content: '  halloween  - Show Halloween banner', type: 'output' },
        { content: '  piday      - Show Pi Day banner', type: 'output' },
        { content: '  reset      - Reset to automatic mode', type: 'output' }
      ]);
      return;
    }

    const mode = args[0].toLowerCase();
    const validModes = ['christmas', 'pride', 'easter', 'newyear', 'halloween', 'piday', 'reset'];

    if (!validModes.includes(mode)) {
      setLines(prev => [
        ...prev,
        { content: `Invalid mode: ${mode}`, type: 'output' },
        { content: 'Valid modes: ' + validModes.join(', '), type: 'output' }
      ]);
      return;
    }

    // Call the global setHoliday function
    window.setHoliday?.(mode === 'reset' ? null : mode);

    setLines(prev => [
      ...prev,
      { content: mode === 'reset' 
        ? '🔄 Reset to automatic holiday mode'
        : `🎉 Holiday mode set to: ${mode}. Close the terminal to see your work.`, type: 'output' }
    ]);
  }
};