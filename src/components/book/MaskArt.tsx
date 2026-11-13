import * as React from "react";

export function MaskArt({
  ink = "#0f0a05",
  className,
}: {
  ink?: string;
  className?: string;
}) {
  const clipId = `mask-art-${React.useId().replace(/:/g, "")}`;

  return (
    <g
      className={className}
      stroke={ink}
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx={0} cy={0} r={57} fill={ink} stroke="none" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        {/* Draped collar; the circular crop finishes the shoulders. */}
        <path d="M-25 18 L-31 30 Q-43 37-48 53 M8 19 L13 31 Q29 34 43 52" />
        <path d="M-31 30 Q-19 42 2 37 L13 31" />
        <path d="M-22 27 Q-14 35 2 30 L8 24" strokeWidth={1.7} />
        <path d="M-29 36 Q-27 47-19 57 M10 39 Q18 45 21 57" strokeWidth={1.8} />
        <path d="M-13 40 Q-7 44 1 42" strokeWidth={1.6} />
        <path
          d="M-30 31 Q-20 42-5 39 Q-15 47-24 42 Z"
          fill={ink}
          strokeWidth={0.7}
        />
        <path
          d="M12 32 L22 37 L16 48 Q16 39 12 32 Z"
          fill={ink}
          strokeWidth={0.7}
        />

        {/* One continuous mask contour, including the single long beak. */}
        <path d="M-27-16 C-31-7-30 8-25 17 L-16 25 Q0 28 10 14 Q30 14 52 20 C47 7 30-6 9-8 L3-17" />

        {/* Mask construction and cheek fold. */}
        <path d="M2-13 Q5-6 8 1" strokeWidth={1.7} />
        <path d="M-24 5 Q-24 15-16 19 Q-9 23-2 19" strokeWidth={1.7} />

        {/* Mouth seam follows the beak toward its downward-curving tip. */}
        <path d="M8 4 Q29 5 50 19" strokeWidth={1.7} />
        <path
          d="M14 2 L18 8 M14 7 L18 3
             M22 4 L26 10 M22 9 L26 5
             M30 7 L34 13 M30 12 L34 8
             M38 11 L42 17 M38 16 L42 12"
          strokeWidth={1.6}
        />

        {/* Glass lens: outer bezel, inner rim, and a cut-open pupil glint. */}
        <circle cx={-8} cy={-5} r={8.8} strokeWidth={2.5} />
        <circle cx={-8} cy={-5} r={5.9} strokeWidth={1.4} />
        <path
          d="M-8-8.2 A3.2 3.2 0 1 0-4.8-5 H-8 Z"
          fill={ink}
          strokeWidth={0.5}
        />
        <path d="M-23-7 L-18-6 M2-5 L5-4" strokeWidth={1.7} />

        {/* Low crown and solid hat band. */}
        <path d="M-30-27 C-30-39-23-46-12-46 C1-46 11-39 15-28" />
        <path
          d="M-29-31 Q-8-37 13-31 L16-26 Q-7-31-30-26 Z"
          fill={ink}
          strokeWidth={0.8}
        />

        {/* Sweeping brim and the narrow black shadow directly beneath it. */}
        <path
          d="M-37-19 Q-14-22 14-23 Q2-15-23-15 Z"
          fill={ink}
          strokeWidth={0.7}
        />
        <path d="M-47-21 Q-15-35 26-25 Q12-18-12-17 Q-34-16-47-21 Z" />

        {/* Two restrained crown creases. */}
        <path d="M-23-35 L-21-39 M5-35 L2-39" strokeWidth={1.5} />
      </g>
    </g>
  );
}
