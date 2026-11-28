// En lysslynge som går i spiral rundt lampefoten i julemodus, tegnet i samme strekstil som resten av scenen.
// Delen av tråden som går bak foten er svak, delen foran er hel, så man ser at den går rundt.
// Pærene er av i lys modus og lyser når lampen er på (mørk modus), se .xmas-bulb i index.css.
const WIDTH = 40;
const HEIGHT = 254;
const CENTER = WIDTH / 2;
const RADIUS = 11;
const TOP = 8;
const BOTTOM = 232;
const TURNS = 4.5;
const COLORS = ['#ef4444', '#22c55e', '#facc15', '#3b82f6'];
const BULBS = 15;

// Et punkt på spiralen. t går fra 0 (øverst) til 1 (nederst). Litt ekstra slakk midt mellom vindingene gjør at tråden henger.
function point(t: number) {
  const angle = t * TURNS * Math.PI * 2;
  return {
    x: CENTER + RADIUS * Math.sin(angle),
    y: TOP + t * (BOTTOM - TOP) + 2.5 * Math.sin(angle * 2) ** 2,
    front: Math.cos(angle) > 0,
  };
}

// Tråden deles i biter foran og bak foten.
const segments: { d: string; front: boolean }[] = [];
const STEPS = 400;
for (let i = 0; i <= STEPS; i++) {
  const p = point(i / STEPS);
  const last = segments[segments.length - 1];
  if (!last || last.front !== p.front) {
    segments.push({ d: `M${p.x.toFixed(2)} ${p.y.toFixed(2)}`, front: p.front });
  } else {
    last.d += ` L${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  }
}

// Pærene henger jevnt fordelt langs tråden, men bare på delen foran foten.
const bulbs = Array.from({ length: BULBS * 2 }, (_, i) => point((i + 0.5) / (BULBS * 2)))
  .filter((p) => p.front)
  .map((p, i) => ({
    ...p,
    color: COLORS[i % COLORS.length],
    // Pæra peker litt ut fra foten, som om den henger fritt.
    tilt: ((p.x - CENTER) / RADIUS) * 25,
    duration: 1.6 + ((i * 7) % 5) * 0.35,
    delay: -((i * 3) % 7) * 0.4,
  }));

export function ChristmasLights() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 overflow-visible"
    >
      {segments.map((s, i) => (
        <path
          key={i}
          d={s.d}
          fill="none"
          stroke="#000"
          strokeWidth={s.front ? 1.4 : 1}
          strokeOpacity={s.front ? 1 : 0.3}
          strokeLinecap="round"
        />
      ))}
      {bulbs.map((b, i) => (
        <g key={i} transform={`translate(${b.x.toFixed(2)} ${b.y.toFixed(2)}) rotate(${b.tilt.toFixed(1)})`} style={{ color: b.color }}>
          {/* Sokkel */}
          <rect x="-1.6" y="0" width="3.2" height="3" rx="0.6" fill="#000" />
          {/* Pære som en dråpe som peker nedover */}
          <path
            className="xmas-bulb"
            d="M0 2.5 C3.4 2.5 3.6 6.5 2.4 8.6 C1.6 10 0.6 11 0 11.6 C-0.6 11 -1.6 10 -2.4 8.6 C-3.6 6.5 -3.4 2.5 0 2.5 Z"
            stroke="#000"
            strokeWidth="0.9"
            style={{ animationDuration: `${b.duration}s`, animationDelay: `${b.delay}s` }}
          />
        </g>
      ))}
    </svg>
  );
}
