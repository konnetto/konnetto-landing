/**
 * Sticker Tsuba untuk reaksi dan pesan sticker di chat (dari artboard Versi B).
 * Catatan: design system menyarankan stamp kanji/kaomoji, tapi artboard memakai
 * sticker gambar, dan artboard yang diikuti.
 */
import { asset } from './assets';

export interface Sticker {
  id: string;
  /** Teks di sticker, juga dipakai untuk alt text: "Sticker Tsuba: GAS". */
  label: string;
  /** Nama reaksi gaya kode, tampil di popup "siapa yang bereaksi". */
  reactName: string;
  url: string;
  /** false = tidak pernah ditambahkan sebagai reaksi acak di chat (dipasang manual saja). */
  randomReaction?: boolean;
}

/** Ukuran asli file sticker (px). */
export const STICKER_FILE_SIZE = 256;

export const stickers = [
  { id: 'gilaaa', label: 'GILAAA', reactName: 'gilaaa', url: asset('stickers/gilaaa.webp') },
  { id: 'gas', label: 'GAS', reactName: 'gas', url: asset('stickers/gas.webp') },
  { id: 'kawaii', label: 'KAWAII BGT', reactName: 'kawaii_bgt', url: asset('stickers/kawaii.webp') },
  { id: 'spoiler', label: 'JANGAN SPOILER', reactName: 'jangan_spoiler', url: asset('stickers/spoiler.webp') },
  { id: 'wkwkwk', label: 'WKWKWK', reactName: 'wkwkwk', url: asset('stickers/wkwkwk.webp') },
  { id: 'oshiku', label: 'OSHI-KU', reactName: 'oshi_ku', url: asset('stickers/oshiku.webp') },
  // Khusus ajakan acara (post nobar di mading): tidak muncul acak di chat.
  { id: 'ikut', label: 'IKUT!', reactName: 'ikut', url: asset('stickers/ikut.webp'), randomReaction: false },
] as const satisfies readonly Sticker[];

export type StickerId = (typeof stickers)[number]['id'];

/**
 * Custom emoji untuk caption post di mading (tulis ":ikut:" di caption). Saat ini tidak dipakai:
 * sticker bergambar terlalu ramai di ukuran teks, jadi IKUT! dipasang sebagai reaksi. Untuk custom
 * emoji, pakai gambar sederhana yang tetap terbaca di ~24px. Sumber: brand/stickers/ (diperkecil ke 108px webp, 3x ukuran tampil).
 */
export const postStickers = {
  ikut: { id: 'ikut', label: 'IKUT!', reactName: 'ikut', url: asset('stickers/ikut.webp') },
} as const satisfies Record<string, Sticker>;

export type PostStickerId = keyof typeof postStickers;

/** Satu jenis reaksi pada pesan atau post: sticker apa dan berapa banyak. */
export interface Reaction {
  stickerId: StickerId;
  count: number;
}

/** Alt text standar sticker. */
export const stickerAlt = (sticker: Sticker) => `Sticker Tsuba: ${sticker.label}`;

export function getSticker(id: StickerId): Sticker {
  const found = stickers.find((s) => s.id === id);
  if (!found) throw new Error(`Sticker tidak ditemukan: ${id}`);
  return found;
}
