import { TerminalLine } from '../components/Terminal';

export interface CommandContext {
  setLines: (fn: (prev: TerminalLine[]) => TerminalLine[]) => void;
  setBackgroundColor?: (color: string | null) => void;
  onClose?: () => void;
}

export interface Command {
  name: string;
  description: string;
  execute: (args: string[], context: CommandContext) => Promise<void>;
}