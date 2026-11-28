// En snøfonn i julemodus. Tre lag, fra blåskygget bak til hvitt foran, gir fonnen dybde.
// «fixed»: ligger nederst i vinduet bak innholdet, så snøen synes med en gang siden lastes.
// Ellers ligger den oppå bunnteksten, og bunnteksten glir inn over den faste fonnen når man ruller ned.
export function SnowPile({ fixed = false }: { fixed?: boolean }) {
  return (
    <div
      className={`pointer-events-none h-24 sm:h-36 ${fixed ? 'fixed inset-x-0 bottom-0 -z-10' : 'relative -mb-px'}`}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#dde9f4"
          d="M0 120V58C90 34 180 30 270 48S420 26 520 36S700 70 800 58S960 20 1060 30S1240 64 1330 50S1420 38 1440 40V120Z"
        />
        <path
          fill="#eef5fb"
          d="M0 120V72C80 52 160 50 240 62S390 44 480 52S650 84 740 76S900 46 990 54S1170 86 1260 76S1400 58 1440 62V120Z"
        />
        <path
          fill="#ffffff"
          d="M0 120V88C70 74 150 72 220 82S360 66 450 72S620 100 710 94S870 70 960 76S1140 102 1230 94S1390 78 1440 84V120Z"
        />
      </svg>
    </div>
  );
}
