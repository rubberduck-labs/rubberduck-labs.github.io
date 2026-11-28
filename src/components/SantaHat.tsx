// Nisselue på utvikleren i julemodus. Tegnet i samme 300 × 300-rute som bildet av ham, så den legges rett oppå.
// Han ser mot venstre og ned, med ansiktet til venstre og øret ved x ≈ 175–179, y ≈ 56–66. Kanten ligger tett over
// håret fra pannen ved (144, 44) og heller ned mot øret ved (181, 51), toppen går bare til y ≈ 30, og den lange tuppen
// faller bak hodet ned mot dusken ved (198, 58), godt unna lampen og stolryggen.
// Luen er tegnet av Codex ut fra bildet av ham, og sjekket mot tegningen.
export function SantaHat() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 300 300"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <g stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Lav topp og lang tupp som faller bak hodet */}
        <path
          fill="#dc2626"
          d="M143.7 44.5 C145.4 36.5 153.1 30.1 162.2 30 C173.6 29.8 182.3 36.5 189.2 44.2 C194.1 49.7 196.6 54.2 198.4 58 L193.6 59 C191.8 52.1 187.4 44.8 182.1 40.5 C181.1 43.1 180.9 46.3 181.7 49.5 C169.6 45.6 155.5 43.2 143.7 44.5 Z"
        />
        {/* Noen få folder i stoffet */}
        <path
          fill="none"
          strokeWidth="1.5"
          d="M147.8 41.1 C149.2 37.7 152.1 34.8 155.1 33.4 M174.8 36.6 Q177.5 39.1 178.6 42.3 M177.9 36.9 L180.4 39.5 M188.8 46.8 Q192.2 51.2 193.7 55.3"
        />
        {/* Smal kant som følger hodet */}
        <path
          fill="#fff"
          d="M144.1 43.8 C153.7 42.7 168.6 44.6 180.1 47.9 C181.6 48.3 182.1 49.3 181.8 50.7 L181.3 53 C169.8 49.5 156.3 47.6 148.1 49.9 C145.7 49.3 144.2 47.6 143.9 45.8 Q143.7 44.6 144.1 43.8 Z"
        />
        {/* Stor, ullen dusk */}
        <path
          fill="#fff"
          d="M197.7 53.3 C199.2 53 200.5 53.6 201.2 54.7 C202.7 55.2 203.2 56.6 202.8 58 C203.3 59.4 202.6 60.9 201.3 61.5 C200.6 62.8 199 63.2 197.7 62.7 C196.3 63.2 194.8 62.6 194.2 61.4 C192.9 60.7 192.5 59.2 193 57.9 C192.7 56.5 193.5 55.1 194.8 54.7 C195.4 53.7 196.6 53.2 197.7 53.3 Z"
        />
      </g>
    </svg>
  );
}
