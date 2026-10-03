/**
 * Siapkan ilustrasi Tsuba mengintip untuk hero, dari brand/tsuba-peek-side.png.
 * Jalankan: node scripts/prepare-tsuba.mjs
 *
 * Gambar sumber: Tsuba mengintip dari balik "dinding" vertikal di tepi kanan. Di hero, dinding
 * = kolom mading, dan garis dinding disembunyikan di balik kartu. Script ini memotong gambar
 * tepat di garis dinding (jari yang melewati dinding ikut terbuang, karena tertutup kartu),
 * membuang area kosong, dan menyimpannya sebagai WebP 2x ukuran tampilan.
 *
 * Kalau ilustrasi diganti, cek ulang angka CROP (terutama right = garis dinding).
 */
import sharp from 'sharp';

const SOURCE = 'brand/tsuba-peek-side.png';
const OUTPUT = 'public/img/tsuba/tsuba-peek-side.webp';
/** Area yang dipakai dari gambar sumber (piksel). right = garis dinding. */
const CROP = { left: 341, top: 12, right: 1040, bottom: 1426 };
/** Tinggi hasil (2x tinggi tampilan maksimal 440px). */
const OUTPUT_HEIGHT = 880;

await sharp(SOURCE)
  .extract({ left: CROP.left, top: CROP.top, width: CROP.right - CROP.left, height: CROP.bottom - CROP.top })
  .resize({ height: OUTPUT_HEIGHT })
  .webp({ quality: 90, alphaQuality: 100 })
  .toFile(OUTPUT);

const meta = await sharp(OUTPUT).metadata();
console.log(`${OUTPUT}: ${meta.width}x${meta.height}`);
