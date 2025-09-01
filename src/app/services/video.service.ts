import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Video } from '../models/video'; // Adjust path if needed

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private readonly baseUrl = 'https://gamehub-3l8u.onrender.com';
 

  constructor(private http: HttpClient) {}

  getVideos(): Observable<Video[]> {
    const body = {
      dataSource: 'Cluster0',
      database: 'videoplayer',
      collection: 'torrentfiles',
      filter: {}
    };
    return this.http.post<Video[]>(`${this.baseUrl}/videos`, body);
  }

  getVideoById(id: number): Observable<Video> {
    return this.http.get<Video>(`${this.baseUrl}/${id}`);
  }
}