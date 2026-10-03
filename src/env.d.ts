// Tipe untuk environment variable, supaya import.meta.env.* punya autocomplete.
// Daftar lengkap dan penjelasannya ada di .env.example.
interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_ASSET_BASE_URL?: string;
  readonly PUBLIC_FORM_PROVIDER?: 'formspree' | 'tally' | 'demo';
  readonly PUBLIC_FORMSPREE_ENDPOINT?: string;
  readonly PUBLIC_TALLY_FANS_FORM_ID?: string;
  readonly PUBLIC_TALLY_CREATOR_FORM_ID?: string;
  readonly PUBLIC_UMAMI_WEBSITE_ID?: string;
  readonly PUBLIC_UMAMI_SCRIPT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Umami menaruh objek ini di window setelah script-nya termuat.
interface Window {
  umami?: {
    track: (event: string, data?: Record<string, string | number | boolean>) => void;
  };
}
