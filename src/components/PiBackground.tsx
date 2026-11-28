import { useLayoutEffect, useRef, useState } from 'react';
import { piDigits } from '../utils/piDigits';

// På pi-dagen fylles bakgrunnen av π, med nøyaktig så mange desimaler som får plass i vinduet.
// Ligger bak innholdet og er dempet, men lesbar. Regnes ut på nytt når vinduet blir større.
const MAX_DECIMALS = 30000;
// Sifrene starter rett under menyen, så «3.14159…» er det første man ser. Samme høyde som pt-20 på <main>.
const TOP_OFFSET = 80;

export function PiBackground() {
  const probeRef = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState('');

  useLayoutEffect(() => {
    const fill = () => {
      const probe = probeRef.current;
      if (!probe) return;
      const rect = probe.getBoundingClientRect();
      const charWidth = rect.width / 10;
      const lineHeight = rect.height;
      if (!charWidth || !lineHeight) return;
      const columns = Math.floor(window.innerWidth / charWidth);
      const rows = Math.ceil((window.innerHeight - TOP_OFFSET) / lineHeight);
      setText(piDigits(Math.min(columns * rows - 2, MAX_DECIMALS)));
    };
    fill();
    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(fill, 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const font = 'font-mono text-[15px] sm:text-[22px] leading-[1.5] tracking-[0.12em]';

  return (
    <div
      aria-hidden="true"
      className={`pi-background pointer-events-none fixed inset-0 -z-10 select-none pt-20 overflow-hidden break-all text-custom-dark/[0.13] dark:text-white/[0.09] ${font}`}
    >
      <span ref={probeRef} className={`invisible absolute left-0 top-0 whitespace-nowrap ${font}`}>
        0123456789
      </span>
      {/* «3.14» i starten står tydeligere, så man ser med en gang hva tallene er. */}
      <span className="font-bold text-custom-dark/40 dark:text-white/40">{text.slice(0, 4)}</span>
      {text.slice(4)}
    </div>
  );
}
