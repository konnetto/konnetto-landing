# Konnetto Landing Page

Landing page pre-release Konnetto, platform komunitas otaku Indonesia.
Stack: Astro 7 + TypeScript + Tailwind CSS v4. Output-nya HTML statis untuk Cloudflare Pages.

| URL        | Isi                                                     |
| ---------- | ------------------------------------------------------- |
| `/`        | Landing page (desain Versi B, fans-first)               |
| `/privasi` | Kebijakan Privasi (draf, perlu tinjauan legal)          |
| `/syarat`  | Syarat dan Ketentuan (draf, perlu tinjauan legal)       |
| `/404`     | Halaman tidak ditemukan (Cloudflare memakainya otomatis) |

Juga dihasilkan saat build: `robots.txt` (`src/pages/robots.txt.ts`), `sitemap-index.xml` + `sitemap-0.xml` (otomatis dari semua halaman lewat `@astrojs/sitemap`), dan `site.webmanifest`.

Desain sumber: canvas Claude Design "Konnetto — Landing page v2", halaman **Versi B**
(artboard desktop 1440, mobile 390, potongan Fandom Passport dan Footer mobile).

## Menjalankan di lokal

Butuh Node.js 22.12 atau lebih baru.

```bash
npm install
cp .env.example .env      # lalu isi, lihat tabel di bawah
npm run dev               # http://localhost:4321
```

## Build

```bash
npm run build     # type check (astro check) lalu build ke folder dist/
npm run preview   # serve isi dist/ di lokal untuk dicek sebelum deploy
```

Perintah lain:

- `npm run check`: type check saja.
- `npm run fonts`: pangkas font Jepang (M PLUS Rounded 1c) supaya hanya berisi huruf yang dipakai di halaman. Jalankan ulang kalau ada teks Jepang baru (lihat `scripts/subset-fonts.mjs`).
- `node scripts/prepare-tsuba.mjs`: siapkan ilustrasi Tsuba mengintip di hero dari `brand/tsuba-peek-side.png`.
- `node scripts/prepare-decorations.mjs`: siapkan avatar decoration dari `brand/decorations/*.png` (ring dipusatkan dan diskalakan otomatis, hasil di `public/img/decorations/`). Daftarkan dekorasi baru di `src/data/decorations.ts`, lalu pasang lewat field `decoration` di `src/data/users.ts`.
- `node scripts/optimize-images.mjs`: ubah gambar sumber PNG/JPG di `brand/img/` jadi WebP di `public/img/` (path sama; gambar di `posts/` juga dapat versi kecil 480px untuk srcset). Gambar baru: taruh di `brand/img/<folder>/`, jalankan script, lalu pakai `asset('<folder>/<nama>.webp')`.
- `npm run icons`: generate ulang favicon (`.ico`, 32 dan 48 px), `apple-touch-icon.png`, dan ikon manifest (`icon-192.png`, `icon-512.png`) dari logo `brand/konnetto-mark.png`.
- OG image (preview link di WhatsApp/X/Discord): `public/og-image-v2.jpg` (1200x630, JPG), dibuat dari `brand/og-image-v2.png`. Ganti file ini kalau desainnya berubah, dan naikkan nama versinya (`-v3`) supaya cache platform ikut diperbarui.

## Deploy ke Cloudflare Pages

Tidak perlu adapter Cloudflare, karena hasil build berupa file statis.

1. Push repo ke GitHub atau GitLab.
2. Di dashboard Cloudflare, buka **Workers & Pages → Create → Pages → Connect to Git**, lalu pilih repo ini.
3. Isi build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Di **Settings → Variables and Secrets**, tambahkan environment variable dari tabel di bawah, untuk Production dan Preview. Kalau perlu, tambahkan juga `NODE_VERSION=22`.
5. Klik **Deploy**. Setiap push ke branch utama akan deploy otomatis, dan branch lain dapat URL preview sendiri.

Bisa juga deploy manual dari lokal tanpa Git:

```bash
npm run build
npx wrangler pages deploy dist --project-name konnetto-landing
```

## Environment variable

Semua variabel berawalan `PUBLIC_` ikut ter-bundle ke JavaScript di browser, jadi jangan taruh secret di sini. Nilainya dibaca saat **build**, sehingga setelah mengubahnya di Cloudflare kamu perlu deploy ulang.

| Variabel                       | Wajib            | Keterangan                                                      |
| ------------------------------ | ---------------- | --------------------------------------------------------------- |
| `PUBLIC_SITE_URL`              | ya               | URL produksi, misalnya `https://konnetto.id`. Dipakai untuk canonical URL dan OG image. |
| `PUBLIC_ASSET_BASE_URL`        | tidak            | Base URL gambar. Kosong = `public/img`. Isi setelah gambar di-upload ke cloud storage. |
| `PUBLIC_FORM_PROVIDER`         | ya               | `formspree`, `tally`, atau `demo`                              |
| `PUBLIC_FORMSPREE_ENDPOINT`    | kalau formspree  | Contoh: `https://formspree.io/f/abcdwxyz`                       |
| `PUBLIC_TALLY_FANS_FORM_ID`    | kalau tally      | ID form Tally untuk fans (dari URL `tally.so/r/<ID>`)           |
| `PUBLIC_TALLY_CREATOR_FORM_ID` | kalau tally      | ID form Tally untuk creator                                     |
| `PUBLIC_UMAMI_WEBSITE_ID`      | tidak            | Kosongkan untuk mematikan analytics                             |
| `PUBLIC_UMAMI_SCRIPT_URL`      | tidak            | Default `https://cloud.umami.is/script.js`. Ganti kalau self-host. |

