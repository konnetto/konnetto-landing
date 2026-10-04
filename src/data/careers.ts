/**
 * Halaman karier: /karier (daftar lowongan) dan /karier/[slug] (detail).
 * Tampilan dari artboard Karier, KarierLogo, dan KarierIlustrator (desktop 1440 + mobile 390).
 * Copy mengikuti brief halaman karier kalau berbeda dengan artboard.
 *
 * Menambah lowongan: tambahkan satu objek ke `jobs`. Halaman detail, card di daftar, jumlah
 * lowongan, dan sitemap ikut otomatis. `slug` jadi URL (/karier/<slug>), jangan diganti setelah
 * dibagikan.
 *
 * Catatan copy: jangan sebut nama maskot di sini (cukup "maskot").
 */
import type { RichText } from './content';

/** Alamat email lamaran. TODO: aktifkan di Email Routing (sama seperti halo@konnetto.id). */
export const careersEmail = 'karier@konnetto.id';

/** Chip di card daftar dan di halaman detail (harus sama persis). */
export type JobTag = 'Freelance' | 'Remote' | 'Proyek satu kali' | 'Harga bisa didiskusikan';

export interface Job {
  /** Bagian URL: /karier/<slug>. */
  slug: string;
  /** Nama posisi, dipakai di card, title halaman, dan subject email. */
  title: string;
  /**
   * Judul besar di halaman detail, dipecah per baris seperti artboard
   * (misalnya ['Logo & Brand', 'Designer']).
   */
  titleLines: string[];
  /** Satu kalimat di card daftar. */
  summary: string;
  /** Meta description halaman detail (SEO), <= ~155 karakter. */
  metaDescription: string;
  tags: JobTag[];
  /** "Yang bakal kamu kerjakan" */
  tasks: string[];
  /** "Nilai plus kalau kamu…" */
  niceToHave: string[];
  /** "Detail proyek" */
  details: {
    /** Hasil akhir (deliverables). */
    deliverables: string[];
    /** Perkiraan waktu. TODO: isi kalau sudah pasti. */
    timeline: string;
    /** Kisaran budget. TODO: isi kalau sudah pasti. */
    budget: string;
    /** Hak penggunaan hasil karya. */
    usageRights: string;
  };
}

const TAGS: JobTag[] = ['Freelance', 'Remote', 'Proyek satu kali', 'Harga bisa didiskusikan'];
const TO_DISCUSS = 'bisa didiskusikan';
const USAGE_RIGHTS =
  'hasil karya dipakai untuk kebutuhan komersial Konnetto (termasuk modifikasi dan merchandise), dengan kredit untuk kamu.';

export const jobs: Job[] = [
  {
    slug: 'logo-brand-designer',
    title: 'Logo & Brand Designer',
    titleLines: ['Logo & Brand', 'Designer'],
    summary: 'Finalisasi logo dan identitas visual Konnetto, dari ikon aplikasi sampai panduan brand.',
    metaDescription:
      'Lowongan freelance Logo & Brand Designer di Konnetto: finalisasi logo, ikon aplikasi, dan panduan brand. Remote, proyek satu kali, harga bisa didiskusikan.',
    tags: TAGS,
    tasks: [
      'merapikan dan memfinalkan logo Konnetto dari konsep yang sudah ada: bulan sabit, burung yang melambangkan koneksi, dan orbit',
      'versi logo untuk berbagai ukuran: ikon aplikasi, favicon, dan wordmark',
      'panduan brand sederhana: penggunaan logo, warna, dan tipografi',
      'template visual untuk media sosial',
    ],
    niceToHave: [
      'punya pengalaman bikin identitas brand atau logo',
      'bisa bikin desain yang tetap jelas di ukuran sangat kecil',
      'akrab dengan budaya otaku Indonesia',
    ],
    details: {
      deliverables: [
        'logo final Konnetto',
        'versi logo untuk ikon aplikasi, favicon, dan wordmark',
        'panduan brand sederhana: logo, warna, dan tipografi',
        'template visual untuk media sosial',
      ],
      timeline: TO_DISCUSS,
      budget: TO_DISCUSS,
      usageRights: USAGE_RIGHTS,
    },
  },
  {
    slug: 'ilustrator-anime',
    title: 'Ilustrator Anime',
    titleLines: ['Ilustrator', 'Anime'],
    summary: 'Gambar maskot, sticker, dan ilustrasi yang jadi wajah Konnetto.',
    metaDescription:
      'Lowongan freelance Ilustrator Anime di Konnetto: desain maskot, sticker reaksi, dan ilustrasi. Remote, proyek satu kali, harga bisa didiskusikan.',
    tags: TAGS,
    tasks: [
      'desain final maskot Konnetto: full body, chibi, dan beberapa ekspresi',
      'sticker reaksi dan avatar decoration',
      'ilustrasi untuk landing page dan media sosial',
    ],
    niceToHave: [
      'gaya gambar anime yang kuat dan konsisten',
      'terbiasa bikin sticker atau chibi',
      'akrab dengan budaya otaku Indonesia',
    ],
    details: {
      deliverables: [
        'desain final maskot: full body, chibi, dan beberapa ekspresi',
        'set sticker reaksi dan avatar decoration',
        'ilustrasi untuk landing page dan media sosial',
      ],
      timeline: TO_DISCUSS,
      budget: TO_DISCUSS,
      usageRights: USAGE_RIGHTS,
    },
  },
];

