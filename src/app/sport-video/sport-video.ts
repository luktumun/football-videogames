import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Video, SourceType } from '../models/video';
import { VideoService } from '../services/video.service';

@Component({
  selector: 'app-sport-video',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sport-video.html',
  styleUrls: ['./sport-video.css']
})
export class SportVideoComponent implements OnInit {
  readonly videos = signal<Video[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly selectedVideoId = signal<number | null>(null);
  readonly selectedSafeUrl = signal<SafeResourceUrl | null>(null);

  constructor(
    private readonly videoService: VideoService,
    private readonly sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.videoService.getVideos().subscribe({
      next: (res: any[]) => {
        const mapped: Video[] = res.map(video => ({
          id: video._id,
          soccermatch: video.soccermatch,
          videourl: video.videourl,
          description: video.description,
          mediacontent: video.mediacontent,
          subtitle: video.subtitle,
          torrentdownloadlink: video.torrentdownloadlink,
          thumbnail: video.thumbnail,
          sourceType: this.detectSourceType(video.videourl)
        }));
        this.videos.set(mapped);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load sport videos');
        this.loading.set(false);
      }
    });
  }

  loadVideo(video: Video): void {
    console.log('Clicked video:', video.id); // ✅ Debug trace
    const youtubeId = this.extractYoutubeId(video.videourl);
    this.selectedVideoId.set(video.id);

    if (video.sourceType === 'youtube' && youtubeId) {
      const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=1`;
      this.selectedSafeUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl));
    } else {
      this.selectedSafeUrl.set(null);
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

  getThumbnail(video: Video): string {
    const id = this.extractYoutubeId(video.videourl);
    return video.thumbnail || (id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : 'assets/placeholder.jpg');
  }

  transformDropboxUrl(url: string): string {
    return url.includes('dropbox.com') ? url.replace(/(\?dl=0|\?raw=0)?$/, '?raw=1') : url;
  }

  getDescriptionLines(desc?: string): string[] {
    return desc?.split('\n').map(line => line.trim()).filter(Boolean) || [];
  }
}