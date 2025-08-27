export type SourceType = 'youtube' | 'dropbox' | 'magnet' | 'unknown';

export interface Video {
  id: string;
  soccermatch: string;
  videourl: string;
  description?: string;
  mediacontent?: string;
  subtitle?: string;
  torrentdownloadlink?: string;
  thumbnail?: string;
  sourceType: SourceType;
}