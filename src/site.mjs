// SITE_URL is set only for a public build; local previews stay at / and unindexed.
export const siteUrl = process.env.SITE_URL ? new URL(process.env.SITE_URL) : null;
if (siteUrl && (siteUrl.protocol !== 'https:' || siteUrl.search || siteUrl.hash)) {
  throw new Error('SITE_URL must be an HTTPS URL without query or fragment');
}
if (siteUrl && !siteUrl.pathname.endsWith('/')) siteUrl.pathname += '/';
export const basePath = siteUrl ? siteUrl.pathname.replace(/\/$/, '') : '';
export const sitePath = (path) => `${basePath}${path}`;
export const absoluteUrl = (path) => siteUrl ? new URL(sitePath(path), siteUrl.origin).href : path;
