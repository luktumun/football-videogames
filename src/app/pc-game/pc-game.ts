import {
  Component,
  OnInit,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game, SourceType } from '../models/game';
import { GameService } from '../services/game.service';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-pc-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pc-game.html',
  styleUrls: ['./pc-game.css']
})
export class PcGameComponent implements OnInit {
  games = signal<Game[]>([]);
  loading = signal(true);
  error = signal('');
  selectedGameId = signal<string | null>(null);

  constructor(
    private gameService: GameService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadYouTubeApi();
    }

    this.gameService.getGames().subscribe({
      next: (res: any[]) => {
        const mapped: Game[] = res.map(game => ({
          id: game._id,
          title: game.title,
          url: game.url,
          url1: game.url1,
          description: game.description,
          image: game.image,
          thumbnail: game.thumbnail,
          sourceType: this.detectSourceType(game.url)
        }));
        this.games.set(mapped);
      
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load PC games');
        this.loading.set(false);
      }
    });
  }

  selectGame(game: Game): void {
    const youtubeId = this.extractYoutubeId(game.url);
    this.selectedGameId.set(game.id);

    if (game.sourceType === 'youtube' && youtubeId) {
      // Delay to ensure DOM renders the container
      setTimeout(() => {
        this.loadYouTubePlayer(youtubeId);
      }, 100);
    }
  }

  loadYouTubeApi(): void {
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }
  }

  loadYouTubePlayer(videoId: string): void {
    const createPlayer = () => {
      const container = document.getElementById('yt-player-container');
      if (!container) {
        console.warn('Player container not found');
        return;
      }
  
      // Clear previous content
      container.innerHTML = '';
  
      // Create a new div inside the container for the player
      const playerDiv = document.createElement('div');
      playerDiv.id = 'yt-player';
      container.appendChild(playerDiv);
  
      new (window as any).YT.Player('yt-player', {
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0
        },
        events: {
          onReady: (event: any) => {
            event.target.mute();
            event.target.playVideo();
          }
        }
      });
    };
  
    if ((window as any).YT && (window as any).YT.Player) {
      createPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = createPlayer;
    }
  }

  extractYoutubeId(url: string): string | null {
    const match = url?.match(/(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  }

  detectSourceType(url: string): SourceType {
    if (!url) return 'unknown';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('dropbox.com')) return 'dropbox';
    if (url.startsWith('magnet:')) return 'magnet';
    return 'unknown';
  }

  getThumbnail(game: Game): string {
    const id = this.extractYoutubeId(game.url);
    return game.thumbnail || (id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : 'assets/placeholder.jpg');
  }

  transformDropboxUrl(url: string): string {
    return url.includes('dropbox.com') ? url.replace(/(\?dl=0|\?raw=0)?$/, '?raw=1') : url;
  }

  getDescriptionLines(desc?: string): string[] {
    return desc?.split('\n').map(line => line.trim()).filter(Boolean) || [];
  }

  isMagnetLink(url: string): boolean {
    return url?.startsWith('magnet:');
  }
}