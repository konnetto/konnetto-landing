/**
 * Pangkas font M PLUS Rounded 1c supaya hanya berisi huruf Jepang yang dipakai di halaman.
 * Jalankan: npm run fonts
 *
 * File font aslinya ~1MB (ribuan huruf Jepang), padahal halaman hanya memakai kana "コネット"
 * di footer. Hasilnya cuma beberapa KB. Sumber asli disimpan di brand/fonts/.
 *
 * Kalau ada teks Jepang baru di halaman, tambahkan hurufnya ke TEXT, jalankan ulang, lalu
 * perbarui unicode-range di @font-face src/styles/global.css.
 */
import subsetFont from 'subset-font';
import { readFile, writeFile } from 'node:fs/promises';

/** Semua huruf Jepang yang dipakai di halaman. Sekarang: kana di footer (content.ts → footer.kana). */
const TEXT = 'コネット';

const source = await readFile('brand/fonts/MPLUSRounded1c-ExtraBold-japanese.woff2');
const subset = await subsetFont(source, TEXT, { targetFormat: 'woff2' });
await writeFile('public/fonts/MPLUSRounded1c-ExtraBold-kana.woff2', subset);

const codepoints = [...new Set(TEXT)].map((char) => `U+${char.codePointAt(0).toString(16).toUpperCase()}`);
console.log(`MPLUSRounded1c-ExtraBold-kana.woff2: ${subset.length} byte (dari ${source.length} byte)`);
console.log(`unicode-range untuk global.css: ${codepoints.join(', ')}`);
