import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideoService } from '../services/video.service';
import { Video } from '../models/video';
import { YouTubePlayerModule } from '@angular/youtube-player';

@Component({
  selector: 'app-sport-video',
  standalone: true,
  templateUrl: './sport-video.html',
  styleUrls: ['./sport-video.css'],
  imports: [CommonModule,YouTubePlayerModule],
  changeDetection: ChangeDetectionStrategy.Default
})
export class SportVideoComponent {
  readonly videos = signal<Video[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly selectedVideoId = signal<number | null>(null);

  constructor(private videoService: VideoService, private sanitizer: DomSanitizer) {
    this.fetchVideos();
  }

  fetchVideos(): void {
    this.videoService.getVideos().subscribe({
      next: (data) => {
        this.videos.set(data);
        this.loading.set(false);
        console.log('✅ Videos loaded:', data.length);
      },
      error: (err) => {
        console.error('❌ Error fetching videos:', err);
        this.error.set('Failed to load sport videos.');
        this.loading.set(false);
      }
    });
  }

  public get videoList(): Video[] {
    return this.videos();
  }

  public get selectedId(): number | null {
    return this.selectedVideoId();
  }

  public selectVideo(video: Video): void {
    const currentId = this.selectedVideoId();
    const newId = currentId === video.id ? null : video.id;
    this.selectedVideoId.set(newId);
    console.log(`⚽ Video clicked: ${video.id}, Selected ID: ${newId}`);
  }

  public extractYoutubeId(url: string | undefined): string | null {
    if (!url) return null;
    const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^?&]+)/;
    const match = url.match(regExp);
    const id = match?.[1] ?? null;
    console.log('🔍 Extracted YouTube ID:', id);
    return id;
  }

  public getThumbnail(video: Video | undefined): string {
    if (!video || !video.videourl) {
      console.warn('⚠️ getThumbnail called with invalid video:', video);
      return '/logo.png';
    }
    const id = this.extractYoutubeId(video.videourl);
    const thumbnail = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '/logo.png';
    console.log(`🖼️ Thumbnail for ${video.id}:`, thumbnail);
    return thumbnail;
  }

  public transformDropboxUrl(url: string): string {
    return url.replace('?dl=0', '?dl=1');
  }

  public getDescriptionLines(description: string): string[] {
    return description.split('\n').filter(line => line.trim().length > 0);
  }

  public trackByVideoId(index: number, video: Video): number {
    return video.id;
  }
}