/**
 * Semua copy halaman, diambil dari artboard Versi B (desktop 1440 + mobile 390).
 * Urutan export = urutan section di halaman.
 *
 * Kalau copy mobile lebih pendek dari desktop, keduanya disimpan:
 * `body` (desktop) dan `bodyMobile` (mobile, < 768px).
 *
 * Teks dengan format (miring, emoji) memakai tipe RichText, dirender oleh
 * src/components/RichText.astro.
 */
import type { UserId } from './users';
import type { StickerId } from './stickers';

// ---------------------------------------------------------------------------
// Tipe bantu
// ---------------------------------------------------------------------------

/** Potongan teks: string biasa, teks miring berwarna pink, atau emoji dengan label aksesibel. */
export type RichPart = string | { em: string } | { emoji: string; label: string };
export type RichText = string | RichPart[];

export interface Link {
  label: string;
  href: string;
}

/** Kontak resmi. Dipakai di halaman privasi (dan nanti Syarat & Ketentuan). */
export const contact = {
  email: 'halo@konnetto.id',
};

/** id section untuk link anchor. */
export const ANCHORS = {
  top: 'top',
  mading: 'mading',
  fans: 'fans',
  about: 'tentang',
  creator: 'creator',
  signup: 'founding',
} as const;

const a = (id: keyof typeof ANCHORS) => `#${ANCHORS[id]}`;

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

export const meta = {
  // SEO: title <= ~60 karakter (pemisah "|" sesuai pilihan user), description <= ~155 karakter.
  title: 'Konnetto | Rumah Komunitas Otaku Indonesia',
  description:
    'Tempat fans dan creator otaku Indonesia ngobrol, heboh bareng tiap episode baru, dan saling dukung. Daftar komunitas awal Konnetto sekarang.',
};

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------

export const nav = {
  /** Tag kecil di samping logo (desktop), hilang saat scroll. */
  tag: 'Pre-release',
  links: [
    { label: 'Untuk fans', href: a('fans') },
    { label: 'Untuk creator', href: a('creator') },
    { label: 'Tentang', href: a('about') },
  ] satisfies Link[],
  cta: { label: 'Gabung komunitas', href: a('fans') } satisfies Link,
};

// ---------------------------------------------------------------------------
// 1 · Hero
// ---------------------------------------------------------------------------

export const hero = {
  /**
   * Headline dalam tiga potong, karena pemenggalan barisnya beda per layar (artboard):
   *  - desktop: "Tempat orang- / orang yang / ngerti kamu."
   *  - mobile:  "Tempat / orang-orang yang / ngerti kamu."
   * Teks utuhnya tetap "Tempat orang-orang yang ngerti kamu." (`headlineHighlight` berwarna pink).
   */
  headlineParts: ['Tempat', 'orang-', 'orang yang'],
  headlineHighlight: 'ngerti kamu.',
  /** Jam "terkirim" di bubble headline dan lead. */
  sentAt: '21.05',
  lead: 'Konnetto adalah rumah untuk otaku Indonesia: heboh bareng tiap episode baru, ketemu teman sefandom, dan dukung creator favoritmu.',
  primaryCta: { label: 'Gabung komunitas awal', href: a('fans') } satisfies Link,
  //   (spasi tak terputus) supaya panah tidak turun sendirian ke baris baru di layar sempit.
  creatorLink: { label: 'Kamu creator? Daftar jadi Founding Creator →', href: a('signup') } satisfies Link,
};

// Mading komunitas: copy ada di src/data/mading-posts.ts (madingConfig).

// ---------------------------------------------------------------------------
// 2 · Masalah
// ---------------------------------------------------------------------------

