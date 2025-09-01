export type SourceType = 'youtube' | 'dropbox' | 'magnet' | 'unknown';

export interface Video {
  _id: string;
  soccermatch: string;
  videourl: string;
  description?: string;
  mediacontent?: string;
  subtitle?: string;
  torrentdownloadlink?: string;
 
}