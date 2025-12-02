import { Command } from './types';

const fonts = [
  { name: 'System Default', value: 'system-ui, -apple-system, sans-serif' },
  { name: 'Serif', value: 'Georgia, serif' },
  { name: 'Sans Serif', value: 'Arial, sans-serif' },
  { name: 'Monospace', value: 'Monaco, monospace' },
  { name: 'Papyrus', value: 'Papyrus, fantasy' },
  { name: 'Comic Sans', value: '"Comic Sans MS", "Comic Sans", "Chalkboard SE", "Comic Neue", cursive' }
];

const applyFont = (fontFamily: string, fontName: string, setLines: (fn: (prev: any[]) => any[]) => void) => {
  // First remove any existing font
  document.documentElement.style.removeProperty('--font-family');
  
  // Force a reflow
  void document.documentElement.offsetHeight;
  
  // Then apply the new font
  document.documentElement.style.setProperty('--font-family', fontFamily);
  
  // Wait a bit to ensure the font has time to load
  setTimeout(() => {
    const computedFont = getComputedStyle(document.documentElement).getPropertyValue('--font-family');
    if (computedFont) {
      setLines(prev => [...prev, { content: `Font changed to ${fontName}`, type: 'output' }]);
      // Add special message for Comic Sans
      if (fontName === 'Comic Sans') {
        setLines(prev => [...prev, { content: '<span style="color: #16a34a">Yikes! 🫣</span>', type: 'output' }]);
      }
      // Add special message for Papyrus
      if (fontName === 'Papyrus') {
        setLines(prev => [...prev, { 
          content: '<span style="color: #16a34a"><a href="https://www.youtube.com/watch?v=jVhlJNJopOQ" target="_blank" style="text-decoration: underline">It was tribal yet futuristic.</a></span>', 
          type: 'output' 
        }]);
      }
    } else {
      setLines(prev => [...prev, { content: `Warning: Font ${fontName} may not be available on your system`, type: 'output' }]);
    }
  }, 100);
};

export const fontCommand: Command = {
  name: 'font',
  description: 'Change page font (e.g., font serif) or reset it',
  execute: async (args, { setLines }) => {
    // Initialize click handler if not already done
    if (!window.fontClickHandler) {
      const handler = (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.matches('a[data-font]')) {
          e.preventDefault();
          e.stopPropagation();
          const fontFamily = target.getAttribute('data-font');
          const fontName = target.getAttribute('data-name');
          if (fontFamily && fontName) {
            applyFont(fontFamily, fontName, setLines);
          }
        }
      };

      // Remove existing handler if any
      document.removeEventListener('click', window.fontClickHandler as any);

      // Add new handler
      window.fontClickHandler = handler;
      document.addEventListener('click', handler);
    }

    if (args.length === 0) {
      setLines(prev => [
        ...prev,
        { content: 'Available fonts:', type: 'output' },
        ...fonts.map(font => ({
          content: `<a href="#" data-font='${font.value}' data-name="${font.name}" style="color: #fde047; text-decoration: underline; cursor: pointer; font-family: ${font.value}; display: inline-block; padding: 4px 0;">${font.name}</a>`,
          type: 'output' as const
        })),
        { content: '\nUsage: font <name> or font reset', type: 'output' }
      ]);
      return;
    }

    if (args[0] === 'reset') {
      document.documentElement.style.removeProperty('--font-family');
      setLines(prev => [...prev, { content: 'Font reset to default', type: 'output' }]);
      return;
    }

    const fontName = args.join(' ').toLowerCase();
    const font = fonts.find(f => f.name.toLowerCase() === fontName);
    
    if (font) {
      applyFont(font.value, font.name, setLines);
    } else {
      setLines(prev => [
        ...prev, 
        { content: `Font "${args.join(' ')}" not found. Available fonts: ${fonts.map(f => f.name).join(', ')}`, type: 'output' }
      ]);
    }
  }
};

// Add type declaration for window
declare global {
  interface Window {
    fontClickHandler?: (e: Event) => void;
  }
}