export const problem = {
  heading: 'Budaya otaku Indonesia hidup. Tapi tercecer.',
  /** Desktop saja. */
  lead: 'Idol lokal, cosplayer, VTuber, dan artist berkarya setiap minggu. Fans-nya setia. Tapi semuanya tersebar di tempat yang tidak dibuat untuk mereka.',
  rows: [
    {
      title: 'Instagram dan TikTok',
      body: 'Seru buat lihat karya, tapi algoritma yang menentukan apa yang kamu lihat. Obrolannya cepat tenggelam.',
      bodyMobile: 'Seru buat lihat karya, tapi obrolannya cepat tenggelam.',
    },
    {
      title: 'Grup WhatsApp',
      body: 'Ramai, tapi tertutup. Susah ketemu teman baru sefandom.',
      bodyMobile: 'Ramai, tapi susah ketemu teman baru sefandom.',
    },
    {
      title: 'Self-promote',
      body: 'Creator mengurus semuanya sendirian, dan fans harus mencari sendiri di mana karya dan kabarnya.',
      bodyMobile: 'Fans harus cari sendiri di mana karya dan kabar creator-nya.',
    },
  ],
  /** Bubble pink penutup. Desktop saja. */
  closing:
    'Belum ada tempat yang menyimpan siapa kamu di fandom: sesi yang kamu datangi, creator yang kamu dukung, karya yang kamu buat.',
};

// ---------------------------------------------------------------------------
// 3 · Untuk fans
// ---------------------------------------------------------------------------

export const forFans = {
  ask: 'Kamu fan?',
  heading: 'Akhirnya, teman yang nggak bilang ‘itu kan kartun?’',
  lead: 'Aplikasinya belum ada. Daftar sekarang, dan kamu jadi yang pertama kami ajak waktu beta dibuka.',
  /** Bubble "momen", berselang-seling kiri dan kanan. `tone` menentukan warna bubble. */
  moments: [
    { tone: 'primary', text: 'Jam 11 malam, episode baru keluar, dan kamu butuh orang buat teriak bareng.' },
    { tone: 'tertiary', text: 'Oshi-mu nggak harus jadi rahasia lagi.' },
    { tone: 'raised', text: 'Dari kenalan di chat, sampai ketemu di event.' },
    { tone: 'paper', tag: 'Fandom Passport', text: 'Semua fandom yang kamu jalani, tercatat di satu tempat.' },
  ] as { tone: 'primary' | 'tertiary' | 'raised' | 'paper'; text: string; tag?: string }[],
  cta: { label: 'Gabung komunitas awal', href: a('signup') } satisfies Link,
};

// ---------------------------------------------------------------------------
// 4 · Tentang: Fandom Passport, Komunitas, Creator Home
// ---------------------------------------------------------------------------

export const concept = {
  tag: 'Konsep · sedang dibangun',
  heading: 'Rumah untuk creator, fans, dan identitas fandom.',
  passport: {
    title: 'Fandom Passport',
    body: 'Identitas fandom-mu, tercatat dari partisipasi nyata, bukan dibeli.',
    holder: {
      userId: 'mizuu_desu' as UserId,
      since: 'ngefans sejak 2016',
      number: 'Fandom Passport · No. 0042',
      fandoms: ['JJK', 'Frieren', 'Hololive ID'],
      badge: 'Early Member',
    },
    /** Halaman nomor di pojok kertas cap. */
    page: '07',
    /**
     * Cap kegiatan. `mobile: true` = ikut tampil di mobile (artboard mobile maksimal 3 cap).
     * Cap terakhir ("Early Member") dianimasikan "dicap" saat terlihat.
     */
    stamps: [
      { shape: 'round', ink: 'violet', lines: [{ b: 'Event cosplay' }, 'Surabaya', 'Mar 2026'], mobile: true },
      { shape: 'rect', ink: 'pink', lines: [{ b: 'Komunitas JJK' }, 'Indonesia'], mobile: false },
      { shape: 'oval', ink: 'lavender', lines: ['Supporter', { b: 'kopidingin' }], mobile: true },
      { shape: 'rect', ink: 'pink', lines: [{ b: 'Diskusi ep 12' }, '2026'], mobile: false },
      { shape: 'round', ink: 'deep', lines: [{ b: 'Early' }, { b: 'Member' }], mobile: true, thump: true },
    ] as {
      shape: 'round' | 'rect' | 'oval';
      ink: 'violet' | 'pink' | 'lavender' | 'deep';
      lines: (string | { b: string })[];
      mobile: boolean;
      thump?: boolean;
    }[],
    /** Teks aksesibel pengganti mockup (desktop / mobile). */
    alt: 'Contoh Fandom Passport milik salsaaa_: Early Member, badge JJK, Frieren, Hololive ID, dan lima cap kegiatan',
    altMobile:
      'Contoh Fandom Passport milik salsaaa_: Early Member, badge JJK, Frieren, Hololive ID, dan tiga cap kegiatan',
  },
  community: {
    title: 'Komunitas',
    body: 'Tiap creator punya ruangnya sendiri, plus komunitas terbuka buat semua fans.',
    chat: [
      { userId: 'wibu_akut404' as UserId, text: 'nobar ep 13 sabtu jadi ya, siapa ikut?' },
      { userId: 'mizuu_desu' as UserId, text: 'ikut! aku bawa camilan' },
    ],
    session: { label: 'sesi minggu ini:', text: 'nobar ep 13, sabtu 19.00' },
  },
  creatorHome: {
    title: 'Creator Home',
    body: 'Satu rumah untuk karya, commission, dan fans-mu.',
    profile: {
      userId: 'aoi' as UserId,
      status: 'slot comms: 2 tersisa',
      actions: ['lihat karya', 'pre-order'],
    },
  },
};

