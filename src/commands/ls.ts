import { Command } from './types';

const files = {
  'README': 'Ask me about loom'
};

export const lsCommand: Command = {
  name: 'ls',
  description: 'List directory contents',
  execute: async (_, { setLines }) => {
    setLines(prev => [
      ...prev,
      { 
        content: Object.keys(files).join('\n'),
        type: 'output'
      }
    ]);
  }
};