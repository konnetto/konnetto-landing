/**
 * Jam induk untuk animasi di hero (ChatFeed + MadingPanel), sesuai artboard:
 * berinteraksi dengan salah satu (hover, tap, fokus) menghentikan keduanya.
 *
 * Alasan pause yang berlaku untuk keduanya dipasang di sini atau oleh komponen:
 *  - 'hidden'   : tab tidak aktif (dipasang di sini)
 *  - 'overlay'  : popover reaksi / lightbox terbuka (dipasang di sini)
 *  - 'chat-hover', 'chat-tap', 'chat-focus'   : dari ChatFeed
 *  - 'mading-hover', 'mading-focus'           : dari MadingPanel
 * Pause karena keluar layar TIDAK di sini, tapi di jam anak masing-masing komponen,
 * karena di mobile chat dan mading bisa terlihat bergantian.
 */
import { PauseController, onVisibilityChange } from './motion';
import { EVENTS_UI, on } from './events';

export const heroClock = new PauseController();

heroClock.set('hidden', document.hidden);
onVisibilityChange(
  () => heroClock.pause('hidden'),
  () => heroClock.resume('hidden'),
);
on(EVENTS_UI.overlay, ({ open }) => heroClock.set('overlay', open));
