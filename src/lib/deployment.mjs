// GitHub's workflow supplies the final Pages URL (including any custom domain).
// Cloudflare and local previews use root-relative paths by default.
export function deployment(env) {
  const url = env.SITE_URL || env.CF_PAGES_URL;
  if (!url) return { base: '/' };
  const parsed = new URL(url);
  if (!['https:', 'http:'].includes(parsed.protocol)) {
    throw new Error('SITE_URL must start with https:// or http://');
  }
  return { site: parsed.origin, base: parsed.pathname.replace(/\/$/, '') || '/' };
}
