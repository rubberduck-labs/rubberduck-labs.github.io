import { useId } from "react";
import { DuckHeadArt } from "./DuckHeadArt";
import { RubberDuckIcon } from "../Icons/RubberDuckIcon";

export interface OrnamentProps {
  className?: string;
}

export interface DropCapProps extends OrnamentProps {
  letter: string;
  duck?: boolean;
}

function useSvgId(prefix: string): string {
  const id = useId();
  return `${prefix}-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

export function VineBorder({ className = "" }: OrnamentProps) {
  const id = useSvgId("vine");
  const leaf = `${id}-leaf`;
  const berry = `${id}-berry`;
  const sprig = `${id}-sprig`;

  return (
    <svg
      className={`ms-border ${className}`}
      viewBox="0 0 600 800"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <symbol id={leaf} viewBox="-12 -18 24 36" overflow="visible">
          <path
            d="M0 16C-2 9-12 9-7 3L-11-2-4-4-5-13 1-9
               6-17 7-6 12-4 7 2C12 8 3 9 0 16Z"
            fill="currentColor"
            stroke="#514731"
            strokeWidth="0.85"
            strokeLinejoin="round"
          />
          <path
            d="M0 14 2-10M1 3-5-2M1 0 7-5"
            fill="none"
            stroke="#514731"
            strokeWidth="0.65"
          />
        </symbol>

        <symbol id={berry} viewBox="-15 -12 30 24" overflow="visible">
          <path
            d="M-13 1C-15-9 0-13 9-7S16 8 3 10-12 9-13 1Z"
            fill="currentColor"
            stroke="#65503b"
            strokeWidth="1"
          />
          <path
            d="M-8 3C-9-5 2-9 8-3S7 6 0 7"
            fill="none"
            stroke="#f2e4be"
            strokeOpacity=".6"
            strokeWidth="1"
          />
          <ellipse
            cx="-4"
            cy="-4"
            rx="3.2"
            ry="2"
            fill="#fff8df"
            opacity=".7"
            transform="rotate(-25)"
          />
        </symbol>

        <symbol id={sprig} viewBox="-44 0 88 165" overflow="visible">
          <g
            fill="none"
            stroke="#67553d"
            strokeWidth="1.15"
            strokeLinecap="round"
          >
            <path d="M0 165C-21 135 25 109 2 82S-18 30 1 0" />
            <path d="M1 151C-42 144-37 108-15 115S-5 143-22 132" />
            <path d="M4 111C42 99 40 66 19 71S8 94 24 87" />
            <path d="M-2 76C-34 64-39 31-18 30S-8 52-24 45" />
            <path d="M0 38C27 30 33 9 17 8S9 24 20 20" />
            <path d="M-12 127-34 151M18 83 37 59M-17 43-35 20M13 18 28 0" />
          </g>
          <g color="#a68c45">
            <use href={`#${leaf}`} x="-30" y="132" width="21" height="31" />
            <use href={`#${leaf}`} x="19" y="44" width="23" height="33" />
            <use href={`#${leaf}`} x="-35" y="6" width="22" height="32" />
          </g>
          <g color="#686548">
            <use href={`#${leaf}`} x="1" y="119" width="22" height="32" />
            <use href={`#${leaf}`} x="-24" y="69" width="20" height="30" />
            <use href={`#${leaf}`} x="4" y="23" width="19" height="29" />
          </g>
          <use
            href={`#${berry}`}
            x="-35"
            y="91"
            width="27"
            height="22"
            color="#b54e7c"
          />
          <use
            href={`#${berry}`}
            x="10"
            y="91"
            width="24"
            height="19"
            color="#344d83"
          />
          <g fill="#aa8b3a" stroke="#695339" strokeWidth=".7">
            <circle cx="-34" cy="151" r="3" />
            <circle cx="37" cy="59" r="2.8" />
            <circle cx="-35" cy="20" r="2.5" />
            <circle cx="28" cy="0" r="3" />
          </g>
        </symbol>
      </defs>

      <g opacity=".96">
        {[100, 265, 430, 595].map((y) => (
          <g key={y}>
            <use
              href={`#${sprig}`}
              x="-44"
              width="88"
              height="165"
              transform={`translate(49 ${y})`}
            />
            <use
              href={`#${sprig}`}
              x="-44"
              width="88"
              height="165"
              transform={`translate(551 ${y}) scale(-1 1)`}
            />
          </g>
        ))}
        {[65, 230, 395].map((x) => (
          <g key={x}>
            <use
              href={`#${sprig}`}
              x="-44"
              width="88"
              height="165"
              transform={`translate(${x} 57) rotate(-90)`}
            />
            <use
              href={`#${sprig}`}
              x="-44"
              width="88"
              height="165"
              transform={`translate(${600 - x} 736) rotate(90)`}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function Shield({ className = "" }: OrnamentProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 70 88"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M5 5Q35 10 65 5L61 43Q56 68 35 82 14 68 9 43Z"
        fill="#b3a46d"
        stroke="#514731"
        strokeWidth="2"
      />
      <path
        d="M11 12Q35 16 59 12L55 43Q51 62 35 75 19 62 15 43Z"
        fill="#e2d9b4"
        stroke="#685c3c"
      />
      <path
        d="M43 22C14 15 13 36 40 31S57 48 31 44
           14 60 38 56 46 68 32 67"
        fill="none"
        stroke="#344d83"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M43 22C14 15 13 36 40 31S57 48 31 44
           14 60 38 56 46 68 32 67"
        fill="none"
        stroke="#91a1b8"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path d="m43 18 8 4-8 5Z" fill="#344d83" />
      <circle cx="45" cy="21" r="1" fill="#f2e4be" />
    </svg>
  );
}

export function DropCap({
  letter,
  duck = true,
  className = "",
}: DropCapProps) {
  const capital = Array.from(letter.toLocaleUpperCase("nb-NO"))[0] ?? "";

  return (
    <span className={`ms-initial ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="2" y="2" width="96" height="96" rx="2" fill="#30271e" />
        <rect
          x="5"
          y="5"
          width="90"
          height="90"
          fill="#aa893f"
          stroke="#e6cf83"
        />
        <rect
          x="11"
          y="11"
          width="78"
          height="78"
          fill="#344d83"
          stroke="#30271e"
          strokeWidth="1.5"
        />
        <path
          d="M15 38Q33 16 49 37T85 35M15 72Q32 51 49 72T85 68"
          fill="none"
          stroke="#d2b66b"
          strokeWidth=".8"
          opacity=".7"
        />
        <path
          d="M8 27V8H27M73 8H92V27M92 73V92H73M27 92H8V73"
          fill="none"
          stroke="#30271e"
          strokeWidth="1.2"
        />
        <g fill="#e7d494" stroke="#30271e" strokeWidth=".7">
          <path d="m8 8 8 4-4 4Z" />
          <path d="m92 8-8 4 4 4Z" />
          <path d="m8 92 8-4-4-4Z" />
          <path d="m92 92-8-4 4-4Z" />
        </g>
        <text
          x="50"
          y="72"
          textAnchor="middle"
          textLength={capital === "Æ" ? 72 : undefined}
          lengthAdjust="spacingAndGlyphs"
          fill="#d887a6"
          stroke="#30271e"
          strokeWidth="1"
          paintOrder="stroke"
          fontFamily="var(--ms-display, Georgia, serif)"
          fontSize="72"
        >
          {capital}
        </text>
        {duck && (
          <RubberDuckIcon x={63} y={67} width={27} height={27} style={{ color: "#fde047" }} aria-hidden="true" focusable="false" />
        )}
      </svg>
    </span>
  );
}

export function Flourish({ className = "" }: OrnamentProps) {
  return (
    <svg
      className={`ms-flourish ${className}`}
      viewBox="0 0 120 28"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="#967025" strokeWidth="1">
        <path d="M7 14H49M71 14H113M46 14C25-7 15 7 31 10M74 14C95-7 105 7 89 10" />
        <path d="M46 14C25 35 15 21 31 18M74 14C95 35 105 21 89 18" />
      </g>
      <path d="m60 5 7 9-7 9-7-9Z" fill="#967025" stroke="#514731" />
      <circle cx="60" cy="14" r="2.5" fill="#b54e7c" />
    </svg>
  );
}


/* En kaffekoppring: en uregelmessig mørk kant med en svak flate inni, et par sprut og en halv ring bak. */
export function CoffeeStain({ className = "" }: OrnamentProps) {
  const id = useSvgId("coffee");
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <defs>
        <filter id={`${id}-wobble`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="8" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="9" />
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
        <radialGradient id={`${id}-fill`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#7a4a1c" stopOpacity="0.05" />
          <stop offset="0.85" stopColor="#7a4a1c" stopOpacity="0.16" />
          <stop offset="1" stopColor="#6b3e16" stopOpacity="0.3" />
        </radialGradient>
      </defs>
      <g filter={`url(#${id}-wobble)`}>
        <circle cx="96" cy="104" r="62" fill="none" stroke="#7a4a1c" strokeOpacity="0.14" strokeWidth="7" strokeDasharray="190 40 100 60" />
        <circle cx="100" cy="100" r="58" fill={`url(#${id}-fill)`} />
        <circle cx="100" cy="100" r="58" fill="none" stroke="#5e3410" strokeOpacity="0.42" strokeWidth="4.5" strokeDasharray="330 34" strokeLinecap="round" />
        <circle cx="100" cy="100" r="53" fill="none" stroke="#5e3410" strokeOpacity="0.12" strokeWidth="2" />
        <circle cx="168" cy="52" r="3.4" fill="#5e3410" fillOpacity="0.3" />
        <circle cx="176" cy="66" r="1.8" fill="#5e3410" fillOpacity="0.28" />
        <circle cx="26" cy="150" r="2.4" fill="#5e3410" fillOpacity="0.24" />
      </g>
    </svg>
  );
}


export function CoverArt({
  title,
  subtitle,
  className = "",
  back = false,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  back?: boolean;
}) {
  const id = useSvgId("cover");
  const caps = (t: string) => t.toLocaleUpperCase("nb");
  const bronze = `url(#${id}-bronze)`;
  const dark = "#1c1509";
  const CX = 210;
  const CY = 214;

  // Stor tittel under, liten linje over: som på en gammel bok.
  const bigSize = Math.min(44, Math.floor(280 / (title.length * 0.82)));
  const smallSize = subtitle ? Math.min(22, Math.floor(280 / (subtitle.length * 0.8))) : 0;

  // Hjørnene er andeføtter i messing: svømmehud med tre tær og små klør, med anklen i hjørnet og tærne mot midten.
  const tips: [number, number][] = [[106, 24], [78, 78], [24, 106]];
  const cornerShape = (
    <g>
      {/* Svømmehuden */}
      <path d="M12 12 L106 24 Q84 46 78 78 Q46 84 24 106 Z" fill={bronze} stroke={dark} strokeOpacity="0.7" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M12 12 L86 46 M12 12 L46 86" fill="none" stroke={dark} strokeOpacity="0.45" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M30 14 Q60 20 84 26 M14 30 Q20 60 26 84" fill="none" stroke="#e9d49a" strokeOpacity="0.35" strokeWidth="1" strokeLinecap="round" />
      {/* Tærne */}
      {tips.map(([x, y], i) => (
        <g key={i}>
          <path d={`M12 12 L${x} ${y}`} stroke={dark} strokeOpacity="0.85" strokeWidth="15" strokeLinecap="round" fill="none" />
          <path d={`M12 12 L${x} ${y}`} stroke={bronze} strokeWidth="12.5" strokeLinecap="round" fill="none" />
          <path d={`M14 12 L${x - 1} ${y - 1}`} stroke="#e9d49a" strokeOpacity="0.4" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <circle cx={x} cy={y} r="3.2" fill={dark} fillOpacity="0.55" />
        </g>
      ))}
      {/* Ankelen med nagle */}
      <circle cx="14" cy="14" r="12" fill={bronze} stroke={dark} strokeOpacity="0.75" strokeWidth="1.6" />
      <circle cx="14" cy="14" r="7" fill="none" stroke={dark} strokeOpacity="0.45" strokeWidth="1.2" />
      <circle cx="14" cy="14" r="3.2" fill={dark} fillOpacity="0.6" />
    </g>
  );
  const corners = [
    { tx: 22, ty: 22, sx: 1, sy: 1 },
    { tx: 398, ty: 22, sx: -1, sy: 1 },
    { tx: 22, ty: 578, sx: 1, sy: -1 },
    { tx: 398, ty: 578, sx: -1, sy: -1 },
  ];

  return (
    <svg className={className} viewBox="0 0 420 600" preserveAspectRatio="xMidYMid slice" role="img" aria-label={title} focusable="false">
      <defs>
        <clipPath id={`${id}-clip`}>
          <rect width="420" height="600" rx="5" />
        </clipPath>
        <linearGradient id={`${id}-base`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c98d45" />
          <stop offset="0.5" stopColor="#bb7b36" />
          <stop offset="1" stopColor="#a8682a" />
        </linearGradient>
        <linearGradient id={`${id}-bronze`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="420" y2="600">
          <stop offset="0" stopColor="#a58d57" />
          <stop offset="0.25" stopColor="#6b5830" />
          <stop offset="0.5" stopColor="#ad9660" />
          <stop offset="0.75" stopColor="#4c3d1f" />
          <stop offset="1" stopColor="#7e6a3b" />
        </linearGradient>
        <radialGradient id={`${id}-light`} cx="46%" cy="36%" r="75%">
          <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.22" />
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#1c0d03" stopOpacity="0.5" />
        </radialGradient>
        <linearGradient id={`${id}-spine`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1c0d03" stopOpacity="0.5" />
          <stop offset="1" stopColor="#1c0d03" stopOpacity="0" />
        </linearGradient>

        {/* Skinn: store folder som får lys og skygge, flekker i fargen og fint korn */}
        <filter id={`${id}-leather`} filterUnits="userSpaceOnUse" x="0" y="0" width="420" height="600" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.0045 0.0085" numOctaves="3" seed="11" result="wr" />
          <feDiffuseLighting in="wr" surfaceScale="6.5" diffuseConstant="1.15" lightingColor="#fff3dc" result="folds">
            <feDistantLight azimuth="238" elevation="48" />
          </feDiffuseLighting>
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.03" numOctaves="2" seed="3" result="mot" />
          <feColorMatrix in="mot" type="saturate" values="0" result="motg" />
          <feComponentTransfer in="motg" result="mott">
            <feFuncR type="linear" slope="0.2" intercept="0.82" />
            <feFuncG type="linear" slope="0.2" intercept="0.82" />
            <feFuncB type="linear" slope="0.2" intercept="0.82" />
          </feComponentTransfer>
          <feComposite in="SourceGraphic" in2="folds" operator="arithmetic" k1="1.5" k2="0" k3="0" k4="0" result="a" />
          <feComposite in="a" in2="mott" operator="arithmetic" k1="1.06" k2="0" k3="0" k4="0" result="b" />
          <feTurbulence type="fractalNoise" baseFrequency="0.6 0.85" numOctaves="1" seed="7" result="gr" />
          <feDiffuseLighting in="gr" surfaceScale="0.55" diffuseConstant="1" lightingColor="#ffffff" result="grl">
            <feDistantLight azimuth="225" elevation="58" />
          </feDiffuseLighting>
          <feComposite in="b" in2="grl" operator="arithmetic" k1="1.26" k2="0" k3="0" k4="0" />
        </filter>

        {/* Metall: små utpressede kanter med matt glans og skygge i leveren */}
        <filter id={`${id}-metal`} x="-10%" y="-10%" width="125%" height="125%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.9" result="h" />
          <feSpecularLighting in="h" surfaceScale="2.6" specularConstant="0.4" specularExponent="18" lightingColor="#d9c590" result="spec">
            <feDistantLight azimuth="235" elevation="46" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="hl" />
          <feComposite in="SourceGraphic" in2="hl" operator="arithmetic" k1="0" k2="1" k3="0.45" k4="0" result="m" />
          <feDropShadow in="SourceAlpha" dx="1.8" dy="3" stdDeviation="1.8" floodColor="#140a02" floodOpacity="0.85" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="m" />
          </feMerge>
        </filter>

        {/* Innpreget tekst */}
        <filter id={`${id}-deboss`} x="-4%" y="-20%" width="108%" height="140%">
          <feOffset in="SourceAlpha" dx="0.8" dy="1" result="dn" />
          <feFlood floodColor="#f0b873" floodOpacity="0.5" />
          <feComposite in2="dn" operator="in" result="rim" />
          <feMerge>
            <feMergeNode in="rim" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g clipPath={`url(#${id}-clip)`}>
        {/* Skinnet */}
        <rect width="420" height="600" fill={`url(#${id}-base)`} filter={`url(#${id}-leather)`} />
        <rect width="420" height="600" fill={`url(#${id}-light)`} />
        {/* Ryggen */}
        <rect x={back ? 392 : 0} width="28" height="600" fill={`url(#${id}-spine)`} transform={back ? "translate(812 0) scale(-1 1)" : undefined} />

        {/* Hjørner */}
        {corners.map((c, i) => (
          <g key={i} filter={`url(#${id}-metal)`}>
            <g transform={`translate(${c.tx} ${c.ty}) scale(${c.sx} ${c.sy})`}>{cornerShape}</g>
          </g>
        ))}

        {/* Hodet til rubberducken vår: flat strek, samme stil som resten av coveret */}
        {/* Baksiden: bare anda, midt på coveret, uten tekst */}
        <g transform={back ? `translate(${CX} 300) scale(1.75)` : `translate(${CX} ${CY}) scale(1.4)`}>
          <DuckHeadArt ink="#0f0a05" />
        </g>

        {/* Tittel */}
        {!back && (
        <g textAnchor="middle" fontFamily="var(--ms-body, Georgia, serif)" filter={`url(#${id}-deboss)`} fill="#0f0a05">
          {subtitle && (
            <text x={CX} y="392" fontSize={smallSize} letterSpacing="5" fontWeight="700">{caps(subtitle)}</text>
          )}
          <text x={CX} y="438" fontSize={bigSize} letterSpacing="4" fontWeight="700">{caps(title)}</text>
        </g>
        )}
      </g>
    </svg>
  );
}
