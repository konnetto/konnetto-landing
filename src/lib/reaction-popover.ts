/**
 * Buka/tutup ReactionPopover ("siapa yang bereaksi"). Markup dan style-nya ada di
 * src/components/hero/ReactionPopover.astro; modul ini dipanggil dari script Reactions.
 *
 * Tiga cara membuka (`mode`):
 *  - 'hover': kursor diam di tombol reaksi (desktop). Tertutup saat kursor pergi.
 *  - 'focus': tombol reaksi difokus dengan keyboard. Tertutup saat fokus pindah.
 *  - 'press': tekan lama di layar sentuh. Tampil sebagai bottom sheet dengan scrim;
 *             tertutup dengan ketuk scrim, tarik sheet ke bawah, atau Escape.
 *
 * Memakai Popover API (popover="manual") supaya tampil di "top layer": selalu di atas
 * elemen lain tanpa urusan z-index dan tidak terpotong overflow: hidden.
 * Selama terbuka, event `overlay` dikirim supaya animasi chat/mading berhenti.
 */
import { getSticker, stickerAlt, type StickerId } from '../data/stickers';
import { splitUsername } from '../data/users';
import { getReactionCount, pickReactors, reactionName } from './reactions';
import { EVENTS_UI, emit } from './events';
import { createAvatar } from './avatar';

export type PopoverMode = 'hover' | 'focus' | 'press';

const POPUP_WIDTH = 290;
const EDGE = 16;
const GAP = 6;
/** Jarak tarik ke bawah (px) yang menutup bottom sheet. */
const SWIPE_CLOSE = 60;

let current: { trigger: HTMLElement; mode: PopoverMode } | null = null;
let closeTimer: ReturnType<typeof setTimeout> | undefined;
let initialized = false;

const getRoot = () => document.querySelector<HTMLElement>('[data-reaction-popover]');

export function currentPopover() {
  return current;
}

export function openReactionPopover(trigger: HTMLElement, mode: PopoverMode): void {
  const root = getRoot();
  if (!root) return;
  setup(root);
  cancelClose();
  if (current?.trigger === trigger && current.mode === mode) return;

  const wasOpen = !!current;
  current?.trigger.setAttribute('aria-expanded', 'false');

  fill(root, trigger);
  root.classList.toggle('is-sheet', mode === 'press');
  root.querySelector<HTMLElement>('[data-rx-panel]')!.style.transform = '';
  if (!root.matches(':popover-open')) root.showPopover();
  if (mode !== 'press') position(root, trigger);

  trigger.setAttribute('aria-expanded', 'true');
  current = { trigger, mode };
  if (!wasOpen) emit(EVENTS_UI.overlay, { open: true });
}

export function closeReactionPopover({ restoreFocus = false } = {}): void {
  cancelClose();
  const root = getRoot();
  if (!root || !current) return;
  const { trigger } = current;
  current = null;
  if (root.matches(':popover-open')) root.hidePopover();
  trigger.setAttribute('aria-expanded', 'false');
  if (restoreFocus) trigger.focus({ preventScroll: true });
  emit(EVENTS_UI.overlay, { open: false });
}

/** Tutup sebentar lagi (mode hover), supaya kursor sempat pindah dari tombol ke popup. */
export function scheduleClose(delayMs = 70): void {
  cancelClose();
  closeTimer = setTimeout(() => {
    if (current?.mode === 'hover') closeReactionPopover();
  }, delayMs);
}

export function cancelClose(): void {
  clearTimeout(closeTimer);
}

// ---------------------------------------------------------------------------

