import { forwardRef, useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { bookChapters } from './chapters';
import { BlockRenderer, ManuscriptCover, ManuscriptPage } from './ManuscriptPage';

const chapterLinks = [
  { chapter: 'introduction', title: 'Introduksjon' },
  { chapter: 'values', title: 'Våre verdier' },
  { chapter: 'salaryBenefits', title: 'Lønn og goder' },
] as const;

// Tom side, så boka får et partall sider og baksiden havner bakerst.
const BlankPage = forwardRef<HTMLDivElement>(function BlankPage(_props, ref) {
  return (
    <ManuscriptPage ref={ref} shields={false}>
      <span />
    </ManuscriptPage>
  );
});

export default function FlipBook() {
  const book = useRef<{ pageFlip: () => { flipNext: () => void; flipPrev: () => void; turnToPage: (n: number) => void; flip: (n: number) => void } } | null>(null);
  const [page, setPage] = useState(0);
  const [resting, setResting] = useState(true); // false mens en side blir vendt
  const [landscape, setLandscape] = useState(() => window.innerWidth >= 700);
  useEffect(() => {
    const onResize = () => setLandscape(window.innerWidth >= 700);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const pages = [
    ...bookChapters.frontMatter,
    ...bookChapters.introduction,
    ...bookChapters.values,
    ...bookChapters.salaryBenefits,
  ];

  // Første side i hvert kapittel, regnet fra omslaget (som er side 0).
  const chapterStart: Record<string, number> = {};
  let offset = 1;
  for (const [key, list] of Object.entries(bookChapters)) {
    chapterStart[key] = offset;
    offset += list.length;
  }

  const children: ReactElement[] = [<ManuscriptCover key="cover" />];
  pages.forEach((p, i) => {
    children.push(
      <ManuscriptPage key={i} side={i % 2 === 0 ? 'left' : 'right'} folio={p.isSpecial ? undefined : i + 1} coffee={i === pages.length - 1} variant={i + 1}>
        <BlockRenderer page={p} />
      </ManuscriptPage>,
    );
  });
  // Omslag + sider + tom side (om nødvendig) + bakside skal bli et partall.
  if ((children.length + 1) % 2 !== 0) children.push(<BlankPage key="blank" />);
  children.push(<ManuscriptCover key="back" title="Rubberduck" subtitle="Slutt" />);

  const last = children.length - 1;
  // På mobil styrer biblioteket ikke lenger berøring, for da ble et trykk eller en liten sidebevegelse mens man rullet
  // teksten til et sidebytte. I stedet blar et tydelig sidelengs sveip, og vertikale bevegelser får bare rulle.
  const touch = useRef<{ x: number; y: number; t: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const p = e.touches[0];
    touch.current = { x: p.clientX, y: p.clientY, t: Date.now() };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (landscape || !start) return;
    const p = e.changedTouches[0];
    const dx = p.clientX - start.x;
    const dy = p.clientY - start.y;
    if (Math.abs(dx) > 60 && Math.abs(dy) < 40 && Math.abs(dx) > Math.abs(dy) * 2.5 && Date.now() - start.t < 700) {
      if (dx < 0) book.current?.pageFlip().flipNext();
      else book.current?.pageFlip().flipPrev();
    }
  };

  // turnToPage hopper rett til siden uten å melde fra, så tilstanden settes her.
  const goTo = (n: number) => {
    book.current?.pageFlip().turnToPage(n);
    setPage(n);
    setResting(true);
  };
  const btn =
    'inline-flex h-10 w-10 items-center justify-center rounded-full bg-custom-dark text-yellow-400 shadow disabled:opacity-40 dark:bg-white dark:text-custom-dark';

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Lukket bok viser bare én side, og den står på halvdelen av oppslaget. Flytt den så den står midt på siden. */}
      <div style={{ overflowY: 'clip', overflowX: 'visible' }}>
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="flex justify-center transition-transform duration-700 ease-in-out"
        style={{ transform: landscape ? `translateX(${resting && page === 0 ? '-25%' : resting && page >= last ? '25%' : '0'})` : undefined }}
      >
        <HTMLFlipBook
          key={landscape ? 'spread' : 'single'}
          ref={book as never}
          width={420}
          height={600}
          size="stretch"
          minWidth={280}
          maxWidth={520}
          minHeight={400}
          maxHeight={740}
          showCover
          maxShadowOpacity={0.45}
          drawShadow
          flippingTime={900}
          usePortrait
          startZIndex={0}
          autoSize
          clickEventForward={landscape}
          useMouseEvents={landscape}
          swipeDistance={30}
          showPageCorners
          disableFlipByClick={false} // useMouseEvents={false} på mobil stopper trykk. Denne må stå av, ellers avviser biblioteket flipPrev().
          mobileScrollSupport
          startPage={page}
          className="book-shadow"
          style={{}}
          onFlip={(e: { data: number }) => setPage(e.data)}
          onChangeState={(e: { data: string }) => setResting(e.data === 'read')}
        >
          {children}
        </HTMLFlipBook>
      </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button type="button" className={btn} aria-label="Forrige side" disabled={page === 0} onClick={() => book.current?.pageFlip().flipPrev()}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        {chapterLinks.map((c) => (
          <button
            key={c.chapter}
            type="button"
            onClick={() => goTo(chapterStart[c.chapter])}
            className="rounded-full bg-custom-dark px-4 py-2 text-sm font-medium text-yellow-400 shadow hover:opacity-90 dark:bg-white dark:text-custom-dark"
          >
            {c.title}
          </button>
        ))}
        <button type="button" className={btn} aria-label="Neste side" disabled={page >= last} onClick={() => book.current?.pageFlip().flipNext()}>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
