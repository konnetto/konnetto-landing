/**
 * Avatar decoration: hiasan di sekeliling avatar (seperti di Misskey/Discord).
 *
 * File WebP dibuat dari brand/decorations/*.png dengan `node scripts/prepare-decorations.mjs`.
 * Script itu menormalkan tiap gambar: ring tepat di tengah dan tepi dalamnya = tepi avatar,
 * jadi komponen cukup menaruh dekorasi DECORATION_SCALE x ukuran avatar, di tengah.
 * Menambah dekorasi: taruh PNG transparan di brand/decorations/, jalankan script, lalu
 * tambahkan ke daftar di bawah.
 */
import { asset } from './assets';

/** Ukuran dekorasi dibanding avatar. Harus sama dengan DECORATION_SCALE di script. */
export const DECORATION_SCALE = 1.5;
/** Ukuran file dekorasi (px). */
export const DECORATION_FILE_SIZE = 192;

export interface Decoration {
  id: string;
  /** Nama tampilan (belum dipakai di UI, untuk referensi). */
  name: string;
  url: string;
}

export const decorations = [
  { id: 'burung', name: 'Burung', url: asset('decorations/burung.webp') },
  { id: 'bulan', name: 'Bulan', url: asset('decorations/bulan.webp') },
  { id: 'sakura', name: 'Sakura', url: asset('decorations/sakura.webp') },
  { id: 'chat', name: 'Chat', url: asset('decorations/chat.webp') },
  { id: 'early-member', name: 'Early Member', url: asset('decorations/early-member.webp') },
] as const satisfies readonly Decoration[];

export type DecorationId = (typeof decorations)[number]['id'];

export function getDecoration(id: DecorationId): Decoration {
  const found = decorations.find((d) => d.id === id);
  if (!found) throw new Error(`Dekorasi tidak ditemukan: ${id}`);
  return found;
}
