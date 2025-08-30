export type SourceType = 'youtube' | 'dropbox' | 'magnet' | 'unknown';

export interface Video {
  id: number;
  soccermatch: string;
  videourl: string;
  description?: string;
  mediacontent?: string;
  subtitle?: string;
  torrentdownloadlink?: string;
 
}