export type SourceType = 'youtube' | 'dropbox' | 'magnet' | 'unknown';

export interface Game {
  id: string;
  title: string;
  url: string;
  url1?: string;
  description?: string;
  image?: string;
  thumbnail?: string;
  sourceType: SourceType; // ✅ now accepts all valid types
}