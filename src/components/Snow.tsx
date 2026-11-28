import { useMemo } from 'react';

// Lett snøfall for julemodus. Rent CSS, så det koster nesten ingenting å kjøre.
// Ligger over innholdet, men tar ikke imot klikk, og skjules for skjermlesere og for dem som har bedt om mindre bevegelse.
export function Snow({ count = 90 }: { count?: number }) {
  const flakes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const size = 3 + Math.random() * 5;
        return {
          id: i,
          left: Math.random() * 100,
          size,
          opacity: 0.5 + Math.random() * 0.4,
          // Små fnugg faller saktere, så det ser ut som de er lenger unna.
          duration: 14 + (8 - size) * 2.5 + Math.random() * 6,
          delay: -Math.random() * 30,
          sway: 10 + Math.random() * 30,
          swayDuration: 3 + Math.random() * 3,
          hideOnSmall: i % 2 === 1,
        };
      }),
    [count]
  );

  return (
    <div className="snow pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {flakes.map((f) => (
        <div
          key={f.id}
          className={`snow__fall ${f.hideOnSmall ? 'max-sm:hidden' : ''}`}
          style={{
            left: `${f.left}%`,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
          }}
        >
          <div
            className="snow__flake"
            style={{
              width: f.size,
              height: f.size,
              opacity: f.opacity,
              ['--sway' as string]: `${f.sway}px`,
              animationDuration: `${f.swayDuration}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
