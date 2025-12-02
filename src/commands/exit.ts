import { Command } from './types';

export const exitCommand: Command = {
  name: 'exit',
  description: 'Close the terminal',
  execute: async (_, { onClose }) => {
    if (onClose) onClose();
  }
};