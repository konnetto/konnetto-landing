/**
 * Naskah loop chat di hero (komponen ChatFeed), dari artboard Versi B.
 *
 * Cara kerja (akan diimplementasikan di ChatFeed, sesuai artboard):
 *  1. Saat halaman dibuka, `chatConfig.initialVisible` pesan pertama langsung tampil.
 *  2. Setelah `startDelayMs`, pesan berikutnya: typing indicator selama `typingMs`,
 *     lalu pesan naik dari bawah. Jeda `gapMs` sebelum pesan berikutnya mulai mengetik.
 *  3. Setelah pesan terakhir, kembali ke pesan pertama (loop tanpa henti).
 *  4. Tiap `reactionBumpMs`, salah satu angka reaksi di 5 pesan terakhir bertambah satu,
 *     atau (peluang `newReactionChance`, pesan teks) muncul reaksi jenis baru.
 *  5. Pesan fanart "terbang" ke mading dan mendapat label "Masuk Mading".
 *
 * Isi pesan bebas diganti. Semua waktu dalam milidetik.
 */
import type { UserId } from './users';
import type { Reaction, StickerId } from './stickers';
import { asset, type ImageAsset } from './assets';

interface BaseMessage {
  id: string;
  userId: UserId;
  reactions?: Reaction[];
}

export interface TextMessage extends BaseMessage {
  kind: 'text';
  text: string;
  /** Teks tebal (dipakai untuk pesan "teriak"). */
  bold?: boolean;
}

/** Sticker besar sebagai pesan (tanpa teks). */
export interface StickerMessage extends BaseMessage {
  kind: 'sticker';
  stickerId: StickerId;
}

/** Post gambar + caption. Setelah tampil, post ini "masuk mading". */
export interface FanartMessage extends BaseMessage {
  kind: 'fanart';
  image: ImageAsset;
  caption: string;
}

export type ChatMessage = TextMessage | StickerMessage | FanartMessage;

export const chatConfig = {
  /** Jumlah pesan yang langsung tampil saat halaman dibuka. */
  initialVisible: 4,
  /** Jeda sebelum pesan animasi pertama. */
  startDelayMs: 1500,
  /** Lama typing indicator. */
  typingMs: 1100,
  /** Jeda setelah pesan tampil sebelum pesan berikutnya mulai mengetik. */
  gapMs: 1200,
  /** Interval satu angka reaksi bertambah. */
  reactionBumpMs: 2600,
  /** Peluang (0-1) reaksi jenis baru ditambahkan ke pesan teks, bukan menaikkan angka. */
  newReactionChance: 0.4,
  /** Jeda setelah fanart tampil sebelum "masuk mading". Fanart awal: firstSaveDelayMs. */
  saveDelayMs: 1600,
  firstSaveDelayMs: 2200,
  /** Lama animasi terbang ke mading (desktop). Di mobile langsung tersimpan. */
  flyMs: 1000,
  /** Jam pesan pertama; tiap dua pesan, menit bertambah satu (21.04, 21.04, 21.05, ...). */
  startTime: { hour: 21, minute: 4 },
  /** Label setelah fanart masuk mading. Emoji 📌 dari artboard. */
  savedLabel: 'Masuk Mading',
  savedEmoji: '📌',
  typingLabel: 'sedang mengetik...',
} as const;

export const chatScript: ChatMessage[] = [
  // Satu alur obrolan: episode baru keluar, panik spoiler, sketsa di-vote, lalu janjian nobar
  // (nyambung ke post nobar ep 13 di mading-posts.ts). Tiap user punya gaya nulis sendiri.
  {
    id: 'm1',
    kind: 'text',
    userId: 'wibu_akut404',
    text: 'ep 12 barusan... gw belum bisa move on 😭',
    reactions: [{ stickerId: 'spoiler', count: 12 }],
  },
  {
    id: 'm2',
    kind: 'text',
    userId: 'bukanwibu_sumpah',
    text: 'AAAA JANGAN SPOILER GW BARU NYAMPE RUMAH',
    bold: true,
    reactions: [
      { stickerId: 'wkwkwk', count: 17 },
      { stickerId: 'spoiler', count: 5 },
    ],
  },
  {
    id: 'm3',
    kind: 'sticker',
    userId: 'kenzo_kun27',
    stickerId: 'wkwkwk',
  },
  {
    id: 'm4',
    kind: 'fanart',
    userId: 'admin',
    // Sketsa asli (bukan gambar AI). Post ini "masuk mading" lewat animasi, jadi tidak ada
    // di daftar awal mading-posts.ts.
    image: {
      url: asset('posts/tsuba-sketsa-outfit.webp'),
      smallUrl: asset('posts/tsuba-sketsa-outfit-480.webp'),
      width: 800,
      height: 600,
      alt: 'Sketsa WIP tiga outfit Tsuba: hoodie kasual, yukata festival, dan mantel musim dingin',
    },
    caption: 'wip outfit Tsuba buat musim depan. vote dong: 1, 2, atau 3?',
    reactions: [
      { stickerId: 'gilaaa', count: 18 },
      { stickerId: 'kawaii', count: 13 },
      { stickerId: 'oshiku', count: 7 },
    ],
  },
  {
    id: 'm5',
    kind: 'text',
    userId: 'mizuu_desu',
    text: '2!! yukata-nya lucu bgt',
    reactions: [{ stickerId: 'kawaii', count: 4 }],
  },
  {
    id: 'm6',
    kind: 'text',
    userId: 'ririchan',
    text: 'eh nobar ep 13 sabtu jadi kan? aku ikut yaa',
  },
  {
    id: 'm7',
    kind: 'text',
    userId: 'wibu_akut404',
    // Daftar acara lewat tab Aktivitas (sama dengan post nobar di mading). Fandom Passport sengaja
    // tidak disebut di sini: pengunjung belum tahu fiturnya, baru dijelaskan di section Konsep.
    text: 'jadi! daftar di tab aktivitas ya, kursinya tinggal dikit',
    reactions: [{ stickerId: 'gas', count: 9 }],
  },
  {
    id: 'm8',
    kind: 'text',
    userId: 'aoi',
    text: 'nanti aku bawa stiker gratis buat yang dateng nobar hehe ✧',
    reactions: [
      { stickerId: 'gas', count: 5 },
      { stickerId: 'oshiku', count: 3 },
    ],
  },
];

/** Jam tampil untuk pesan ke-`index` (0-based), contoh "21.05". */
export function messageTime(index: number): string {
  const total = chatConfig.startTime.minute + Math.floor(index / 2);
  const hour = chatConfig.startTime.hour + Math.floor(total / 60);
  const minute = total % 60;
  return `${hour}.${String(minute).padStart(2, '0')}`;
}
