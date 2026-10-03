/**
 * Post di mading komunitas (MadingPanel). Sengaja tanpa gambar AI: isinya post teks dari admin
 * dan anggota (copy usulan, belum ada di artboard),
 * satu slot ajakan untuk creator (madingConfig.slot), dan sketsa yang masuk dari chat.
 * Desktop: tumpukan kartu yang pelan-pelan bergeser di sisi kanan hero.
 * Mobile: section tersendiri di bawah hero, kartu digeser ke samping.
 * Emoji di caption berasal dari artboard.
 */
import type { UserId } from './users';
import type { Reaction } from './stickers';
import type { ImageAsset } from './assets';

export interface MadingPost {
  id: string;
  authorId: UserId;
  /** Waktu relatif, cukup teks statis. */
  ago: string;
  /** Opsional: tanpa gambar = post teks. */
  image?: ImageAsset & { /** object-position supaya wajah Tsuba tidak terpotong */ position: string };
  /** Boleh berisi custom emoji gaya Discord, contoh ":ikut:" (postStickers di stickers.ts). */
  caption: string;
  reactions: Reaction[];
}

export const madingConfig = {
  /** Judul section di mobile. */
  title: 'mading komunitas',
  note: 'chat boleh rame, post-mu tetep keliatan.',
  /** Meta kartu desktop: "di Konnetto · 2 jam". */
  community: 'Konnetto',
  /** Waktu untuk fanart yang baru masuk dari chat. */
  justNow: 'baru saja',
  /**
   * Kartu slot ajakan untuk creator (pengganti gambar contoh). Copy belum ada di artboard;
   * ini usulan. Tombolnya membuka tab creator di form.
   */
  slot: {
    meta: 'slot terbuka',
    label: 'Slot karya',
    hint: 'fanart, cosplay, komik, apa aja',
    caption: 'Karyamu bisa nongol di sini! Slot ini buat Founding Creator pertama.',
    cta: { label: 'Jadi Founding Creator', href: '#founding' },
  },

  // --- Animasi feed desktop (nilai dari artboard) ---
  /** Kecepatan feed bergeser ke atas, px per detik. */
  scrollSpeed: 24,
  /** Posisi awal feed: kartu pertama mulai 150px di atas tepi (tertutup gradasi). */
  startOffset: -150,
  /** Kartu saling tumpang 20px (margin negatif). */
  overlap: 20,
  /** Kartu teratas dipindah ke bawah setelah lewat sejauh ini di atas tepi. */
  recycleMargin: 60,
  /** Interval dan peluang angka reaksi di kartu yang terlihat bertambah. */
  bumpMs: 2600,
  bumpChance: 0.45,
  /** Fanart terbang dari chat: skala awal dan tinggi lengkungan (px, lebih tinggi supaya tidak menutupi headline). */
  flyStartScale: 0.5,
  flyArc: 260,
  /** Posisi mendarat: tepi atas kartu sekian px di atas tepi bawah feed. */
  landFromBottom: 500,
} as const;

export const madingPosts: MadingPost[] = [
  {
    id: 'p1',
    authorId: 'admin',
    ago: '1 hari',
    caption: 'beta Konnetto lagi disiapin. daftar dulu biar jadi yang pertama diajak masuk ✨',
    reactions: [
      { stickerId: 'gas', count: 32 },
      { stickerId: 'oshiku', count: 12 },
      { stickerId: 'gilaaa', count: 5 },
    ],
  },
  {
    id: 'p2',
    authorId: 'wibu_akut404',
    ago: '5 jam',
    // Tempat fiktif di area nyata (Blok M, 'Little Tokyo' Jakarta). Ganti kalau sudah ada venue beneran.
    caption: 'yang mau nobar ep 13 bareng angkat tangan! sabtu jam 7 malem di Kotatsu Cafe, Blok M, lokasinya udah gw pin di map. kursi cuma 20, daftar di tab aktivitas sebelum abis. telat = nonton sendirian di kos 😭',
    // IKUT! sebagai reaksi (bukan emoji di kalimat): jumlah orang yang 'angkat tangan'.
    reactions: [
      { stickerId: 'ikut', count: 18 },
      { stickerId: 'gas', count: 23 },
      { stickerId: 'oshiku', count: 4 },
    ],
  },
  {
    id: 'p3',
    authorId: 'tenten_cos',
    ago: 'kemarin',
    // Post creator: menunjukkan fitur Creator Home (jadwal di profil, pre-order) seperti di Weverse.
    caption: 'jadwal live bulan ini udah up di profil yaa. sabtu ini aku juga buka PO photobook Castorice, cuma 30 biji. siapa cepat dia dapet hehe',
    reactions: [
      { stickerId: 'gilaaa', count: 8 },
      { stickerId: 'gas', count: 6 },
    ],
  },
];
