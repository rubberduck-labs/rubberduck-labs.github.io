import { createElement, forwardRef, type CSSProperties, type ReactNode } from "react";
import { CoffeeStain, CoverArt, DropCap, Shield, VineBorder } from "./Ornaments";
import "./manuscript.css";
import type { BookPage } from "./types";

export interface ManuscriptPageProps {
  children: ReactNode;
  side?: "left" | "right";
  folio?: number;
  shields?: boolean;
  /** En kaffekoppflekk på siden. */
  coffee?: boolean;
  /** Tall som gjør at slitasjen ser ulik ut fra side til side. */
  variant?: number;
}

export interface ManuscriptCoverProps {
  title?: string;
  subtitle?: string;
  back?: boolean;
}

export interface BlockRendererProps {
  page: BookPage;
}

function formatFolio(value: number | undefined): string | undefined {
  if (value === undefined || !Number.isSafeInteger(value) || value < 1) {
    return undefined;
  }

  if (value > 3999) return String(value);

  const numerals: ReadonlyArray<readonly [number, string]> = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];

  let remaining = value;
  let result = "";

  for (const [amount, numeral] of numerals) {
    while (remaining >= amount) {
      result += numeral;
      remaining -= amount;
    }
  }

  return result;
}

/* Preserve readable body sizes even when existing content requests smaller text. */
function sizeClass(size: string | undefined): string {
  switch (size?.trim().toLowerCase()) {
    case "small":
    case "sm":
    case "text-sm":
    case "15px":
      return "ms-size-small";
    case "large":
    case "lg":
    case "text-lg":
    case "17px":
      return "ms-size-large";
    default:
      return "";
  }
}

function initialParts(text: string) {
  const trimmed = text.trimStart();
  const letter = Array.from(trimmed)[0];

  if (!letter || !/^\p{L}$/u.test(letter)) return undefined;

  return {
    letter,
    leading: text.slice(0, text.length - trimmed.length),
    rest: trimmed.slice(letter.length),
  };
}

export function BlockRenderer({ page }: BlockRendererProps) {
  const hasTitle = Boolean(page.title?.trim());
  // Mange sider har samme tekst som overskrift i innholdet, og da skal den bare stå én gang.
  const first = page.content[0];
  const showTitle = hasTitle && !(first?.type === 'heading' && first.text.trim() === page.title?.trim());
  const initialIndex = hasTitle
    ? page.content.findIndex(
        (block) =>
          (block.type === "paragraph" ||
            block.type === "centeredParagraph") &&
          Boolean(block.text.trim()),
      )
    : -1;

  return (
    <>
      {showTitle && <h1 className="ms-title ms-title--page">{page.title}</h1>}

      {page.content.map((block, index) => {
        switch (block.type) {
          case "heading":
            return createElement(
              `h${block.level}`,
              { key: index, className: "ms-title" },
              block.text,
            );

          case "paragraph":
          case "centeredParagraph": {
            const initial =
              index === initialIndex ? initialParts(block.text) : undefined;

            const className = [
              sizeClass(block.size),
              block.type === "centeredParagraph" ? "ms-centered" : "",
              initial ? "ms-paragraph--initial" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <p key={index} className={className || undefined}>
                {initial ? (
                  <>
                    <DropCap letter={initial.letter} />
                    <span className="ms-sr-only">
                      {initial.leading}
                      {initial.letter}
                    </span>
                    {initial.rest}
                  </>
                ) : (
                  block.text
                )}
              </p>
            );
          }

          case "quote":
            return (
              <blockquote
                key={index}
                className={`ms-quote ${sizeClass(block.size)}`}
              >
                <p>{block.text}</p>
              </blockquote>
            );

          case "list":
            return (
              <ul key={index} className={`ms-list ${sizeClass(block.size)}`}>
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            );
        }
      })}
    </>
  );
}

/* Enkel, forutsigbar «tilfeldighet» ut fra sidetallet: samme side ser alltid lik ut, men sidene er ulike hverandre. */
function rnd(seed: number, k: number): number {
  const x = Math.sin(seed * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function wearStyle(variant: number): CSSProperties {
  const r = (k: number, min: number, max: number) => min + rnd(variant + 1, k) * (max - min);
  return {
    "--dust-x": `${Math.round(r(1, 0, 320))}px`,
    "--dust-y": `${Math.round(r(2, 0, 320))}px`,
    "--dust-s": `${Math.round(r(3, 260, 420))}px`,
    "--fox-x": `${Math.round(r(4, 0, 600))}px`,
    "--fox-y": `${Math.round(r(5, 0, 600))}px`,
    "--fox-s": `${Math.round(r(6, 420, 820))}px`,
    "--ring-x": `${Math.round(r(7, 14, 86))}%`,
    "--ring-y": `${Math.round(r(8, 14, 84))}%`,
    "--ring-a": r(9, 0, 1) < 0.35 ? 0 : r(10, 0.5, 1.4), // ikke alle sider har en vannrand
    "--thumb": r(11, 0.25, 1.15),
    "--age": r(12, 0.55, 1.2),
  } as CSSProperties;
}

export const ManuscriptPage = forwardRef<
  HTMLDivElement,
  ManuscriptPageProps
>(function ManuscriptPage(
  { children, side = "right", folio, shields = true, coffee = false, variant = 0 },
  ref,
) {
  const folioLabel = formatFolio(folio);

  return (
    <div
      ref={ref}
      className={`ms-page ms-page--${side}`}
      lang="nb"
      data-density="soft"
    >
      <VineBorder />

      {shields && (
        <>
          <Shield className="ms-shield ms-shield--top" />
          <Shield className="ms-shield ms-shield--bottom" />
          <Shield className="ms-shield ms-shield--left" />
          <Shield className="ms-shield ms-shield--right" />
        </>
      )}

      <div
        className="ms-text"
        role="region"
        aria-label={folioLabel ? `Håndbok, side ${folio}` : "Håndbok"}
        tabIndex={0}
        data-book-scroll
      >
        {children}
      </div>

      {folioLabel && (
        <span className="ms-folio" aria-hidden="true">
          {folioLabel}
        </span>
      )}

      {coffee && <CoffeeStain className="ms-coffee" />}

      <div className="ms-wear" aria-hidden="true" style={wearStyle(variant)} />
    </div>
  );
});

export const ManuscriptCover = forwardRef<
  HTMLDivElement,
  ManuscriptCoverProps
>(function ManuscriptCover(
  { title = "Håndbok", subtitle = "Rubberduck", back = false },
  ref,
) {
  return (
    <div
      ref={ref}
      className="ms-cover"
      data-back={back ? "true" : "false"}
      data-density="hard"
      lang="nb"
    >
      <CoverArt
        className="ms-cover__art"
        title={title}
        subtitle={subtitle}
        back={back}
      />
    </div>
  );
});
