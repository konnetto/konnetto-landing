/**
 * Wrapper tipis untuk Umami. Aman dipanggil walau Umami belum termuat
 * atau dimatikan (website ID kosong): panggilannya diabaikan saja.
 *
 * Dua cara tracking:
 *  1. Klik sederhana: pasang atribut di HTML, tanpa JS.
 *       <a data-umami-event="hero-cta-click">
 *  2. Dari script: track(EVENTS.reactionClick, { sticker: 'gas' })
 */

export const EVENTS = {
  heroCtaClick: 'hero-cta-click',
  navCtaClick: 'nav-cta-click',
  formSubmitFans: 'form-submit-fans',
  formSubmitCreator: 'form-submit-creator',
  reactionClick: 'reaction-click',
  /** Halaman karier. Data tambahan: { job: <slug> }. */
  careerJobClick: 'career-job-click',
  careerEmailClick: 'career-email-click',
  careerCopyEmail: 'career-copy-email',
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

export function track(event: EventName, data?: Record<string, string | number | boolean>): void {
  try {
    window.umami?.track(event, data);
  } catch {
    // Analytics tidak boleh bikin halaman error.
  }
}

