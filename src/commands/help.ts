import { Command } from './types';
import { commands } from './index';

export const helpCommand: Command = {
  name: 'help',
  description: 'Show this help message',
  execute: async (_, { setLines }) => {
    const builtinCommands = [
      { name: 'cd', description: 'Change current directory' },
      { name: 'ls', description: 'List directory contents' },
      { name: 'cat', description: 'Print file contents' },
      { name: 'clear', description: 'Clear the terminal' },
      { name: 'exit', description: 'Close the terminal' },
      { name: 'help', description: 'Show this help message' }
    ];

    setLines(prev => [
      ...prev,
      { content: 'Available commands:', type: 'output' },
      ...builtinCommands.map(cmd => ({
        content: `  ${cmd.name.padEnd(18)} - ${cmd.description}`,
        type: 'output' as const
      }))
    ]);
  }
};