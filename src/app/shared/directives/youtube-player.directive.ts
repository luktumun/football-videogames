import {
  Directive,
  Input,
  ElementRef,
  OnChanges,
  SimpleChanges,
  inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[youtubePlayer]',
  standalone: true
})
export class YoutubePlayerDirective implements OnChanges {
  @Input('youtubePlayer') videoUrl: string = '';

  private static apiLoaded = false;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isBrowser) return;

    if (changes['videoUrl'] && this.videoUrl) {
      const id = this.extractYoutubeId(this.videoUrl);
      if (!id) {
        console.warn('Invalid YouTube URL:', this.videoUrl);
        return;
      }

      this.loadYoutubeIframeAPI(() => {
        // Defer rendering to next microtask for Cypress stability
        queueMicrotask(() => this.renderIframe(id));
      });
    }
  }

  private renderIframe(videoId: string): void {
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;

    const iframe = document.createElement('iframe');
    iframe.width = '500';
    iframe.height = '220';
    iframe.frameBorder = '0';
    iframe.allow = 'autoplay; encrypted-media';
    iframe.allowFullscreen = true;
    iframe.setAttribute('data-testid', `youtube-player-${videoId}`);
    iframe.src = embedUrl;
    iframe.loading = 'lazy';

    const native = this.el.nativeElement;
    native.innerHTML = '';
    native.appendChild(iframe);

    // Mutation observer for Cypress visibility assertion
    const observer = new MutationObserver(() => {
      console.log(`YouTube iframe rendered for videoId: ${videoId}`);
      observer.disconnect();
    });
    observer.observe(native, { childList: true });
  }

  private loadYoutubeIframeAPI(callback: () => void): void {
    if (YoutubePlayerDirective.apiLoaded) {
      callback();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.onload = () => {
      YoutubePlayerDirective.apiLoaded = true;
      callback();
    };
    script.onerror = () => {
      console.error('Failed to load YouTube iframe API');
    };

    document.body.appendChild(script);
  }

  private extractYoutubeId(url: string): string | null {
    const match = url?.match(/(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  }
}