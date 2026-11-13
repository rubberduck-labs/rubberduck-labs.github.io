// Egen statistikk (public/t.js). Gjør ingenting hvis skriptet ikke er lastet, eller hvis besøkende har slått av sporing.
export function track(event: string, label?: string) {
  (window as unknown as { rdTrack?: (e: string, l?: string) => void }).rdTrack?.(event, label);
}
