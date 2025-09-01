import { Component, OnInit } from '@angular/core';
import { VideoService } from '../services/video.service';
import { Video } from '../models/video';
import { CommonModule } from '@angular/common';
import { YouTubePlayerModule } from '@angular/youtube-player';

@Component({
  selector: 'app-sport-video',
  templateUrl: './sport-video.html',
  styleUrls: ['./sport-video.css'],
  standalone: true,
  imports: [CommonModule, YouTubePlayerModule],
})
export class SportVideoComponent implements OnInit {
  videos: Video[] = [];
  activeVideoId: string | null = null;

  constructor(private videoService: VideoService) {}

  ngOnInit(): void {
    this.videoService.getVideos().subscribe((data: Video[]) => {
      this.videos = data;
    });
  }

  playVideoHandler(video: Video): void {
    this.activeVideoId = video._id;
  }

  isVideoPlaying(video: Video): boolean {
    return this.activeVideoId === video._id;
  }
  onPlayerStateChange(event: YT.OnStateChangeEvent, video: Video): void {
    // YT.PlayerState.PAUSED === 2
    if (event.data === 2 && this.activeVideoId === video._id) {
      this.activeVideoId = null;
    }
  }

  extractYoutubeId(url: string): string | null {
    const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? match[1] : null;
  }

  getThumbnail(video: Video): string {
    const videoId = this.extractYoutubeId(video.videourl);
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

  trackByVideoId(index: number, video: Video): string {
    return video._id;
  }
}