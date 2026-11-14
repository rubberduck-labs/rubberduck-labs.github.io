import { track } from './track.ts';

// Track only names from the command registry, never arguments or unknown input.
export function trackTerminalCommand(
  command: string,
  knownCommands: readonly string[],
  executableCommand?: string | null,
) {
  if (!command) return;

  const label = knownCommands.includes(command)
    ? command
    : executableCommand && knownCommands.includes(executableCommand)
      ? executableCommand
      : 'unknown';
  track('terminal_command', label);
}
