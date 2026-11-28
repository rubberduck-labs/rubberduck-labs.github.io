import { useEffect, useRef } from 'react';

// Fyrverkeri over hele vinduet i nyttårsmodus. Raketter skytes opp fra bunnen og smeller rundt om på siden.
// Tegnes på et lerret bak innholdet, så teksten alltid er lesbar. Står stille for dem som har bedt om mindre bevegelse.
const COLORS = ['#fde047', '#f472b6', '#60a5fa', '#34d399', '#fb923c', '#ffffff', '#c084fc', '#f87171'];
const GRAVITY = 260;

type Rocket = { x: number; y: number; vx: number; vy: number; color: string };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string; size: number };

const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

export function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const rockets: Rocket[] = [];
    const sparks: Spark[] = [];
    let untilLaunch = 0.2;
    let last = performance.now();
    let frame = 0;

    const launch = () => {
      const targetY = h * (0.08 + Math.random() * 0.5);
      rockets.push({
        x: w * (0.05 + Math.random() * 0.9),
        y: h + 10,
        vx: (Math.random() - 0.5) * 60,
        vy: -Math.sqrt(2 * GRAVITY * (h + 10 - targetY)),
        color: pick(COLORS),
      });
    };

    const explode = (r: Rocket) => {
      const count = 70 + Math.floor(Math.random() * 50);
      const speed = 140 + Math.random() * 150;
      const second = Math.random() < 0.35 ? pick(COLORS) : r.color;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.2;
        const s = speed * (0.55 + Math.random() * 0.45);
        const max = 1.3 + Math.random() * 0.9;
        sparks.push({
          x: r.x,
          y: r.y,
          vx: Math.cos(angle) * s,
          vy: Math.sin(angle) * s,
          life: max,
          max,
          color: i % 3 === 0 ? second : r.color,
          size: 1.6 + Math.random() * 1.6,
        });
      }
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // Visk ut litt av forrige bilde i stedet for alt, så gnistene får korte haler.
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      untilLaunch -= dt;
      if (untilLaunch <= 0) {
        launch();
        if (w > 900 && Math.random() < 0.55) launch();
        if (w > 1300 && Math.random() < 0.3) launch();
        untilLaunch = (w > 640 ? 0.3 : 0.55) + Math.random() * 0.5;
      }

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.vy += GRAVITY * dt;
        r.x += r.vx * dt;
        r.y += r.vy * dt;
        ctx.fillStyle = r.color;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
        ctx.fill();
        if (r.vy >= -30) {
          explode(r);
          rockets.splice(i, 1);
        }
      }

      const drag = Math.pow(0.97, dt * 60);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= dt;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        s.vx *= drag;
        s.vy = s.vy * drag + 90 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        ctx.globalAlpha = Math.min(1, (s.life / s.max) * 1.5);
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 -z-10 h-full w-full" aria-hidden="true" />;
}
