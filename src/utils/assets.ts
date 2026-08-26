export function withBase(path: string): string {
  const cleanPath = path.replace(/^\/+/, "");
  const base = import.meta.env.BASE_URL;
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  return `${normalizedBase}${cleanPath}`;
}

export function isBlankImage(value?: string | null): boolean {
  return value === undefined || value === null || value.trim() === "";
}
