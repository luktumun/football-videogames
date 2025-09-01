import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../models/game'; // Adjust path if needed

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly baseUrl = 'https://gamehub-3l8u.onrender.com';

  constructor(private http: HttpClient) {}

  getGames(): Observable<Game[]> {
    const body = {
      dataSource: 'Cluster0',
      database: 'videoplayer',
      collection: 'videos',
      filter: {}
    };
    return this.http.post<Game[]>(`${this.baseUrl}/api/videos`, body);
  }
  
  getGameById(id: number): Observable<Game> {
    return this.http.get<Game>(`${this.baseUrl}/api/videos/${id}`);
  }
}