import {
    Directive,
    Input,
    ElementRef,
    OnChanges,
    SimpleChanges
  } from '@angular/core';
  
  @Directive({
    selector: '[youtubePlayer]',
    standalone: true
  })
  export class YoutubePlayerDirective implements OnChanges {
    @Input('youtubePlayer') videoUrl: string = '';
  
    constructor(private el: ElementRef) {}
  
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['videoUrl'] && this.videoUrl) {
        const id = this.extractYoutubeId(this.videoUrl);
        if (!id) return;
  
        const embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;
  
        const iframe = document.createElement('iframe');
        iframe.width = '500';
        iframe.height = '220';
        iframe.frameBorder = '0';
        iframe.allow = 'autoplay; encrypted-media';
        iframe.allowFullscreen = true;
        iframe.setAttribute('data-testid', `yt-iframe-${id}`);
        iframe.src = embedUrl;
        iframe.loading = 'lazy';
  
        const native = this.el.nativeElement;
        native.innerHTML = '';
        native.appendChild(iframe);
      }
    }
  
    private extractYoutubeId(url: string): string | null {
      const match = url?.match(/(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      return match ? match[1] : null;
    }
  }