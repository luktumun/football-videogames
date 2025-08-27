import { Component, signal } from '@angular/core';
import { GameService } from '../services/game.service';
import { Game } from '../models/game';

@Component({
  selector: 'app-pc-game',
  templateUrl: './pc-game.html',
  styleUrls: ['./pc-game.css'],
  standalone: true
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
      },
      error: (err) => {
        console.error('Error fetching games:', err);
        this.error.set('Failed to load games.');
        this.loading.set(false);
      }
    });
  }

  selectGame(game: Game): void {
    this.selectedGameId.set(game.id);
  }

  getThumbnail(game: Game): string {
    const id = this.extractYoutubeId(game.url);
    return game.thumbnail || (id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '/logo.png');
  }

  extractYoutubeId(url: string): string | null {
    const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : null;
  }

  getDescriptionLines(description: string): string[] {
    return description.split('\n').filter(line => line.trim().length > 0);
  }

  transformDropboxUrl(url: string): string {
    return url.replace('?dl=0', '?dl=1');
  }
}