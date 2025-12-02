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

export function Terminal({ isOpen, onClose, setBackgroundColor }: TerminalProps) {
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
  const inputRef = useRef<HTMLInputElement>(null);
  const fsRef = useRef<FileSystemManager>(new FileSystemManager(terminalConfig));

  const initialLines = [
    'Welcome to RubberDuck OS v2.0.25',
    '> Loading development environment...',
    '> Initializing duck protocols...',
    '> Quack! Ready for debugging...',
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

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    if (!isInitializing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInitializing]);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput);
      setCurrentInput('');
      setCompletions([]);
      setCompletionIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      
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
    } else {
      // Reset completions when typing
      setCompletions([]);
      setCompletionIndex(-1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <div 
        ref={terminalRef}
        className="bg-zinc-900 w-full max-w-4xl rounded-lg shadow-2xl overflow-hidden"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? 'grabbing' : 'default'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Terminal header */}
        <div 
          className="terminal-header flex items-center justify-between px-4 py-2 bg-zinc-800 border-b border-zinc-700 cursor-grab active:cursor-grabbing"
        >
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-zinc-400" />
            <span className="text-sm text-zinc-400">rubberduck@dev</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-700 rounded-md transition-colors"
          >
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
        
        {/* Terminal content */}
        <div 
          className="p-4 font-mono text-sm h-[500px] overflow-y-auto"
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
                className="flex-1 bg-transparent outline-none ml-1 text-yellow-400"
                autoFocus
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
      </div>
    </div>
  );
}