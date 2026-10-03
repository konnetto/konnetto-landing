/**
 * Logika reaksi yang dipakai bersama oleh Reactions (klik), ChatFeed (bump otomatis),
 * dan ReactionPopover (daftar siapa yang bereaksi).
 */
import { getSticker, stickerAlt, type StickerId } from '../data/stickers';
import { getUser, reactorPool, type User, type UserId } from '../data/users';
import { canHover } from './motion';

/** Nama reaksi gaya kode, contoh ":kawaii_bgt:". */
export function reactionName(stickerId: StickerId): string {
  return `:${getSticker(stickerId).reactName}:`;
}

/**
 * Label aksesibel tombol reaksi, mengikuti artboard.
 * `withHint`: tambahkan petunjuk klik/ketuk. Hanya bisa di browser (perlu tahu jenis layar),
 * jadi render server memakai false dan script Reactions melengkapinya saat halaman dimuat.
 */
export function reactionLabel(stickerId: StickerId, count: number, mine: boolean, withHint = true): string {
  const base = `${reactionName(stickerId)}, ${count} reaksi${mine ? ', kamu ikut bereaksi' : ''}.`;
  if (!withHint) return base;
  const hint = canHover() ? 'Klik untuk bereaksi.' : 'Ketuk untuk bereaksi, tekan lama untuk lihat siapa saja.';
  return `${base} ${hint}`;
}

export function getReactionCount(button: HTMLElement): number {
  return Number(button.querySelector('b')?.textContent ?? 0);
}

/** Ubah angka di tombol reaksi dan perbarui label aksesibelnya. */
export function setReactionCount(button: HTMLElement, count: number): void {
  const label = button.querySelector('b');
  if (label) label.textContent = String(count);
  const mine = button.getAttribute('aria-pressed') === 'true';
  button.setAttribute('aria-label', reactionLabel(button.dataset.stickerId as StickerId, count, mine));
}

/** Jumlah maksimal user yang ditampilkan di popup; sisanya jadi "+N". */
const MAX_LISTED = 10;

/**
 * Pilih user "yang bereaksi" dari reactorPool: acak, tapi selalu sama untuk pesan dan
 * sticker yang sama (supaya isi popup tidak berubah-ubah). Penulis pesan tidak ikut.
 */
export function pickReactors(
  targetId: string,
  stickerId: StickerId,
  count: number,
  authorId?: string,
): { users: User[]; more: number } {
  const pool = reactorPool.filter((id) => id !== authorId);

  // Seed dari string → angka, lalu generator acak sederhana (LCG).
  let seed = [...`${targetId}:${stickerId}`].reduce((hash, char) => (Math.imul(hash, 31) + char.charCodeAt(0)) >>> 0, 17);
  const random = () => {
    seed = (Math.imul(seed, 1103515245) + 12345) >>> 0;
    return (seed >>> 8) / 16777216;
  };
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const users = pool.slice(0, Math.min(count, MAX_LISTED)).map((id: UserId) => getUser(id));
  return { users, more: Math.max(0, count - users.length) };
}

/**
 * Buat tombol reaksi baru dengan meng-clone tombol contoh (dari cetakan Reactions),
 * supaya markup dan style-nya sama persis dengan tombol hasil render server.
 */
export function createReactionButton(sample: HTMLElement, reaction: { stickerId: StickerId; count: number }): HTMLButtonElement {
  const button = sample.cloneNode(true) as HTMLButtonElement;
  const sticker = getSticker(reaction.stickerId);
  button.dataset.stickerId = sticker.id;
  button.setAttribute('aria-pressed', 'false');
  button.setAttribute('aria-expanded', 'false');
  button.classList.remove('is-pop', 'is-new');
  button.querySelector('.react-fx')?.remove();
  const img = button.querySelector('img')!;
  img.src = sticker.url;
  img.alt = stickerAlt(sticker);
  setReactionCount(button, reaction.count);
  return button;
}
