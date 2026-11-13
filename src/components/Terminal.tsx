import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X } from 'lucide-react';
import { commands } from '../commands';
import { FileSystemManager } from '../utils/filesystem';
import terminalConfig from '../terminal.json';

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
  setBackgroundColor: (color: string | null) => void;
}

export interface TerminalLine {
  content: string;
  type: 'input' | 'output';
}

// Smal skjerm: terminalen fyller hele skjermen i stedet for å være et flytende vindu.
function useIsNarrow(): boolean {
  const [narrow, setNarrow] = useState(() => window.matchMedia('(max-width: 639px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => setNarrow(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return narrow;
}

// Når tastaturet er oppe på iPhone, krymper den synlige delen av siden. Terminalen følger den, så inputlinjen ikke havner bak tastaturet.
function useVisualViewport(active: boolean): { top: number; height: number } | null {
  const [box, setBox] = useState<{ top: number; height: number } | null>(null);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!active || !vv) {
      setBox(null);
      return;
    }
    const update = () => setBox({ top: vv.offsetTop, height: vv.height });
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, [active]);
  return box;
}

// Snarveier på smale skjermer, der det er tungt å skrive.
const QUICK_COMMANDS = ['help', 'ls', 'whoami', 'quack', 'joke', 'weather', 'clear', 'exit'];

