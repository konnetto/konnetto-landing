// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// File .env tidak otomatis masuk ke process.env saat config dibaca,
// jadi kita load manual untuk PUBLIC_SITE_URL.
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

// Ingatkan di log build kalau form masih mode demo (pendaftaran tidak disimpan ke mana pun).
const formReady =
  env.PUBLIC_FORM_PROVIDER === 'tally'
    ? env.PUBLIC_TALLY_FANS_FORM_ID && env.PUBLIC_TALLY_CREATOR_FORM_ID
    : env.PUBLIC_FORM_PROVIDER !== 'demo' && env.PUBLIC_FORMSPREE_ENDPOINT;
if (!formReady) {
  console.warn('\n[konnetto] Form pendaftaran dalam MODE DEMO: data tidak dikirim ke mana pun. Isi PUBLIC_FORMSPREE_ENDPOINT (atau ID Tally) sebelum rilis.\n');
}

// https://astro.build/config
export default defineConfig({
  // URL produksi. Dipakai untuk canonical URL dan URL absolut OG image.
  site: env.PUBLIC_SITE_URL || 'https://konnetto.id',

  // Static output: hasil build berupa HTML/CSS/JS biasa di folder dist/,
  // langsung bisa di-serve Cloudflare Pages. Tidak perlu adapter Cloudflare.
  output: 'static',

  // /a dan /b jadi /a/index.html dan /b/index.html.
  build: { format: 'directory' },
  trailingSlash: 'ignore',

  // sitemap-index.xml + sitemap-0.xml dari semua halaman (404 otomatis tidak ikut).
  // robots.txt (src/pages/robots.txt.ts) menunjuk ke sitemap-index.xml.
  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});
