export function normalizeNames(names: string): string[] {
  return names
    .trim()
    .replace(/\.|\,|\(|\)/g, "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toUpperCase()
    .split(' ')
    .filter((e) => e.length > 0);
}