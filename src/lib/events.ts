/**
 * Event antar komponen di halaman (CustomEvent di `document`).
 * Komponen tidak saling import; mereka cukup mengirim dan mendengarkan event ini.
 *
 *   // kirim
 *   emit(EVENTS_UI.overlay, { open: true });
 *   // dengar
 *   on(EVENTS_UI.overlay, (detail) => console.log(detail.open));
 */

export const EVENTS_UI = {
  /** Popover reaksi atau lightbox dibuka/ditutup. Loop animasi pause selama terbuka. */
  overlay: 'konnetto:overlay',
  /** ChatFeed: post fanart siap "masuk mading". MadingPanel yang menganimasikan. */
  fanartToMading: 'konnetto:fanart-to-mading',
} as const;

export interface UiEventDetail {
  [EVENTS_UI.overlay]: { open: boolean };
  [EVENTS_UI.fanartToMading]: {
    /** id pesan di chat-script.ts */
    messageId: string;
    /** gambar fanart di chat, titik awal animasi terbang */
    image: HTMLImageElement | null;
  };
}

type UiEventName = keyof UiEventDetail;

export function emit<N extends UiEventName>(name: N, detail: UiEventDetail[N]): void {
  document.dispatchEvent(new CustomEvent(name, { detail }));
}

export function on<N extends UiEventName>(name: N, listener: (detail: UiEventDetail[N]) => void): () => void {
  const handler = (event: Event) => listener((event as CustomEvent<UiEventDetail[N]>).detail);
  document.addEventListener(name, handler);
  return () => document.removeEventListener(name, handler);
}
