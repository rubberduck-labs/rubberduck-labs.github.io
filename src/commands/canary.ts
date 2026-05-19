import { Command } from './types';

export const canaryCommand: Command = {
  name: 'canary',
  description: 'Unlock canary features',
  execute: async (_, { setLines }) => {
    localStorage.setItem('canary', 'true');
    setLines(prev => [
      ...prev,
      { content: '🐤 Canary mode aktivert. Refresh for å se nye funksjoner.', type: 'output' },
    ]);
  },
};
