export type SourceType = 'youtube' | 'dropbox' | 'magnet' | 'unknown';

export interface Game {
  id: number;
  title: string;
  url: string;
  url1?: string;
  description?: string;
  image?: string;
 
}