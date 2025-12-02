import { Command } from './types';

const pastelColors = [
  { name: 'Soft Pink', hex: '#FFD1DC' },
  { name: 'Baby Blue', hex: '#BFDFFF' },
  { name: 'Mint Green', hex: '#98FF98' },
  { name: 'Lavender', hex: '#E6E6FA' },
  { name: 'Peach', hex: '#FFDAB9' },
  { name: 'Pale Yellow', hex: '#FFFACD' },
  { name: 'Light Coral', hex: '#F08080' },
  { name: 'Sky Blue', hex: '#87CEEB' }
];

const applyColor = (color: string, fontName: string, setLines: (fn: (prev: any[]) => any[]) => void, setBackgroundColor: (color: string | null) => void) => {
  // First check if we're in dark mode and switch to light mode if needed
  if (document.documentElement.classList.contains('dark')) {
    const darkModeButton = document.querySelector('button[aria-label="Toggle dark mode"]');
    if (darkModeButton instanceof HTMLButtonElement) {
      darkModeButton.click();
    }
  }
  
  setBackgroundColor(color);
  
  // Convert hex to RGB for nav background
  const rgbColor = hexToRgb(color);
  if (rgbColor) {
    // Set the nav background color with proper opacity
    const navBg = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.9)`;
    document.documentElement.style.setProperty('--nav-bg', navBg);
  }
  
  setLines(prev => [...prev, { content: `Background color changed to ${color}`, type: 'output' }]);
};

export const bgcolorCommand: Command = {
  name: 'bgcolor',
  description: 'Change background color (e.g., bgcolor #ff0000) or reset it',
  execute: async (args, { setLines, setBackgroundColor }) => {
    if (!setBackgroundColor) {
      setLines(prev => [...prev, { content: 'Background color control not available', type: 'output' }]);
      return;
    }

    // Add click handler to document if not already added
    if (!window.colorClickHandler) {
      window.colorClickHandler = (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.matches('[data-color]')) {
          e.preventDefault();
          const color = target.getAttribute('data-color');
          if (color) {
            applyColor(color, target.textContent || '', setLines, setBackgroundColor);
          }
        }
      };
      document.addEventListener('click', window.colorClickHandler);
    }

    if (args.length === 0) {
      setLines(prev => [
        ...prev,
        { content: 'Try one of these pastel colors:', type: 'output' },
        ...pastelColors.map(color => ({
          content: `<a href="#" data-color="${color.hex}" style="color: ${color.hex}; text-decoration: underline">${color.name}: ${color.hex}</a>`,
          type: 'output' as const
        })),
        { content: '\nUsage: bgcolor <color> or bgcolor reset', type: 'output' }
      ]);
      return;
    }

    if (args[0] === 'reset') {
      setBackgroundColor(null);
      document.documentElement.style.setProperty('--nav-bg', 'rgba(253, 224, 71, 0.9)');
      setLines(prev => [...prev, { content: 'Background color reset to default', type: 'output' }]);
      return;
    }

    const color = args[0];
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
      applyColor(color, color, setLines, setBackgroundColor);
    } else {
      setLines(prev => [...prev, { content: 'Error: Invalid color format. Use hex format (e.g., #ff0000)', type: 'output' }]);
    }
  }
};

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Add type declaration for window
declare global {
  interface Window {
    colorClickHandler?: (e: Event) => void;
  }
}