import { Component, OnInit } from '@angular/core';
import { GameService } from '../services/game.service';
import { Game } from '../models/game';
import { CommonModule } from '@angular/common';
import { YouTubePlayerModule } from '@angular/youtube-player';

@Component({
  selector: 'app-pc-game',
  templateUrl: './pc-game.html',
  styleUrls: ['./pc-game.css'],
  standalone: true,
  imports: [CommonModule, YouTubePlayerModule],
})
export class PcGameComponent implements OnInit {
  games: Game[] = [];
  activeGameId: string | null = null;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.getGames().subscribe((data: Game[]) => {
      this.games = data;
    });
  }

  playGameHandler(game: Game): void {
    this.activeGameId = game._id;
  }

  isGamePlaying(game: Game): boolean {
    return this.activeGameId === game._id;
  }

  onPlayerStateChange(event: YT.OnStateChangeEvent, game: Game): void {
    // YT.PlayerState.PAUSED === 2
    if (event.data === 2 && this.activeGameId === game._id) {
      this.activeGameId = null;
    }
  }

  extractYoutubeId(url: string): string | null {
    const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? match[1] : null;
  }

  getThumbnail(game: Game): string {
    const videoId = this.extractYoutubeId(game.url);
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : 'assets/default-thumbnail.jpg';
  }

  getDescriptionLines(description: string): string[] {
    return description?.split('\n').filter(line => line.trim()) ?? [];
  }

  transformDropboxUrl(url: string): string {
    return url?.includes('dropbox.com') ? url.replace('?dl=0', '?dl=1') : url;
  }

  trackByGameId(index: number, game: Game): string {
    return game._id;
  }
}