/**
 * User contoh (awalnya dari artboard Versi B). Username mengikuti aturan handle X/IG: hanya huruf,
 * angka, titik, dan garis bawah, tanpa spasi atau simbol. ID tetap sama dengan versi lama.
 * User muncul di ChatFeed, MadingPanel,
 * ReactionPopover, dan beberapa section (Komunitas, Creator Home, Untuk creator).
 */
import { asset, tsuba } from './assets';
import type { DecorationId } from './decorations';

/** Label badge di popup reaksi. */
export type BadgeKind = 'creator' | 'cosplayer' | 'vtuber' | 'official';

export interface User {
  id: string;
  /**
   * Username gaya handle X/IG: huruf, angka, titik, garis bawah. Sekarang tanpa simbol;
   * kalau nanti ada simbol ✧ ♡ ☆, ia dirender dengan font simbol terpisah (lihat splitUsername).
   */
  username: string;
  avatarUrl: string;
  avatarAlt: string;
  /** Warna username di chat. Nilai dari artboard; sebagian di luar token design system. */
  nameColor: string;
  badge?: { kind: BadgeKind; label: string };
  /** Opsional: hiasan di sekeliling avatar (src/data/decorations.ts). */
  decoration?: DecorationId;
}

/** Ukuran asli file avatar (px). Ukuran tampil diatur komponen. */
export const AVATAR_FILE_SIZE = 160;

export const users = [
  {
    id: 'admin',
    username: 'konnetto.official',
    avatarUrl: tsuba.avatar.url,
    avatarAlt: tsuba.avatar.alt,
    nameColor: '#BCA9F8',
    decoration: 'burung',
    // Badge tampil di popup reaksi (akun ini tidak ada di reactorPool, jadi sekarang belum terlihat).
    badge: { kind: 'official', label: 'official' },
  },
  {
    id: 'wibu_akut404',
    username: 'wibu_akut404',
    avatarUrl: asset('avatars/wibu_akut404.webp'),
    avatarAlt: 'Avatar wibu_akut404',
    nameColor: '#BCA9F8',
    decoration: 'chat',
  },
  {
    id: 'bukanwibu_sumpah',
    username: 'bukanwibu_sumpah',
    avatarUrl: asset('avatars/bukanwibu_sumpah.webp'),
    avatarAlt: 'Avatar bukanwibu_sumpah',
    nameColor: '#F5B4CF',
  },
  {
    id: 'mizuu_desu',
    username: 'salsaaa_',
    avatarUrl: asset('avatars/mizuu_desu.webp'),
    avatarAlt: 'Avatar salsaaa_',
    nameColor: '#FFD3E5',
    decoration: 'sakura',
  },
  {
    id: 'kenzo_kun27',
    username: 'suami_fubuki',
    avatarUrl: asset('avatars/kenzo_kun27.webp'),
    avatarAlt: 'Avatar suami_fubuki',
    nameColor: '#A38CF5',
  },
  {
    id: 'ririchan',
    username: 'luvmatcha',
    avatarUrl: asset('avatars/ririchan.webp'),
    avatarAlt: 'Avatar luvmatcha',
    nameColor: '#E9DEFF',
    badge: { kind: 'cosplayer', label: 'cosplayer' },
  },
  {
    id: 'aoi',
    username: 'kopidingin',
    avatarUrl: asset('avatars/aoi.webp'),
    avatarAlt: 'Avatar kopidingin',
    nameColor: '#F9F9F9',
    decoration: 'early-member',
    badge: { kind: 'creator', label: 'creator' },
  },
  {
    id: 'yuuki_nyaa',
    username: 'kirana_vt',
    avatarUrl: asset('avatars/yuuki_nyaa.webp'),
    avatarAlt: 'Avatar kirana_vt',
    nameColor: '#FFD3E5',
    badge: { kind: 'vtuber', label: 'VTuber' },
  },
  {
    id: 'tenten_cos',
    username: 'tenten.cos',
    avatarUrl: asset('avatars/tenten_cos.webp'),
    avatarAlt: 'Avatar tenten.cos',
    nameColor: '#E9DEFF',
    badge: { kind: 'cosplayer', label: 'cosplayer' },
  },
] as const satisfies readonly User[];

export type UserId = (typeof users)[number]['id'];

/**
 * User yang bisa muncul di popup "siapa yang bereaksi". Artboard memilih
 * beberapa user dari daftar ini secara acak (tapi stabil) untuk tiap reaksi.
 */
export const reactorPool: UserId[] = [
  'mizuu_desu',
  'kenzo_kun27',
  'ririchan',
  'aoi',
  'yuuki_nyaa',
  'wibu_akut404',
  'bukanwibu_sumpah',
  'tenten_cos',
];

/** Cari user berdasarkan id. Melempar error saat build kalau id salah ketik. */
export function getUser(id: UserId): User {
  const user = users.find((u) => u.id === id);
  if (!user) throw new Error(`User tidak ditemukan: ${id}`);
  return user;
}

/**
 * Pecah username jadi { pre, sym, post } supaya simbolnya bisa diberi font simbol.
 * Contoh: 'nama✧contoh' → { pre: 'nama', sym: '✧', post: 'contoh' }.
 */
export function splitUsername(name: string): { pre: string; sym: string; post: string } {
  const match = name.match(/[✧♡☆]/);
  if (!match || match.index === undefined) return { pre: name, sym: '', post: '' };
  return { pre: name.slice(0, match.index), sym: match[0], post: name.slice(match.index + 1) };
}
