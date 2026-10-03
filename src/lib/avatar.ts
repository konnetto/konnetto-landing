/**
 * Helper avatar untuk elemen yang diisi lewat JavaScript (cetakan <template> dan popup reaksi).
 * Markup harus sama dengan src/components/Avatar.astro.
 */
import { DECORATION_FILE_SIZE, getDecoration } from '../data/decorations';
import type { User } from '../data/users';

/** Pasang (atau sembunyikan) dekorasi user di dalam `scope` (wrapper .av atau induknya). */
export function setAvatarDecoration(scope: ParentNode, user: User): void {
  const deco = scope.querySelector<HTMLImageElement>('[data-slot="decoration"]');
  if (!deco) return;
  if (user.decoration) {
    deco.src = getDecoration(user.decoration).url;
    deco.hidden = false;
  } else {
    deco.hidden = true;
    deco.removeAttribute('src');
  }
}

/** Buat avatar lengkap (wrapper .av + gambar + dekorasi) seperti Avatar.astro. */
export function createAvatar(user: User, className: string, size: number): HTMLSpanElement {
  const wrapper = document.createElement('span');
  wrapper.className = `av ${className}`;

  const img = document.createElement('img');
  img.className = 'av-img';
  img.dataset.slot = 'avatar';
  img.src = user.avatarUrl;
  img.alt = '';
  img.width = size;
  img.height = size;
  img.decoding = 'async';

  const deco = document.createElement('img');
  deco.className = 'av-deco';
  deco.dataset.slot = 'decoration';
  deco.alt = '';
  deco.width = DECORATION_FILE_SIZE;
  deco.height = DECORATION_FILE_SIZE;
  deco.decoding = 'async';
  deco.loading = 'lazy';

  wrapper.append(img, deco);
  setAvatarDecoration(wrapper, user);
  return wrapper;
}
