import { forwardRef, useEffect, useRef, useState } from "react";
import type { ReactElement, TouchEvent } from "react";
import type { PageFlip } from "page-flip";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { bookChapters } from "./chapters";
import { BlockRenderer, ManuscriptCover, ManuscriptPage } from "./ManuscriptPage";
import { BookShell } from "./BookShell";

const chapterLinks = [
  { chapter: "introduction", title: "Introduksjon" },
  { chapter: "values", title: "Våre verdier" },
  { chapter: "salaryBenefits", title: "Lønn og goder" },
] as const;

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

const BlankPage = forwardRef<HTMLDivElement>(function BlankPage(_props, ref) {
  return (
    <ManuscriptPage ref={ref} shields={false}>
      <span />
    </ManuscriptPage>
  );
});

interface BookHandle {
  pageFlip(): PageFlip | null;
}

export default function FlipBook() {
  const book = useRef<BookHandle | null>(null);
  const [page, setPage] = useState(0);
  const [resting, setResting] = useState(true);
  const landscape = useMediaQuery("(min-width: 700px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const pages = [
    ...bookChapters.frontMatter,
    ...bookChapters.introduction,
    ...bookChapters.values,
    ...bookChapters.salaryBenefits,
  ];

  const chapterStart: Record<string, number> = {};
  let offset = 1;
  for (const [key, list] of Object.entries(bookChapters)) {
    chapterStart[key] = offset;
    offset += list.length;
  }

  const children: ReactElement[] = [<ManuscriptCover key="cover" />];

  pages.forEach((p, i) => {
    children.push(
      <ManuscriptPage
        key={i}
        side={i % 2 === 0 ? "left" : "right"}
        folio={p.isSpecial ? undefined : i + 1}
        coffee={i === pages.length - 1}
        variant={i + 1}
      >
        <BlockRenderer page={p} />
      </ManuscriptPage>,
    );
  });

  if ((children.length + 1) % 2 !== 0) {
    children.push(<BlankPage key="blank" />);
  }

  children.push(
    <ManuscriptCover key="back" back />,
  );

  const last = children.length - 1;

  const synchronize = (api: PageFlip) => {
    setPage(api.getCurrentPageIndex());
    setResting(true);
  };

  const navigate = (direction: "next" | "previous") => {
    const api = book.current?.pageFlip();
    if (!api || !resting) return;

    if (reducedMotion) {
      if (direction === "next") api.turnToNextPage();
      else api.turnToPrevPage();
      synchronize(api);
    } else if (direction === "next") {
      api.flipNext();
    } else {
      api.flipPrev();
    }
  };

  const goTo = (target: number) => {
    const api = book.current?.pageFlip();
    if (!api || !resting) return;
    api.turnToPage(target);
    synchronize(api);
  };

  const touch = useRef<{ x: number; y: number; t: number } | null>(null);

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (landscape || event.touches.length !== 1) {
      touch.current = null;
      return;
    }
    const point = event.touches[0];
    touch.current = {
      x: point.clientX,
      y: point.clientY,
      t: Date.now(),
    };
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touch.current;
    touch.current = null;
    if (landscape || !start) return;

    const point = event.changedTouches[0];
    if (!point) return;

    const dx = point.clientX - start.x;
    const dy = point.clientY - start.y;

    if (
      Math.abs(dx) > 60 &&
      Math.abs(dy) < 40 &&
      Math.abs(dx) > Math.abs(dy) * 2.5 &&
      Date.now() - start.t < 700
    ) {
      navigate(dx < 0 ? "next" : "previous");
    }
  };

  const btn =
    "inline-flex h-10 w-10 items-center justify-center rounded-full " +
    "bg-custom-dark text-yellow-400 shadow disabled:opacity-40 " +
    "dark:bg-white dark:text-custom-dark";

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={() => {
          touch.current = null;
        }}
      >
        <div className="book-stage">
        <BookShell
          page={page}
          last={last}
          resting={resting}
          landscape={landscape}
        >
          <HTMLFlipBook
            key={`${landscape ? "spread" : "single"}-${reducedMotion}`}
            ref={book}
            width={420}
            height={600}
            size="stretch"
            minWidth={280}
            maxWidth={520}
            minHeight={400}
            maxHeight={800}
            showCover
            maxShadowOpacity={0.32}
            drawShadow
            flippingTime={900}
            usePortrait={!landscape}
            startZIndex={0}
            autoSize={false}
            clickEventForward
            useMouseEvents={landscape && !reducedMotion}
            swipeDistance={30}
            showPageCorners={!reducedMotion}
            disableFlipByClick={false}
            mobileScrollSupport
            startPage={page}
            className="book-flip"
            style={{ width: "100%", height: "100%" }}
            onFlip={(event: { data: number }) => setPage(event.data)}
            onInit={() => {
              const api = book.current?.pageFlip();
              if (api) synchronize(api);
            }}
            onChangeState={(event: { data: string }) =>
              setResting(event.data === "read")
            }
          >
            {children}
          </HTMLFlipBook>
        </BookShell>
        <div className="book-stage__light" aria-hidden="true" />
        </div>
      </div>

      <div className="relative z-10 mt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          className={btn}
          aria-label="Forrige side"
          disabled={page === 0 || !resting}
          onClick={() => navigate("previous")}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {chapterLinks.map((chapter) => (
          <button
            key={chapter.chapter}
            type="button"
            disabled={!resting}
            onClick={() => goTo(chapterStart[chapter.chapter])}
            className="rounded-full bg-custom-dark px-4 py-2 text-sm font-medium text-yellow-400 shadow hover:opacity-90 disabled:opacity-40 dark:bg-white dark:text-custom-dark"
          >
            {chapter.title}
          </button>
        ))}

        <button
          type="button"
          className={btn}
          aria-label="Neste side"
          disabled={page >= last || !resting}
          onClick={() => navigate("next")}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
