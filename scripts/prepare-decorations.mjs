/**
 * Siapkan avatar decoration (hiasan di sekeliling avatar) dari brand/decorations/*.png.
 * Jalankan: node scripts/prepare-decorations.mjs
 *
 * Tiap gambar sumber punya lingkaran (ring) dengan posisi dan ukuran berbeda. Supaya komponen
 * Avatar cukup memakai satu aturan (dekorasi 1,5x avatar, di tengah), script ini:
 *  1. Membuang potongan gambar lain yang menempel di tepi bawah (sisa crop sticker sheet).
 *  2. Mencari ring: dari tengah, tembakkan sinar ke segala arah, catat piksel tak transparan
 *     pertama, lalu cocokkan lingkaran dengan RANSAC (hiasan yang masuk ke dalam ring diabaikan).
 *  3. Menskalakan dan menggeser gambar supaya tepi dalam ring = tepi avatar, dan pusat ring =
 *     pusat kanvas. Kanvas = DECORATION_SCALE x diameter avatar.
 *  4. Menyimpan WebP ke public/img/decorations/<nama>.webp.
 *
 * Hasilnya juga dicetak: kalau ada hiasan yang terpotong kanvas, angkanya akan terlihat.
 */
import sharp from 'sharp';
import { readdirSync, mkdirSync } from 'node:fs';

const SOURCE_DIR = 'brand/decorations';
const OUTPUT_DIR = 'public/img/decorations';
/** Ukuran kanvas hasil (px). Avatar terbesar 56px -> dekorasi 84px, 2x = 168px. */
const OUTPUT_SIZE = 192;
/** Harus sama dengan DECORATION_SCALE di src/data/decorations.ts. */
const DECORATION_SCALE = 1.5;
/** Tepi avatar sedikit masuk ke bawah garis ring supaya tidak ada celah. */
const RING_OVERLAP = 1.04;

mkdirSync(OUTPUT_DIR, { recursive: true });

