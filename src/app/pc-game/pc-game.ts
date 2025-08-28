import { Component, signal, computed } from '@angular/core';
import { GameService } from '../services/game.service';
import { Game } from '../models/game';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pc-game',
  templateUrl: './pc-game.html',
  styleUrls: ['./pc-game.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PcGameComponent {
  readonly games = signal<Game[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  private readonly playerMap = signal<Record<number, boolean>>({});
  readonly isPlayerVisibleMap = computed(() => this.playerMap());

  constructor(private gamesService: GameService) {
    this.fetchGames();
  }

  fetchGames(): void {
    this.gamesService.getGames().subscribe({
      next: (data) => {
        if (!Array.isArray(data) || data.length === 0) {
          this.error.set('No games found.');
        } else {
          this.games.set(data);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching games:', err);
        this.error.set('Failed to load games.');
        this.loading.set(false);
      }
    });
  }

  togglePlayer(gameId: number): void {
    this.playerMap.update((map) => ({
      ...map,
      [gameId]: !map[gameId]
    }));
  }

  isPlayerVisible(gameId: number): boolean {
    return this.isPlayerVisibleMap()[gameId] ?? false;
  }

  getThumbnail(game: Game): string {
    const id = this.extractYoutubeId(game.url);
    return game.thumbnail || (id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '/logo.png');
  }

  extractYoutubeId(url: string): string | null {
    if (!url) return null;
    const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  }

  getDescriptionLines(description: string): { id: number; text: string }[] {
    return description
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map((text, index) => ({ id: index, text }));
  }

  transformDropboxUrl(url: string): string {
    return url.replace('?dl=0', '?dl=1');
  }

  trackGame(index: number, game: Game): number {
    return game.id;
  }

  trackLine(index: number, line: { id: number; text: string }): number {
    return line.id;
  }
}