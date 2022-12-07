export function generateFolio(len?: number, charset?: string): string {
  const l = len || 10;
  const c = charset || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let folio = '';
  for (let i = 0, n = c.length; i < l; ++i) {
    folio += c.charAt(Math.floor(Math.random() * n));
  }
  return folio;
}