/** Isi popup dari data tombol reaksi. */
function fill(root: HTMLElement, trigger: HTMLElement) {
  const stickerId = trigger.dataset.stickerId as StickerId;
  const container = trigger.closest<HTMLElement>('[data-reactions]');
  const count = getReactionCount(trigger);
  const sticker = getSticker(stickerId);
  const name = reactionName(stickerId);
  const { users, more } = pickReactors(container?.dataset.targetId ?? '', stickerId, count, container?.dataset.authorId);

  root.setAttribute('aria-label', `Yang bereaksi ${name}`);
  const img = root.querySelector<HTMLImageElement>('[data-rx-sticker]')!;
  img.src = sticker.url;
  img.alt = stickerAlt(sticker);
  root.querySelector('[data-rx-name]')!.textContent = name;

  const items = users.map((user) => {
    const li = document.createElement('li');
    li.className = 'rx-user';

    // Avatar 22px: dekorasi otomatis tersembunyi (di bawah 28px), tapi tetap pakai markup yang sama.
    const avatar = createAvatar(user, 'rx-av', 22);

    const username = document.createElement('span');
    username.className = 'rx-un';
    const { pre, sym, post } = splitUsername(user.username);
    username.append(pre);
    if (sym) {
      const symbol = document.createElement('span');
      symbol.className = 'username-sym';
      symbol.textContent = sym;
      username.append(symbol);
    }
    username.append(post);

    li.append(avatar, username);
    if (user.badge) {
      const badge = document.createElement('span');
      badge.className = `rx-badge rx-badge--${user.badge.kind}`;
      badge.textContent = user.badge.label;
      li.append(badge);
    }
    return li;
  });

  if (more > 0) {
    const li = document.createElement('li');
    li.className = 'rx-more';
    li.textContent = `+${more}`;
    items.push(li);
  }
  root.querySelector('[data-rx-list]')!.replaceChildren(...items);
}

/** Desktop: di atas tombol kalau muat, kalau tidak di bawahnya; tidak keluar dari layar. */
function position(root: HTMLElement, trigger: HTMLElement) {
  const rect = trigger.getBoundingClientRect();
  const height = root.offsetHeight;
  const left = Math.max(EDGE, Math.min(rect.left - GAP, window.innerWidth - POPUP_WIDTH - EDGE));
  const top = rect.top - GAP - height >= 8 ? rect.top - GAP - height : rect.bottom + GAP;
  root.style.left = `${Math.round(left)}px`;
  root.style.top = `${Math.round(top)}px`;
}

/** Event listener yang cukup dipasang sekali. */
function setup(root: HTMLElement) {
  if (initialized) return;
  initialized = true;

  // Kursor pindah dari tombol ke popup: jangan tutup.
  root.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') cancelClose();
  });
  root.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse') scheduleClose();
  });

  // Escape menutup; fokus kembali ke tombol kalau popup dibuka lewat keyboard/tekan lama.
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !current) return;
    event.preventDefault();
    closeReactionPopover({ restoreFocus: current.mode !== 'hover' });
  });

  // Ketuk scrim (bottom sheet) menutup.
  root.querySelector('[data-rx-scrim]')?.addEventListener('click', () => closeReactionPopover());

  // Klik/ketuk di luar popup dan di luar tombol pemicunya menutup.
  document.addEventListener('pointerdown', (event) => {
    if (!current || current.mode === 'hover') return;
    const target = event.target as Node;
    if (root.contains(target) || current.trigger.contains(target)) return;
    closeReactionPopover();
  });

  // Popup posisinya fixed: tutup saat halaman di-scroll (kecuali bottom sheet).
  window.addEventListener(
    'scroll',
    () => {
      if (current && current.mode !== 'press') closeReactionPopover();
    },
    { passive: true },
  );

  // Bottom sheet: tarik ke bawah untuk menutup.
  const panel = root.querySelector<HTMLElement>('[data-rx-panel]')!;
  let dragStart: number | null = null;
  panel.addEventListener('pointerdown', (event) => {
    if (current?.mode !== 'press') return;
    dragStart = event.clientY;
    panel.setPointerCapture(event.pointerId);
    panel.classList.add('is-drag');
  });
  panel.addEventListener('pointermove', (event) => {
    if (dragStart === null) return;
    panel.style.transform = `translateY(${Math.max(0, event.clientY - dragStart)}px)`;
  });
  const endDrag = (event: PointerEvent) => {
    if (dragStart === null) return;
    const distance = event.clientY - dragStart;
    dragStart = null;
    panel.classList.remove('is-drag');
    if (distance > SWIPE_CLOSE) closeReactionPopover();
    else panel.style.transform = '';
  };
  panel.addEventListener('pointerup', endDrag);
  panel.addEventListener('pointercancel', endDrag);
}