/** Cari lowongan berdasarkan slug (dipakai halaman detail). */
export function getJob(slug: string): Job | undefined {
  return jobs.find((job) => job.slug === slug);
}

/** Link mailto dengan subject sesuai lowongan (artboard): "[Karier] Ilustrator Anime - (nama kamu)". */
export function jobMailto(job: Job): string {
  return `mailto:${careersEmail}?subject=${encodeURIComponent(`[Karier] ${job.title} - (nama kamu)`)}`;
}

/** Copy halaman /karier. */
export const careersPage = {
  meta: {
    title: 'Karier | Konnetto',
    description:
      'Konnetto lagi nyari kreator freelance untuk proyek visual: logo, identitas brand, dan ilustrasi anime. Remote, proyek satu kali, harga bisa didiskusikan.',
  },
  /** Bubble pembuka dari akun admin. */
  greeting: {
    text: ['halo! kami lagi nyari teman buat bikin Konnetto makin hidup ', { emoji: '👋', label: 'melambai' }] as RichText,
    time: '10.02',
  },
  /** Headline per baris (desktop memecahnya seperti artboard). */
  headlineLines: ['Lagi nyari kreator', 'buat proyek', 'visual kami.'],
  headlineTime: '10.03',
  lead: 'Proyek satu kali untuk aset visual Konnetto. Kalau sama-sama cocok, bisa lanjut ke proyek berikutnya.',
  listTitle: 'lowongan yang lagi buka',
  /** Kalimat di bawah daftar. Alamat email dirender sebagai link mailto. */
  footnote: {
    before: 'nggak ada posisi yang cocok tapi pengen kerja bareng? kirim email ke',
    after: '.',
  },
};

/** Copy halaman detail /karier/[slug] (sama untuk semua lowongan). */
export const jobPage = {
  backLink: '← semua lowongan',
  /** Tombol di bawah judul, menuju section "Kirim portofolio". */
  applyCta: 'Kirim portofolio',
  sections: {
    tasks: 'Yang bakal kamu kerjakan',
    niceToHave: 'Nilai plus kalau kamu…',
    details: 'Detail proyek',
    steps: 'Cara kerjanya',
    promises: 'Biar jelas dari awal',
    apply: 'Kirim portofolio',
  },
  detailLabels: {
    deliverables: 'Hasil akhir',
    timeline: 'Perkiraan waktu',
    budget: 'Kisaran budget',
    usageRights: 'Hak penggunaan',
  },
  stepsIntro: 'tiga langkah aja, tanpa tes yang ribet.',
  steps: [
    {
      title: 'kirim portofolio lewat email',
      body: 'ceritain sedikit soal dirimu, lampirkan link karyamu.',
      badge: 'mulai dari sini',
    },
    { title: 'ngobrol soal proyek dan harga', body: 'kami jelasin kebutuhannya, kamu kasih penawaran. santai aja.' },
    { title: 'mulai proyek', body: 'DP di awal, pelunasan setelah selesai.' },
  ] as { title: string; body: string; badge?: string }[],
  /** Bubble dari akun admin. Bubble terakhir menyebut alamat email (dirender sebagai link). */
  promises: [
    { text: 'karyamu dibayar, bukan ‘buat exposure’.', time: '10.05' },
    { text: 'namamu dikreditkan di setiap aset yang kamu buat.', time: '10.05' },
    { text: 'ini proyek satu kali dulu. kalau hasilnya cocok, kami pengen lanjut kerja bareng lagi.', time: '10.06' },
  ],
  promiseEmail: { before: 'kirim portofoliomu ke', after: 'ya!', time: '10.07' },
  apply: {
    sendLabel: 'Kirim email',
    copyLabel: 'Salin alamat email',
    copiedLabel: 'tersalin!',
    copyFailedLabel: 'gagal, salin manual ya',
    note: 'kami baca setiap email, dan bakal kabari kamu dalam beberapa hari.',
    suggestionsTitle: 'isi email yang disarankan',
    suggestions: [
      { label: 'nama dan kontak', hint: 'email atau WhatsApp' },
      { label: 'link portofolio', hint: 'Instagram, X, ArtStation, Behance, atau lainnya' },
      { label: 'kisaran harga per proyek', hint: '(opsional)' },
      { label: 'sedikit cerita tentang dirimu', hint: '(opsional)' },
    ],
  },
};