// ---------------------------------------------------------------------------
// 5 · Untuk creator
// ---------------------------------------------------------------------------

export const forCreators = {
  ask: 'Kamu creator?',
  heading: 'Dari komunitas jadi penghasilan.',
  lead: 'Fans otaku sudah mendukung creator yang mereka sukai: lewat commission, merch, doujin, konvensi, dan dukungan langsung. Kami ingin itu terjadi di rumah yang dipercaya, tempat creator dihargai dan setiap dukungan tercatat.',
  /** Desktop saja. */
  leadExtra:
    'Instagram, TikTok, dan WhatsApp tetap kamu pakai untuk menjangkau orang baru. Konnetto adalah rumah tempat orang-orang yang benar-benar ngerti kamu berkumpul.',
  /** Chip "untuk siapa" (bukan tombol, hanya label). */
  audiences: [
    'Artist',
    'Cosplayer',
    'VTuber',
    'Idol lokal',
    'Musisi dan cover singer',
    'Doujin circle',
    'Content creator',
    'Fotografer',
    'Penulis',
    'Dancer',
  ],
  quotes: [
    { userId: 'aoi' as UserId, text: 'pengen buka commission tanpa ribet DM satu-satu', time: '20.41' },
    { userId: 'tenten_cos' as UserId, text: 'pengen fans yang paling setia dapat akses lebih dekat', time: '20.42' },
    { userId: 'yuuki_nyaa' as UserId, text: 'pengen jual merch langsung ke fans sendiri', time: '20.42' },
  ],
  planNote: 'semua ini sedang kami rencanakan, bareng creator-nya langsung.',
  /** Desktop saja. */
  freeNote: 'Bergabung, ngobrol, dan ikut sesi terbuka selalu gratis. Pengakuan tidak bisa dibeli.',
  cta: { label: 'Jadi Founding Creator', href: a('signup') } satisfies Link,
};

// ---------------------------------------------------------------------------
// 6 · Roadmap
// ---------------------------------------------------------------------------

export const roadmap = {
  heading: 'Bukti dulu, fitur kemudian.',
  lead: 'Kami tidak mau membangun aplikasi yang tidak dipakai. Jadi kami mulai dari yang paling sederhana: bersama sejumlah kecil creator, menguji apakah mereka dan fans-nya mau kumpul di satu rumah.',
  leadMobile:
    'Kami mulai dari yang paling sederhana: bersama sejumlah kecil creator, menguji apakah mereka dan fans-nya mau kumpul di satu rumah.',
  hereLabel: 'kamu di sini',
  chapters: [
    {
      title: 'Chapter 0 · Validasi',
      body: 'Mengumpulkan fans dan creator pertama yang mau membangun Konnetto bareng.',
      now: true,
      stickerId: 'gas' as StickerId,
    },
    {
      title: 'Chapter 1 · Private beta',
      body: 'Fandom Passport, Creator Home, dan komunitas pertama, untuk creator yang diundang.',
      now: false,
    },
    {
      title: 'Chapter 2 · Launch',
      body: 'Dibuka untuk semua creator dan fans otaku Indonesia.',
      now: false,
    },
  ] as { title: string; body: string; now: boolean; stickerId?: StickerId }[],
};

