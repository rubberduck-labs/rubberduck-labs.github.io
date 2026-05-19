export function useCanary(): boolean {
  return localStorage.getItem('canary') === 'true';
}
