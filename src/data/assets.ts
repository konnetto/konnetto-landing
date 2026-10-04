/**
 * Aset gambar brand dan helper URL.
 *
 * Semua gambar diambil dari canvas desain Versi B dan sementara disimpan di
 * public/img. Base URL-nya diatur lewat PUBLIC_ASSET_BASE_URL (lihat src/lib/config.ts),
 * jadi memindahkan gambar ke cloud storage tidak perlu mengubah kode.
 * TODO: upload isi public/img ke cloud storage, lalu isi PUBLIC_ASSET_BASE_URL.
 */
import { assetBaseUrl } from '../lib/config';

/** Bangun URL lengkap dari path relatif, contoh: asset('avatars/aoi.webp'). */
export const asset = (path: string) => `${assetBaseUrl}/${path}`;

export interface ImageAsset {
  url: string;
  width: number;
  height: number;
  alt: string;
  /** Opsional: versi kecil 480px (dibuat scripts/optimize-images.mjs untuk gambar di posts/). */
  smallUrl?: string;
}

/** srcset untuk gambar yang punya versi kecil; string kosong kalau tidak ada. */
export const imageSrcset = (image: ImageAsset) => (image.smallUrl ? `${image.smallUrl} 480w, ${image.url} ${image.width}w` : '');

/** Ilustrasi Tsuba, maskot Konnetto (masih konsep sementara, lihat catatan di footer). */
export const tsuba = {
  /** Avatar bulat akun "konnetto.official". */
  avatar: {
    url: asset('tsuba/tsuba-avatar.webp'),
    width: 192,
    height: 192,
    alt: 'maskot Konnetto',
  },
  /**
   * Tsuba mengintip dari balik kolom mading di hero (desktop). Tepi kanan gambar = garis potongan
   * badannya. Dibuat dari brand/tsuba-peek-side.png dengan scripts/prepare-tsuba.mjs.
   */
  peekSide: {
    url: asset('tsuba/tsuba-peek-side.webp'),
    width: 435,
    height: 880,
    alt: 'maskot Konnetto mengintip dari balik mading',
  },
  /** Tsuba mengintip di balik wordmark footer. */
  peek: {
    url: asset('tsuba/tsuba-peek.webp'),
    width: 720,
    height: 321,
    alt: 'maskot Konnetto',
  },
} satisfies Record<string, ImageAsset>;

/** Ilustrasi halaman. Sumber di brand/illustrations/ (dipotong, lebar 2x ukuran tampil). */
export const illustrations = {
  /** Halaman 404: maskot kebingungan memegang peta terbalik. Tampil 300px (mobile 200px tinggi). */
  lost404: {
    url: asset('illustrations/404-lost.webp'),
    width: 600,
    height: 745,
    alt: 'Maskot Konnetto kebingungan memegang peta terbalik',
  },
} satisfies Record<string, ImageAsset>;

/** Ikon kecil. Sumber di brand/icons/ (dipotong, dijadikan persegi, 3x ukuran tampil). */
export const icons = {
  /** Pin di label "masuk mading" (chat hero). Dekoratif: alt kosong saat dipakai. */
  pin: { url: asset('icons/pin.webp'), width: 54, height: 54, alt: '' },
} satisfies Record<string, ImageAsset>;
