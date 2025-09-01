export type SourceType = 'youtube' | 'dropbox' | 'magnet' | 'unknown';

export interface Game {
  _id: string;
  title: string;
  url: string;
  url1?: string;
  description?: string;
  image?: string;
 
}