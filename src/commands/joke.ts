import { Command } from './types';

async function fetchJoke(): Promise<string> {
  const response = await fetch('https://geek-jokes.sameerkumar.website/api');
  return response.text();
}

export const jokeCommand: Command = {
  name: 'joke',
  description: 'Tell a geeky joke',
  execute: async (_, { setLines }) => {
    try {
      setLines(prev => [...prev, { content: 'Fetching a geeky joke...', type: 'output' }]);
      const joke = await fetchJoke();
      setLines(prev => [...prev, { content: joke, type: 'output' }]);
    } catch (error) {
      setLines(prev => [...prev, { content: 'Error fetching joke. Please try again later.', type: 'output' }]);
    }
  }
};