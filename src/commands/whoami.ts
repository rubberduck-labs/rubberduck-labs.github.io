import { Command } from './types';

export const whoamiCommand: Command = {
  name: 'whoami',
  description: 'Display current user',
  execute: async (_, { setLines }) => {
    setLines(prev => [...prev, { content: 'rubberduck', type: 'output' }]);
  }
};