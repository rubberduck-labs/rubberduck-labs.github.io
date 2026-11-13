import * as React from "react";

type DuckHeadArtProps = {
  ink?: string;
  fillColor?: string;
  className?: string;
};

export function DuckHeadArt({
  ink = "#0f0a05",
  fillColor,
  className,
}: DuckHeadArtProps): React.ReactElement {
  return (
    <g
      className={className}
      fill="none"
      stroke={ink}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Broad, smooth logo head; low, swept bill; short flared neck. */}
      <path
        fill={fillColor ?? "none"}
        d="M-30-10
           C-27-26-15-40 1-43
           C17-47 33-40 43-27
           C53-14 55 3 49 17
           C47 22 44 26 40 30
           Q38 35 45 42
           C27 48 4 48-17 41
           Q-13 35-12 30
           C-14 25-20 21-23 15
           C-37 15-50 9-55-2
           Q-56-5-52-4
           C-44-3-36-3-30-10 Z"
      />

      {/* The logo's compact, happy closed eye. */}
      <path
        d="M-7-7 C-5-14 4-16 8-8"
        strokeWidth={1.6}
      />

      {/* Swept bill seam, with a small tapered ink ending. */}
      <path
        d="M-53-2 C-45 4-34 6-25 2"
        strokeWidth={1.6}
      />
      <path
        d="M-31 4 Q-26 3-23 0 Q-24 5-30 6 Z"
        fill={ink}
        stroke="none"
      />

      {/* A quiet fold makes the closed neck base feel natural. */}
      <path
        d="M-6 35 C5 40 22 41 32 36"
        strokeWidth={1.6}
      />
      <path
        d="M30 37 Q35 35 38 31 Q38 37 32 39 Z"
        fill={ink}
        stroke="none"
      />
    </g>
  );
}

export function DuckHeadArtAlt({
  ink = "#0f0a05",
  fillColor,
  className,
}: DuckHeadArtProps): React.ReactElement {
  return (
    <g
      className={className}
      fill="none"
      stroke={ink}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* The same head, with three small curls along the crown. */}
      <path
        fill={fillColor ?? "none"}
        d="M-30-10
           C-27-26-15-40-2-42
           C-7-46-2-49 2-44
           C0-50 7-50 8-44
           C12-49 17-46 14-43
           C26-42 36-36 43-27
           C53-14 55 3 49 17
           C47 22 44 26 40 30
           Q38 35 45 42
           C27 48 4 48-17 41
           Q-13 35-12 30
           C-14 25-20 21-23 15
           C-37 15-50 9-55-2
           Q-56-5-52-4
           C-44-3-36-3-30-10 Z"
      />

      {/* Familiar happy eye, with a restrained raised brow. */}
      <path d="M-7-7 C-5-14 4-16 8-8" strokeWidth={1.6} />
      <path d="M-8-21 Q-1-25 5-22" strokeWidth={1.6} />

      {/* A slightly lifted corner gives the bill its half-smile. */}
      <path
        d="M-53-2 C-44 5-32 7-23 1 Q-20-1-21-4"
        strokeWidth={1.6}
      />
      <path
        d="M-26 4 Q-22 1-21-3 Q-18 2-23 6 Z"
        fill={ink}
        stroke="none"
      />

      <path
        d="M-6 35 C5 40 22 41 32 36"
        strokeWidth={1.6}
      />
      <path
        d="M30 37 Q35 35 38 31 Q38 37 32 39 Z"
        fill={ink}
        stroke="none"
      />

      {/* Two short printed shine ticks, clear of the contour. */}
      <path d="M42-36 L45-40 M49-29 L54-31" strokeWidth={1.6} />
    </g>
  );
}
