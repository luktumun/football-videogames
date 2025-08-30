import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { GameService } from '../services/game.service';
import { Game } from '../models/game';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pc-game',
  templateUrl: './pc-game.html',
  styleUrls: ['./pc-game.css'],
  standalone: true,
  imports: [CommonModule,YouTubePlayerModule],
  changeDetection: ChangeDetectionStrategy.Default
})
export class PcGameComponent {
  readonly games = signal<Game[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly selectedGameId = signal<number | null>(null);

  constructor(private gamesService: GameService) {
    this.fetchGames();
  }

  fetchGames(): void {
    this.gamesService.getGames().subscribe({
      next: (data) => {
        this.games.set(data);
        this.loading.set(false);
        console.log('✅ Games loaded:', data.length);
      },
      error: (err) => {
        console.error('❌ Error fetching games:', err);
        this.error.set('Failed to load games.');
        this.loading.set(false);
      }
    });
  }
  public get selectedId(): number | null {
    return this.selectedGameId();
  }
  public get gameList(): Game[] {
    return this.games();
  }

  public selectGame(game: Game): void {
    const currentId = this.selectedGameId();
    const newId = currentId === game.id ? null : game.id;
    this.selectedGameId.set(newId);
    console.log(`🎮 Game clicked: ${game.id}, Selected ID: ${newId}`);
  }

  public extractYoutubeId(url: string | undefined): string | null {
    if (!url) return null;
    const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^?&]+)/;
    const match = url.match(regExp);
    const id = match?.[1] ?? null;
    console.log('🔍 Extracted YouTube ID:', id);
    return id;
  }

  public getThumbnail(game: Game | undefined): string {
    if (!game || !game.url) {
      console.warn('⚠️ getThumbnail called with invalid game:', game);
      return '/logo.png';
    }
    const id = this.extractYoutubeId(game.url);
    const thumbnail = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '/logo.png';
    console.log(`🖼️ Thumbnail for ${game.id}:`, thumbnail);
    return thumbnail;
  }

  public transformDropboxUrl(url: string): string {
    return url.replace('?dl=0', '?dl=1');
  }

  public getDescriptionLines(description: string): string[] {
    return description.split('\n').filter(line => line.trim().length > 0);
  }
  public trackByGameId(index: number, game: Game): number {
    return game.id;
  }
}