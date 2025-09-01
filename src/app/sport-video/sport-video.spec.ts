import { Component, signal } from '@angular/core';
import { VideoService } from '../services/video.service';
import { Video } from '../models/video';

@Component({
  selector: 'app-sport-video',
  templateUrl: './sport-video.html',
  styleUrls: ['./sport-video.css'],
  standalone: true
})
export class SportVideoComponent {
  readonly videos = signal<Video[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly selectedVideoId = signal<string | null>(null);

  constructor(private videoService: VideoService) {
    this.fetchVideos();
  }

  fetchVideos(): void {
    this.videoService.getVideos().subscribe({
      next: (data) => {
        this.videos.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching sport videos:', err);
        this.error.set('Failed to load sport videos.');
        this.loading.set(false);
      }
    });
  }

  selectVideo(video: Video): void {
    this.selectedVideoId.set(video.id);
  }

  getThumbnail(video: Video): string {
    const id = this.extractYoutubeId(video.videourl);
    return video.thumbnail || (id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '/logo.png');
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