// ---------------------------------------------------------------------------
// 7 · Form (dua jalur: fans / creator)
// ---------------------------------------------------------------------------

export type SignupRole = 'fans' | 'creator';

export const signup = {
  heading: 'Bangun Konnetto bareng kami.',
  tablistLabel: 'Pilih jalur',
  defaultTab: 'fans' as SignupRole,
  honestNote: { strong: 'Jujur dari kami:', text: 'ini masih tahap awal. Masukanmu akan langsung membentuk produknya.' },
  fans: {
    tab: 'Aku fans',
    intro: 'Daftar sekarang, dan ikut membentuk Konnetto dari awal bareng fans dan creator lain.',
    formLabel: 'Gabung komunitas awal',
    fields: {
      name: 'Nama',
      contact: 'Email atau WhatsApp',
      fandom: 'Fandom atau oshi',
      watching: 'Lagi nonton anime apa musim ini?',
    },
    /** Contoh isian (placeholder). Sengaja santai, bukan instruksi formal. */
    placeholders: {
      name: 'Nadia, Raka...',
      contact: 'kamu@gmail.com',
      fandom: 'Frieren, JKT48, dll',
      watching: 'Dandadan, Haikyuu...',
    },
    submit: 'Gabung komunitas awal',
  },
  creator: {
    tab: 'Aku creator',
    intro: 'Kami sedang mencari creator otaku Indonesia yang aktif berkarya untuk fandom, dengan karya SFW.',
    getsTitle: 'Yang kamu dapat',
    gets: [
      'Creator Home yang kami bantu siapkan',
      'Badge Founding Creator permanen',
      'Suara langsung dalam membentuk Konnetto',
    ],
    formLabel: 'Pengajuan Founding Creator',
    fields: {
      name: 'Nama',
      email: 'Email',
      handle: 'Handle Instagram / X / TikTok',
      handlePlaceholder: '@kopidingin',
      portfolio: 'Link karya',
      portfolioPlaceholder: 'link IG, Pixiv, atau Drive',
      roles: 'Peran (boleh lebih dari satu)',
      roleOtherPlaceholder: 'misal: crafter prop, MC event',
      fandom: 'Fandom atau oshi',
      sfw: 'Karyaku SFW',
    },
    /** Contoh isian (placeholder) untuk field tanpa placeholder di atas. */
    placeholders: {
      name: 'nama panggung',
      email: 'kamu@gmail.com',
      fandom: 'Genshin, VTuber ID',
    },
    /** Chip multi-select. "Lainnya" memunculkan input teks. */
    roles: [
      'Artist',
      'Cosplayer',
      'VTuber',
      'Idol lokal',
      'Musisi & cover singer',
      'Doujin circle',
      'Content creator',
      'Fotografer',
      'Penulis',
      'Dancer',
      'Lainnya',
    ],
    roleOther: 'Lainnya',
    submit: 'Kirim pengajuan',
    note: 'Kami baca setiap pengajuan satu per satu, dan akan menghubungimu lewat email.',
  },
  // Pesan sukses ada di src/lib/config.ts (formConfig.successMessage).
  /** Baris persetujuan di bawah tombol daftar (tidak ada di artboard; dibutuhkan karena form mengumpulkan data pribadi). */
  consent: {
    before: 'Dengan mendaftar, kamu setuju dengan',
    terms: { label: 'Syarat dan Ketentuan', href: '/syarat' },
    between: 'serta',
    privacy: { label: 'Kebijakan Privasi', href: '/privasi' },
    after: 'kami.',
  },
  // TODO: teks status di bawah belum ada di artboard; ini usulan, silakan disesuaikan.
  status: {
    sending: 'Mengirim...',
    error: 'Maaf, pendaftaranmu belum terkirim. Coba lagi sebentar lagi, ya.',
    contactInvalid: 'Isi dengan alamat email atau nomor WhatsApp yang valid, ya.',
    /** Hanya tampil di mode demo (belum ada backend form). */
    demo: 'Mode demo: pendaftaran belum disimpan.',
  },
};