for (const file of readdirSync(SOURCE_DIR).filter((f) => f.endsWith('.png'))) {
  const name = file.replace(/\.png$/, '');
  const { data, info } = await sharp(`${SOURCE_DIR}/${file}`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const alpha = (x, y) => data[(y * w + x) * 4 + 3];

  // 1. Buang komponen terhubung yang menyentuh tepi bawah
  const seen = new Uint8Array(w * h);
  let removed = 0;
  for (let x = 0; x < w; x++) {
    const start = (h - 1) * w + x;
    if (seen[start] || alpha(x, h - 1) <= 8) continue;
    const stack = [start];
    seen[start] = 1;
    while (stack.length) {
      const i = stack.pop();
      data[i * 4 + 3] = 0;
      removed++;
      const px = i % w;
      const py = (i - px) / w;
      for (const [nx, ny] of [[px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]]) {
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const j = ny * w + nx;
        if (!seen[j] && alpha(nx, ny) > 8) {
          seen[j] = 1;
          stack.push(j);
        }
      }
    }
  }

  // 2. Titik tepi dalam ring
  const seed = { x: w / 2, y: h * 0.46 };
  const points = [];
  for (let a = 0; a < 360; a += 1) {
    const dx = Math.cos((a * Math.PI) / 180);
    const dy = Math.sin((a * Math.PI) / 180);
    for (let r = 20; r < w; r++) {
      const x = Math.round(seed.x + dx * r);
      const y = Math.round(seed.y + dy * r);
      if (x < 0 || y < 0 || x >= w || y >= h) break;
      if (alpha(x, y) > 128) {
        points.push({ x, y });
        break;
      }
    }
  }
  const circleFrom = (p1, p2, p3) => {
    const d = 2 * (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y));
    if (Math.abs(d) < 1e-6) return null;
    const s1 = p1.x ** 2 + p1.y ** 2;
    const s2 = p2.x ** 2 + p2.y ** 2;
    const s3 = p3.x ** 2 + p3.y ** 2;
    const cx = (s1 * (p2.y - p3.y) + s2 * (p3.y - p1.y) + s3 * (p1.y - p2.y)) / d;
    const cy = (s1 * (p3.x - p2.x) + s2 * (p1.x - p3.x) + s3 * (p2.x - p1.x)) / d;
    return { cx, cy, r: Math.hypot(p1.x - cx, p1.y - cy) };
  };
  // RANSAC deterministik (LCG) supaya hasil sama tiap dijalankan
  let seedRng = 7;
  const rand = () => ((seedRng = (seedRng * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
  let best = null;
  let bestInliers = [];
  for (let i = 0; i < 4000; i++) {
    const pick = () => points[Math.floor(rand() * points.length)];
    const c = circleFrom(pick(), pick(), pick());
    if (!c || c.r < w * 0.15 || c.r > w * 0.5) continue;
    const inliers = points.filter((p) => Math.abs(Math.hypot(p.x - c.cx, p.y - c.cy) - c.r) < 3);
    if (inliers.length > bestInliers.length) {
      best = c;
      bestInliers = inliers;
    }
  }
  // Rapikan: rata-rata jarak inlier ke pusat, pusat = rata-rata titik dengan koreksi kecil
  let { cx, cy } = best;
  for (let k = 0; k < 20; k++) {
    const r = bestInliers.reduce((s, p) => s + Math.hypot(p.x - cx, p.y - cy), 0) / bestInliers.length;
    let gx = 0;
    let gy = 0;
    for (const p of bestInliers) {
      const d = Math.hypot(p.x - cx, p.y - cy);
      gx += ((d - r) * (cx - p.x)) / d;
      gy += ((d - r) * (cy - p.y)) / d;
    }
    cx -= gx / bestInliers.length;
    cy -= gy / bestInliers.length;
  }
  const r = bestInliers.reduce((s, p) => s + Math.hypot(p.x - cx, p.y - cy), 0) / bestInliers.length;

  // 3. Skala & geser: radius avatar di kanvas hasil = OUTPUT_SIZE / DECORATION_SCALE / 2
  const avatarRadius = OUTPUT_SIZE / DECORATION_SCALE / 2;
  const scale = avatarRadius / (r * RING_OVERLAP);
  const scaledW = Math.round(w * scale);
  const scaledH = Math.round(h * scale);
  const left = Math.round(OUTPUT_SIZE / 2 - cx * scale);
  const top = Math.round(OUTPUT_SIZE / 2 - cy * scale);

  // Cek apakah ada piksel terlihat yang jatuh di luar kanvas
  let clipped = 0;
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      if (alpha(x, y) <= 40) continue;
      const ox = x * scale + left;
      const oy = y * scale + top;
      if (ox < 0 || oy < 0 || ox >= OUTPUT_SIZE || oy >= OUTPUT_SIZE) clipped++;
    }
  }

  const cleaned = await sharp(data, { raw: { width: w, height: h, channels: 4 } }).resize(scaledW, scaledH).png().toBuffer();
  // Tempel di kanvas transparan, lalu potong bagian yang keluar (dua langkah: di sharp,
  // extract dijalankan sebelum composite kalau digabung dalam satu pipeline)
  const canvasSize = OUTPUT_SIZE + 2 * Math.max(scaledW, scaledH);
  const pad = Math.max(scaledW, scaledH);
  const placed = await sharp({ create: { width: canvasSize, height: canvasSize, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: cleaned, left: left + pad, top: top + pad }])
    .png()
    .toBuffer();
  await sharp(placed)
    .extract({ left: pad, top: pad, width: OUTPUT_SIZE, height: OUTPUT_SIZE })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(`${OUTPUT_DIR}/${name}.webp`);

  console.log(
    `${name}: ring pusat (${cx.toFixed(0)}, ${cy.toFixed(0)}) r=${r.toFixed(0)}, inlier ${bestInliers.length}/${points.length}, ` +
      `sisa tepi bawah dibuang ${removed}px, terpotong kanvas ${clipped}`,
  );
}
