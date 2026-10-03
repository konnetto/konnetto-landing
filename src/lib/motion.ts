/**
 * Helper untuk animasi, dipakai ChatFeed, MadingPanel, dan Reactions.
 *
 * Aturan main animasi di project ini:
 *  - Kalau user memilih "reduce motion", tampilkan keadaan akhir tanpa animasi.
 *  - Kalau tab tidak aktif (document.hidden), loop animasi berhenti.
 */

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** true di perangkat dengan mouse/trackpad (bisa hover), false di layar sentuh. */
export function canHover(): boolean {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

/**
 * Panggil `onHide` saat tab disembunyikan dan `onShow` saat tab aktif lagi.
 * Mengembalikan fungsi untuk berhenti mendengarkan.
 */
export function onVisibilityChange(onHide: () => void, onShow: () => void): () => void {
  const handler = () => (document.hidden ? onHide() : onShow());
  document.addEventListener('visibilitychange', handler);
  return () => document.removeEventListener('visibilitychange', handler);
}

/** setTimeout versi Promise (tidak bisa di-pause). Untuk loop animasi pakai PauseController.wait. */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Jam yang bisa di-pause, untuk loop animasi.
 *
 * Pause bisa punya beberapa alasan sekaligus ('hidden', 'offscreen', 'hover', ...).
 * Jam baru jalan lagi setelah SEMUA alasan dicabut. Contoh:
 *
 *   const clock = new PauseController();
 *   clock.pause('hover');      // kursor masuk
 *   clock.pause('hidden');     // tab disembunyikan
 *   clock.resume('hover');     // masih pause karena 'hidden'
 *   clock.resume('hidden');    // jalan lagi
 *
 *   await clock.wait(1200);    // seperti setTimeout, tapi berhenti selama pause
 *
 * Bisa punya induk: jam anak ikut pause selama induknya pause.
 *   const chatClock = new PauseController(heroClock);
 */
export class PauseController {
  private reasons = new Set<string>();
  private listeners = new Set<(paused: boolean) => void>();
  private lastPaused = false;

  constructor(private parent?: PauseController) {
    this.lastPaused = this.paused;
    parent?.onChange(() => this.update());
  }

  get paused(): boolean {
    return this.reasons.size > 0 || !!this.parent?.paused;
  }

  /** Apakah pause karena alasan ini (di jam ini sendiri, bukan induknya). */
  isPausedBy(reason: string): boolean {
    return this.reasons.has(reason);
  }

  /** Daftarkan callback saat status pause berubah. Mengembalikan fungsi untuk berhenti. */
  onChange(listener: (paused: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  pause(reason: string): void {
    this.reasons.add(reason);
    this.update();
  }

  resume(reason: string): void {
    if (this.reasons.delete(reason)) this.update();
  }

  /** Atur satu alasan pause sesuai boolean (praktis untuk observer). */
  set(reason: string, paused: boolean): void {
    if (paused) this.pause(reason);
    else this.resume(reason);
  }

  /** Tunggu `ms` milidetik waktu "berjalan"; waktu selama pause tidak dihitung. */
  async wait(ms: number): Promise<void> {
    let remaining = ms;
    while (remaining > 0) {
      if (this.paused) {
        await this.untilResumed();
        continue;
      }
      const start = performance.now();
      const finished = await new Promise<boolean>((resolve) => {
        const timer = setTimeout(() => {
          stop();
          resolve(true);
        }, remaining);
        const stop = this.onChange((paused) => {
          if (!paused) return;
          clearTimeout(timer);
          stop();
          resolve(false);
        });
      });
      if (finished) return;
      remaining -= performance.now() - start;
    }
  }

  private untilResumed(): Promise<void> {
    return new Promise((resolve) => {
      const stop = this.onChange((paused) => {
        if (paused) return;
        stop();
        resolve();
      });
    });
  }

  /** Kirim onChange hanya kalau status pause benar-benar berubah. */
  private update(): void {
    const paused = this.paused;
    if (paused === this.lastPaused) return;
    this.lastPaused = paused;
    this.emit(paused);
  }

  private emit(paused: boolean): void {
    // Salin dulu: listener boleh berhenti mendengarkan di tengah loop.
    [...this.listeners].forEach((listener) => listener(paused));
  }
}

/**
 * Pause `clock` (alasan `reason`) hanya selama kursor mouse berada di atas elemen konten
 * di dalam `root` (yang cocok dengan `contentSelector`), bukan di area kosong di sekitarnya.
 * Contoh: chat berhenti saat kursor di atas bubble, jalan lagi saat kursor di sela-sela bubble.
 */
export function pauseWhileHoveringContent(root: HTMLElement, contentSelector: string, clock: PauseController, reason: string): void {
  root.addEventListener('pointerover', (event) => {
    if (event.pointerType !== 'mouse') return;
    const overContent = !!(event.target as Element | null)?.closest?.(contentSelector);
    clock.set(reason, overContent);
  });
  root.addEventListener('pointerleave', () => clock.resume(reason));
}
