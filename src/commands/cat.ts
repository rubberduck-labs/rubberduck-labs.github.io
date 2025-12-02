import { Command } from './types';

const files = {
  'README': 'Ask me about loom'
};

export const catCommand: Command = {
  name: 'cat',
  description: 'Print file contents',
  execute: async (args, { setLines }) => {
    if (args.length === 0) {
      setLines(prev => [...prev, { content: 'Usage: cat <filename>', type: 'output' }]);
      return;
    }

    const filename = args[0];
    // Find the file case-insensitively
    const actualFilename = Object.keys(files).find(
      f => f.toLowerCase() === filename.toLowerCase()
    );
    const content = actualFilename ? files[actualFilename] : null;

    if (content) {
      setLines(prev => [...prev, { content, type: 'output' }]);
    } else {
      setLines(prev => [...prev, { content: `cat: ${filename}: No such file or directory`, type: 'output' }]);
    }
  }
};