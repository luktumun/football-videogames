import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Video } from '../models/video';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private apiUrl = 'https://ap-south-1.aws.data.mongodb-api.com/app/data-koewh/endpoint/data/v1/action/find';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Request-Headers': '*',
    'api-key': 'CQk2k1fBnHLvnoZFqALRZPTHzMgUUa9cYivK9VPOdo3tpNlyBKNjSNr6w14UoC7S' // ⚠️ Replace securely
  });

  constructor(private http: HttpClient) {}

  getVideos(): Observable<Video[]> {
    const body = {
      dataSource: 'Cluster0',
      database: 'videoplayer',
      collection: 'torrentfiles',
      filter: {}
    };

    return this.http.post<any>(this.apiUrl, body, { headers: this.headers }).pipe(
      map(res => res.documents as Video[]),
      catchError(err => {
        console.error('Video fetch error:', err);
        return throwError(() => new Error('Failed to load videos'));
      })
    );
  }
}