// ---------------------------------------------------------------------------
// 8 · Pesan dari tim
// ---------------------------------------------------------------------------

export const adminMessage = {
  heading: 'Karena budaya ini layak punya rumah.',
  /** Di mobile hanya `mobileVisible` bubble pertama yang tampil; sisanya di balik tombol. */
  mobileVisible: 4,
  moreLabel: 'lanjut baca ↓',
  messages: [
    { time: '21.12', text: ['halo, kami yang bikin Konnetto ', { emoji: '👋', label: 'melambai' }] },
    {
      time: '21.13',
      text: [
        'kami juga wibu. bertahun-tahun pindah-pindah grup WA, follow artist satu-satu di X, nungguin event tiap bulan. seru, tapi nggak pernah ada satu tempat yang kerasa kayak ',
        { em: 'rumah' },
        '.',
      ],
    },
    { time: '21.13', text: 'dan buat teman-teman creator, kami sering lihat ini:' },
    {
      time: '21.14',
      text: 'buka comms, yang nanya banyak, yang jadi dikit. pre-order merch masih pakai google form, ngecek transferan satu-satu.',
    },
    { time: '21.14', text: 'ketemu banyak fans baru di event, tapi abis event bubar, nggak tau lagi mereka di mana.' },
    { time: '21.15', text: 'jadi kami bikin Konnetto. pelan-pelan, langsung bareng komunitasnya.' },
    {
      time: '21.16',
      text: 'kalau kamu ngerasain hal yang sama, entah kamu fans atau creator, daftar yuk. kami pengen denger ceritamu.',
    },
  ] as { time: string; text: RichText }[],
  cta: { label: 'Gabung komunitas awal', href: a('signup') } satisfies Link,
};

// ---------------------------------------------------------------------------
// 9 · Footer
// ---------------------------------------------------------------------------

export const footer = {
  // Link footer memakai '/#...' supaya tetap benar dari halaman lain (misalnya /privasi).
  farewell: { time: '21.17', text: ['sampai ketemu di beta ', { emoji: '👋', label: 'melambai' }] as RichText },
  note: 'Kami akan cerita apa yang kami pelajari selama membangun Konnetto, termasuk yang tidak berhasil.',
  // TODO: isi link X dan Instagram (LinkedIn sudah). Link yang diisi otomatis masuk sameAs
  // di JSON-LD halaman utama.
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/konnetto/', icon: 'linkedin' },
    { label: 'X', href: '#', icon: 'x' },
    { label: 'Instagram', href: '#', icon: 'instagram' },
    // Email selalu berfungsi, jadi jadi kontak utama selama link sosial media belum ada.
    { label: `Email Konnetto: ${contact.email}`, href: `mailto:${contact.email}`, icon: 'email' },
  ] as { label: string; href: string; icon: 'linkedin' | 'x' | 'instagram' | 'email' }[],
  links: [
    { label: 'Untuk fans', href: '/' + a('fans') },
    { label: 'Untuk creator', href: '/' + a('creator') },
    { label: 'Tentang', href: '/' + a('about') },
    { label: 'Kebijakan privasi', href: '/privasi' },
    { label: 'Syarat dan ketentuan', href: '/syarat' },
  ] satisfies Link[],
  legal: [
    'ilustrasi Tsuba di halaman ini masih konsep sementara. versi final sedang kami siapkan bareng ilustrator lokal.',
    '© 2026 Konnetto',
  ],
  kana: 'コネット',
  wordmark: 'konnetto',
};
