/** `public/` 配下の静的ファイル用。GitHub Pages のサブパスでも解決できるよう BASE_URL を付与する */
export function publicUrl(path: string): string {
  const rel = path.startsWith('/') ? path.slice(1) : path
  const base = import.meta.env.BASE_URL
  return base.endsWith('/') ? `${base}${rel}` : `${base}/${rel}`
}
