/**
 * robots.txt: izinkan semua mesin pencari, dan tunjukkan lokasi sitemap (dibuat @astrojs/sitemap).
 * URL situs diambil dari PUBLIC_SITE_URL (astro.config.mjs → site).
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site ?? 'https://konnetto.id').href;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
