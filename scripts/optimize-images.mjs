/**
 * Ubah gambar sumber (PNG/JPG) di brand/img/ menjadi WebP di public/img/ (path sama).
 * Jalankan: node scripts/optimize-images.mjs
 *
 * Kenapa bukan astro:assets: semua URL gambar dibangun lewat asset() (src/data/assets.ts) supaya
 * bisa dipindah ke cloud storage dengan PUBLIC_ASSET_BASE_URL, dan sebagian gambar dipasang lewat
 * JavaScript (chat, mading, popup reaksi), jadi tidak bisa memakai komponen <Image>. Hasilnya sama:
 * WebP dengan ukuran asli tetap (atribut width/height di komponen tidak berubah).
 *
 * Gambar baru: taruh PNG/JPG di brand/img/<folder>/, jalankan script, lalu pakai
 * asset('<folder>/<nama>.webp'). File yang sudah WebP (dekorasi, Tsuba mengintip) dibuat oleh
 * script masing-masing dan tidak disentuh di sini.
 */
import sharp from 'sharp';
import { readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';

const SOURCE_DIR = 'brand/img';
const OUTPUT_DIR = 'public/img';
/** Lebar versi kecil gambar post (2x lebar tampil di chat mobile). */
const POST_SMALL_WIDTH = 480;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (/\.(png|jpe?g)$/i.test(name)) yield path;
  }
}

let before = 0;
let after = 0;
for (const source of walk(SOURCE_DIR)) {
  const rel = relative(SOURCE_DIR, source).replace(/\.(png|jpe?g)$/i, '.webp');
  const output = join(OUTPUT_DIR, rel);
  mkdirSync(dirname(output), { recursive: true });
  // Post (sketsa/foto): kualitas sedikit lebih rendah + versi kecil 480px untuk srcset di chat
  // (tampil 236-360px). Lainnya (avatar, sticker, ilustrasi transparan): alpha dijaga penuh.
  const isPost = rel.startsWith('posts');
  const info = await sharp(source).webp({ quality: isPost ? 78 : 86, alphaQuality: 100, effort: 6 }).toFile(output);
  if (isPost) {
    const small = output.replace(/\.webp$/, `-${POST_SMALL_WIDTH}.webp`);
    const smallInfo = await sharp(source).resize(POST_SMALL_WIDTH).webp({ quality: 80, effort: 6 }).toFile(small);
    console.log(`  + versi ${POST_SMALL_WIDTH}px: ${Math.round(smallInfo.size / 1024)}KB`);
  }
  const sourceSize = statSync(source).size;
  before += sourceSize;
  after += info.size;
  console.log(`${rel}: ${Math.round(sourceSize / 1024)}KB -> ${Math.round(info.size / 1024)}KB`);
}
console.log(`Total: ${Math.round(before / 1024)}KB -> ${Math.round(after / 1024)}KB`);
