import type { CSSProperties, ReactNode } from "react";
import "./book-shell.css";

interface BookShellProps {
  page: number;
  last: number;
  resting: boolean;
  landscape: boolean;
  children: ReactNode;
}

type ShellStyle = CSSProperties & {
  "--book-shift": string;
  "--left-depth": string;
  "--right-depth": string;
};

export function BookShell({
  page,
  last,
  resting,
  landscape,
  children,
}: BookShellProps) {
  const closed = page <= 0 ? "front" : page >= last ? "back" : "open";
  const progress = Math.max(
    0,
    Math.min(1, (page - 1) / Math.max(1, last - 2)),
  );

  // Center using the stage's width, never the surrounding layout's width.
  const shift =
    landscape && resting
      ? closed === "front"
        ? "-25%"
        : closed === "back"
          ? "25%"
          : "0%"
      : "0%";

  const style: ShellStyle = {
    "--book-shift": shift,
    "--left-depth": `${(5 * progress).toFixed(2)}px`,
    "--right-depth": `${(5 * (1 - progress)).toFixed(2)}px`,
  };

  return (
    <div
      className="book-shell"
      data-layout={landscape ? "spread" : "single"}
      data-pose={closed}
      data-resting={resting ? "true" : "false"}
      style={style}
    >
      <div className="book-shell__stage">
        <div className="book-shell__decor" aria-hidden="true">
          <div className="book-shell__footprint">
            <div className="book-shell__ambient" />
            <div className="book-shell__contact" />
          </div>

          <div className="book-shell__panel book-shell__panel--left">
            <div className="book-shell__board" />
            <div className="book-shell__edges" />
          </div>

          <div className="book-shell__panel book-shell__panel--right">
            <div className="book-shell__board" />
            <div className="book-shell__edges" />
          </div>
        </div>

        <div className="book-shell__content">{children}</div>
        <div className="book-shell__gutter" aria-hidden="true" />
      </div>
    </div>
  );
}
