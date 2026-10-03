/**
 * Satu-satunya tempat yang membaca environment variable.
 * Komponen lain import dari sini, bukan langsung dari import.meta.env,
 * supaya default dan validasinya terkumpul di satu file.
 */

/**
 * - formspree: form HTML dikirim ke PUBLIC_FORMSPREE_ENDPOINT.
 * - tally:     embed form Tally (PUBLIC_TALLY_*_FORM_ID).
 * - demo:      belum ada backend. Form bisa dicoba (pesan sukses muncul), tapi data TIDAK
 *              dikirim ke mana pun. Aktif otomatis selama endpoint/ID form belum diisi.
 */
export type FormProvider = 'formspree' | 'tally' | 'demo';

const requested = import.meta.env.PUBLIC_FORM_PROVIDER;
const formspreeEndpoint = import.meta.env.PUBLIC_FORMSPREE_ENDPOINT ?? '';
const tallyFormIds = {
  fans: import.meta.env.PUBLIC_TALLY_FANS_FORM_ID ?? '',
  creator: import.meta.env.PUBLIC_TALLY_CREATOR_FORM_ID ?? '',
};

function resolveProvider(): FormProvider {
  if (requested === 'demo') return 'demo';
  if (requested === 'tally') return tallyFormIds.fans && tallyFormIds.creator ? 'tally' : 'demo';
  return formspreeEndpoint ? 'formspree' : 'demo';
}

export const formConfig = {
  provider: resolveProvider(),
  formspreeEndpoint,
  tallyFormIds,
  /** Ditampilkan setelah form berhasil dikirim. */
  successMessage: 'makasih udah daftar! kami kabari lewat email atau WhatsApp waktu beta dibuka.',
} as const;

/**
 * Base URL gambar (avatar, sticker, ilustrasi Tsuba). Default '/img' = folder public/img
 * (salinan dari canvas desain). Setelah gambar dipindah ke cloud storage, cukup isi
 * PUBLIC_ASSET_BASE_URL, misalnya https://assets.konnetto.id, tanpa mengubah kode.
 */
export const assetBaseUrl = (import.meta.env.PUBLIC_ASSET_BASE_URL || '/img').replace(/\/$/, '');

export const analyticsConfig = {
  umamiWebsiteId: import.meta.env.PUBLIC_UMAMI_WEBSITE_ID ?? '',
  umamiScriptUrl: import.meta.env.PUBLIC_UMAMI_SCRIPT_URL || 'https://cloud.umami.is/script.js',
} as const;
