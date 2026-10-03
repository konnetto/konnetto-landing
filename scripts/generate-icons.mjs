/**
 * Generate favicon dan OG image placeholder dari logo brand/konnetto-mark.png.
 * Jalankan: npm run icons
 *
 * Sumber: gambar persegi (tanpa transparansi) berisi kotak ungu bersudut bulat dengan
 * margin putih di sekelilingnya. Script ini memotong kotak ungunya, lalu:
 *  - favicon (16/32/48 px + favicon.ico): sudut di luar lengkungan dibuat transparan,
 *    supaya tidak ada pojok putih di tab browser bertema gelap.
 *  - apple-touch-icon (180 px): kotak ungu penuh tanpa sudut, karena iOS membulatkan sendiri.
 *  - icon-192 / icon-512 (site.webmanifest, Android): juga kotak penuh, aman untuk ikon
 *    'maskable' yang dipotong bulat/kotak oleh sistem.
 *
 * Kalau logo diganti, cukup timpa brand/konnetto-mark.png lalu jalankan ulang.
 * TODO: ganti og-image dengan desain final (1200x630) kalau sudah ada; cukup timpa
 *       public/og-image.png dan hapus bagian OG di bawah.
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const SOURCE = 'brand/konnetto-mark.png';
/** Warna latar kotak di logo (diambil dari gambar), dipakai untuk mengisi sudut apple-touch-icon. */
const MARK_PURPLE = '#5B30E5';
/** Margin putih di sekeliling kotak pada gambar sumber 1092px, dan radius sudut kotak. */
const MARGIN_RATIO = 18 / 1092;
const RADIUS_RATIO = 0.21;

const meta = await sharp(SOURCE).metadata();
const margin = Math.round(meta.width * MARGIN_RATIO);
const size = meta.width - margin * 2;

// Kotak ungu saja, sudut di luar lengkungan transparan.
const roundedMask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${Math.round(size * RADIUS_RATIO)}" fill="#fff"/></svg>`,
);
const mark = await sharp(SOURCE)
  .extract({ left: margin, top: margin, width: size, height: size })
  .ensureAlpha()
  .composite([{ input: roundedMask, blend: 'dest-in' }])
  .png()
  .toBuffer();

const pngAt = (px) => sharp(mark).resize(px, px).png().toBuffer();

// favicon PNG
await writeFile('public/favicon-32.png', await pngAt(32));
await writeFile('public/favicon-48.png', await pngAt(48));

// favicon.ico: format ICO yang berisi PNG 16, 32, dan 48 px
const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(icoSizes.map(pngAt));
const header = Buffer.alloc(6 + 16 * icoSizes.length);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // tipe: icon
header.writeUInt16LE(icoSizes.length, 4);
let offset = header.length;
icoSizes.forEach((px, i) => {
  const entry = 6 + i * 16;
  header.writeUInt8(px, entry); // lebar
  header.writeUInt8(px, entry + 1); // tinggi
  header.writeUInt8(0, entry + 2); // jumlah warna palet
  header.writeUInt8(0, entry + 3); // reserved
  header.writeUInt16LE(1, entry + 4); // color planes
  header.writeUInt16LE(32, entry + 6); // bit per piksel
  header.writeUInt32LE(icoImages[i].length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += icoImages[i].length;
});
await writeFile('public/favicon.ico', Buffer.concat([header, ...icoImages]));

// Apple touch icon: kotak ungu penuh (sudut diisi ungu), iOS membulatkan sendiri.
await sharp(mark).resize(180, 180).flatten({ background: MARK_PURPLE }).png().toFile('public/apple-touch-icon.png');

// Ikon web manifest (Android / 'Add to Home screen')
for (const px of [192, 512]) {
  await sharp(mark).resize(px, px).flatten({ background: MARK_PURPLE }).png().toFile(`public/icon-${px}.png`);
}

// OG image placeholder 1200x630
const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="g" cx="0.75" cy="0.2" r="0.8">
      <stop offset="0" stop-color="#5C2FDE" stop-opacity="0.75"/>
      <stop offset="1" stop-color="#0F0B1A" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0F0B1A"/>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="96" y="400" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="120" fill="#F9F9F9">konnetto</text>
  <text x="100" y="470" font-family="Arial, sans-serif" font-size="40" fill="#F5B4CF">Tempat orang-orang yang ngerti kamu · pre-release</text>
</svg>`;
await sharp(Buffer.from(og))
  .composite([{ input: await pngAt(140), left: 96, top: 150 }])
  .png()
  .toFile('public/og-image.png');

console.log('Favicon, apple-touch-icon, ikon manifest, dan OG image dibuat di public/');