export function Terminal({ isOpen, onClose, setBackgroundColor }: TerminalProps) {
  const narrow = useIsNarrow();
  const viewport = useVisualViewport(isOpen && narrow);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [completions, setCompletions] = useState<string[]>([]);
  const [completionIndex, setCompletionIndex] = useState(-1);
  const [lastTabInput, setLastTabInput] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const terminalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fsRef = useRef<FileSystemManager>(new FileSystemManager(terminalConfig));

  const initialLines = [
    'Welcome to RubberDuck OS v2.0.25',
    '> Loading development environment...',
    '> Initializing duck protocols...',
  ];

  useEffect(() => {
    if (!isOpen) {
      setLines([]);
      setCurrentInput('');
      setIsInitializing(true);
      // Reset position when terminal is closed
      setPosition({ x: 0, y: 0 });
      return;
    }

    let currentLine = 0;
    const typeInterval = setInterval(() => {
      if (currentLine >= initialLines.length) {
        clearInterval(typeInterval);
        setIsInitializing(false);
        return;
      }

      setLines(prev => [...prev, { content: initialLines[currentLine], type: 'output' }]);
      currentLine++;
    }, 100);

    return () => clearInterval(typeInterval);
  }, [isOpen]);

  // Rull innholdsboksen (den som faktisk har overflow-y-auto), ikke det ytre vinduet.
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [lines, isInitializing, completions]);

  useEffect(() => {
    if (!isInitializing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInitializing]);

  // Siden bak skal ikke rulle mens terminalen er åpen på mobil.
  useEffect(() => {
    if (!isOpen || !narrow) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen, narrow]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.closest('.terminal-header')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Keep terminal within viewport bounds
      const terminalWidth = terminalRef.current?.offsetWidth || 0;
      const terminalHeight = terminalRef.current?.offsetHeight || 0;
      const maxX = window.innerWidth - terminalWidth;
      const maxY = window.innerHeight - terminalHeight;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    // Add global mouse event listeners when dragging
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        const terminalWidth = terminalRef.current?.offsetWidth || 0;
        const terminalHeight = terminalRef.current?.offsetHeight || 0;
        const maxX = window.innerWidth - terminalWidth;
        const maxY = window.innerHeight - terminalHeight;
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
      };

      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const handleCommand = async (input: string) => {
    const fs = fsRef.current;
    const prompt = fs.getPrompt();
    setLines(prev => [...prev, { content: `${prompt} ${input}`, type: 'input' }]);
    setCommandHistory(prev => [...prev, input]);
    setHistoryIndex(-1);

    const args = input.trim().split(/\s+/);
    const cmd = args[0].toLowerCase();

    // Handle built-in commands first
    switch (cmd) {
      case 'cd':
        if (args.length < 2) {
          setLines(prev => [...prev, { content: 'cd: missing directory', type: 'output' }]);
          return;
        }
        if (!fs.changeDirectory(args[1])) {
          setLines(prev => [...prev, { content: `cd: ${args[1]}: No such directory`, type: 'output' }]);
        }
        return;

      case 'ls':
        const dirPath = args[1] || '.';
        const dirContents = fs.listDirectory(dirPath);
        if (dirContents === null) {
          setLines(prev => [...prev, { content: `ls: ${dirPath}: No such directory`, type: 'output' }]);
        } else {
          setLines(prev => [...prev, { content: dirContents.join('\n'), type: 'output' }]);
        }
        return;

      case 'cat':
        if (args.length < 2) {
          setLines(prev => [...prev, { content: 'cat: missing file operand', type: 'output' }]);
          return;
        }
        const fileContents = fs.readFile(args[1]);
        if (fileContents === null) {
          setLines(prev => [...prev, { content: `cat: ${args[1]}: No such file`, type: 'output' }]);
        } else {
          setLines(prev => [...prev, { content: fileContents.join('\n'), type: 'output' }]);
        }
        return;
    }

    // Check if it's an executable file
    if (fs.isExecutable(cmd)) {
      const actualCommand = fs.getCommandForExecutable(cmd);
      if (actualCommand && commands[actualCommand]) {
        await commands[actualCommand].execute(args.slice(1), { 
          setLines, 
          setBackgroundColor, 
          onClose 
        });
        return;
      }
    }

    // Fall back to direct command execution
    const command = commands[cmd];
    if (command) {
      await command.execute(args.slice(1), { 
        setLines, 
        setBackgroundColor, 
        onClose 
      });
    } else if (input.trim() !== '') {
      setLines(prev => [
        ...prev,
        { content: `Command not found: ${cmd}`, type: 'output' },
        { content: 'Type "help" for available commands', type: 'output' },
      ]);
    }
  };

  const historyPrev = () => {
    if (historyIndex < commandHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
    }
  };

  const historyNext = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
    } else if (historyIndex === 0) {
      setHistoryIndex(-1);
      setCurrentInput('');
    }
  };

  const doTab = () => {
    // If this is a new tab press, get completions
    if (currentInput !== lastTabInput) {
      const newCompletions = fsRef.current.getCompletions(currentInput);
      setCompletions(newCompletions);
      setCompletionIndex(0);
      setLastTabInput(currentInput);

      // If there's exactly one completion, use it
      if (newCompletions.length === 1) {
        const parts = currentInput.split(' ');
        parts[parts.length - 1] = newCompletions[0];
        setCurrentInput(parts.join(' '));
        setCompletions([]);
        setCompletionIndex(-1);
      }
    } else if (completions.length > 0) {
      // Cycle through completions
      const newIndex = (completionIndex + 1) % completions.length;
      setCompletionIndex(newIndex);

      const parts = currentInput.split(' ');
      parts[parts.length - 1] = completions[newIndex];
      setCurrentInput(parts.join(' '));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput);
      setCurrentInput('');
      setCompletions([]);
      setCompletionIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      historyPrev();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      historyNext();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      doTab();
    } else {
      // Reset completions when typing
      setCompletions([]);
      setCompletionIndex(-1);
    }
  };

  // Snarvei-knappene kjører en kommando uten at tastaturet går ned.
  const runQuick = (cmd: string) => {
    if (isInitializing) return;
    handleCommand(cmd);
    setCurrentInput('');
    setCompletions([]);
    setCompletionIndex(-1);
    inputRef.current?.focus();
  };
  const keepFocus = (e: React.SyntheticEvent) => e.preventDefault();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 max-sm:p-0 max-sm:items-stretch z-[100]"
      style={narrow && viewport ? { top: viewport.top, height: viewport.height, bottom: 'auto' } : undefined}
    >
      <div 
        ref={terminalRef}
        role="dialog"
        aria-label="Terminal"
        className="bg-zinc-900 w-full max-w-4xl rounded-lg shadow-2xl overflow-hidden max-sm:max-w-none max-sm:rounded-none max-sm:shadow-none max-sm:flex max-sm:flex-col"
        style={{
          transform: narrow ? undefined : `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? 'grabbing' : 'default'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Terminal header */}
        <div 
          className="terminal-header flex items-center justify-between px-4 py-2 max-sm:pt-[max(0.5rem,env(safe-area-inset-top))] bg-zinc-800 border-b border-zinc-700 cursor-grab max-sm:cursor-default active:cursor-grabbing"
        >
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-zinc-400" />
            <span className="text-sm text-zinc-400">rubberduck@dev</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Lukk terminalen"
            className="p-1 max-sm:p-3 max-sm:-mr-2 hover:bg-zinc-700 rounded-md transition-colors"
          >
            <X className="w-4 h-4 max-sm:w-5 max-sm:h-5 text-zinc-400" />
          </button>
        </div>
        
        {/* Terminal content */}
        <div 
          ref={contentRef}
          className="p-4 font-mono text-sm h-[500px] max-h-[calc(100dvh-8rem)] overflow-y-auto max-sm:h-auto max-sm:max-h-none max-sm:flex-1 max-sm:min-h-0 max-sm:overscroll-contain"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line, index) => (
            <div 
              key={index} 
              className="whitespace-pre-wrap text-yellow-400"
              dangerouslySetInnerHTML={{ __html: line.content }}
            />
          ))}
          {!isInitializing && (
            <div className="flex items-center text-yellow-400">
              <span>{fsRef.current.getPrompt()} </span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 min-w-0 bg-transparent outline-none ml-1 text-yellow-400 max-sm:text-[16px]"
                autoFocus
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="go"
                aria-label="Kommando"
              />
            </div>
          )}
          {/* Completions display */}
          {completions.length > 1 && (
            <div className="mt-2 text-zinc-400">
              {completions.map((completion, index) => (
                <span 
                  key={completion}
                  className={`mr-4 ${index === completionIndex ? 'text-yellow-400' : ''}`}
                >
                  {completion}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Snarveier: bare på smale skjermer. Knappene tar ikke fokus fra inputfeltet, så tastaturet blir oppe. */}
        <div
          className="sm:hidden flex shrink-0 items-center gap-2 overflow-x-auto bg-zinc-800 border-t border-zinc-700 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="toolbar"
          aria-label="Snarveier"
        >
          <button
            type="button"
            onMouseDown={keepFocus}
            onClick={() => { doTab(); inputRef.current?.focus(); }}
            aria-label="Fullfør med Tab"
            className="shrink-0 rounded-full border border-yellow-400/60 px-3 py-1.5 font-mono text-sm text-yellow-400 active:bg-yellow-400/20"
          >
            Tab
          </button>
          <button
            type="button"
            onMouseDown={keepFocus}
            onClick={() => { historyPrev(); inputRef.current?.focus(); }}
            aria-label="Forrige kommando"
            className="shrink-0 rounded-full border border-zinc-600 px-3 py-1.5 font-mono text-sm text-zinc-300 active:bg-zinc-700"
          >
            ↑
          </button>
          {QUICK_COMMANDS.map((cmd) => (
            <button
              key={cmd}
              type="button"
              onMouseDown={keepFocus}
                onClick={() => runQuick(cmd)}
              className="shrink-0 rounded-full bg-zinc-700 px-3 py-1.5 font-mono text-sm text-yellow-300 active:bg-zinc-600"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}