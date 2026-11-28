// π med så mange desimaler man vil, regnet ut med Machins formel: π = 16·arctan(1/5) − 4·arctan(1/239).
// Alt regnes i heltall (BigInt) med noen ekstra sifre som buffer, så alle desimalene vi gir fra oss er riktige.
const GUARD = 10;

function arctanInverse(x: bigint, unity: bigint): bigint {
  const x2 = x * x;
  let term = unity / x;
  let sum = term;
  let k = 3n;
  let sign = -1n;
  while (term !== 0n) {
    term /= x2;
    sum += (sign * term) / k;
    k += 2n;
    sign = -sign;
  }
  return sum;
}

let cache = '';

/** π som tekst, «3.» fulgt av `decimals` desimaler. */
export function piDigits(decimals: number): string {
  if (cache.length - 2 < decimals) {
    const unity = 10n ** BigInt(decimals + GUARD);
    const pi = 16n * arctanInverse(5n, unity) - 4n * arctanInverse(239n, unity);
    const digits = (pi / 10n ** BigInt(GUARD)).toString();
    cache = `3.${digits.slice(1)}`;
  }
  return cache.slice(0, decimals + 2);
}
