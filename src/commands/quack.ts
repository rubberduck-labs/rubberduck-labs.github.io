import { Command } from './types';

export const quackCommand: Command = {
  name: 'quack',
  description: 'Make the duck quack',
  execute: async (_, { setLines }) => {
    setLines(prev => [...prev, { content: '🦆 Quack! Quack!', type: 'output' }]);
  }
};