**Mode demo:** selama endpoint Formspree (atau ID Tally) belum diisi, form otomatis berjalan di mode demo. Form bisa dicoba dan pesan sukses tetap muncul, tapi data tidak dikirim ke mana pun (hanya dicatat di console browser). Log build menampilkan peringatan. Isi endpoint sebelum rilis.

Form selalu mengirim field tersembunyi `role` (`fans`/`creator`) dan `utm_source`. Kalau pakai Tally, buat keduanya sebagai *hidden fields* di form Tally.

Event Umami yang dikirim: `hero-cta-click`, `nav-cta-click`, `form-submit-fans`, `form-submit-creator`, dan `reaction-click`. Nama event-nya ada di `src/lib/analytics.ts`.

## Struktur project

```
src/
  components/
    Navbar.astro
    RichText.astro      teks dengan miring/emoji dari content.ts
    Username.astro      username dengan simbol ✧ ♡ (font simbol)
    hero/               Hero, ChatFeed (+ ChatMessage), MadingPanel (+ MadingCard), Reactions, ReactionPopover, Lightbox
    sections/           Problem, ForFans, Concept (+ FandomPassport), ForCreators, Roadmap, SignupForm, AdminMessage, Footer
  data/                 SEMUA konten dan URL aset ada di sini, bukan di komponen
    content.ts          copy semua section (desktop + versi mobile yang lebih pendek)
    chat-script.ts      naskah chat di hero
    mading-posts.ts     post di mading
    users.ts            username, avatar, badge
    stickers.ts         sticker reaksi
    assets.ts           ilustrasi Tsuba + helper URL gambar
  layouts/BaseLayout.astro   <head>: meta, OG, favicon, font, Umami
  lib/
    config.ts           satu-satunya tempat yang membaca environment variable
    analytics.ts        track() dan nama event
    motion.ts           PauseController (jam animasi yang bisa di-pause), reduced motion, Page Visibility
    events.ts           event antar komponen (overlay terbuka, fanart masuk mading)
    hero-clock.ts       jam pause bersama ChatFeed + MadingPanel
    reactions.ts        label, angka, dan pemilihan "yang bereaksi" (dipakai Reactions + ChatFeed)
    reaction-popover.ts buka/tutup/posisi popup reaksi dan bottom sheet
  pages/                index (landing page), privasi, syarat, 404, robots.txt
  styles/
    global.css          Tailwind theme (dipetakan ke token design system), font, style dasar
    konnetto-ds/        salinan design system: tokens.json, tokens.css, bundle.css (komponen kn-*)
public/
  img/                  avatar, sticker, ilustrasi Tsuba (salinan dari canvas desain)
  fonts/                Unbounded, Plus Jakarta Sans, M PLUS Rounded 1c (dari design system)
  favicon, OG image
brand/                  file sumber: logo, ilustrasi Tsuba, font asli (tidak ikut di-deploy)
scripts/                generate-icons.mjs, subset-fonts.mjs, prepare-tsuba.mjs, prepare-decorations.mjs, optimize-images.mjs
```

**Mengubah teks:** edit `src/data/content.ts`. **Urutan section:** `src/pages/index.astro`.

## Design system

Tampilan dibangun di atas design system Konnetto (folder `src/styles/konnetto-ds/`):

- **Komponen**: pakai class `kn-*` dari `bundle.css` dulu (`kn-btn`, `kn-chip`, `kn-tag`, `kn-bubble`,
  `kn-input`, ...), baru tambahkan Tailwind untuk layout. Jangan edit `bundle.css`; timpa di komponen.
- **Token**: Tailwind hanya mengenal token design system. Warna `bg-surface`, `text-ink-muted`,
  `text-accent-pink`; teks `text-display-1`…`text-caption` (pasangkan `font-display` untuk display/title);
  radius `rounded-lg`, `rounded-pill`, `rounded-bubble`; shadow `shadow-sticker`. Warna bawaan Tailwind
  (`bg-red-500`, dst.) sengaja dimatikan.
- **Breakpoint**: `md` (768px) untuk copy mobile vs desktop, `wide` (1100px) untuk layout dua kolom hero.
  Navbar berganti di 900px (bawaan `kn-nav`).
- Jika aturan design system bertentangan dengan artboard Versi B, **artboard yang diikuti**
  (contoh: reaksi pakai sticker Tsuba, `--ink-muted` = #D3CDE3).

**Mencari pekerjaan yang belum selesai:** cari `TODO(` di folder `src/`. Tiap komponen punya daftar TODO di bagian atas filenya.

## Catatan untuk yang datang dari backend

- File `.astro` terdiri dari dua bagian. Bagian di antara `---` paling atas berjalan saat **build** (mirip template engine di server). Bagian HTML di bawahnya adalah output. `<script>` di dalamnya berjalan di **browser** dan otomatis di-bundle.
- `interface Props` di tiap komponen berfungsi seperti signature fungsi, dan type-nya dicek oleh `astro check`.
- Class seperti `bg-primary` atau `md:grid-cols-3` adalah Tailwind. Prefix `md:`, `lg:`, dan `xl:` artinya "berlaku mulai lebar layar itu ke atas" (mobile-first).
