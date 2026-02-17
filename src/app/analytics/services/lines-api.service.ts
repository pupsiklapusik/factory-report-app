import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LineStatus {
  line: string;
  description: string;
  minutesAgo: number;
  state: 'ONLINE' | 'OFFLINE' | 'GREY';
}

@Injectable({ providedIn: 'root' })
export class LinesApiService {

  constructor(private http: HttpClient) {}

  load(): Observable<LineStatus[]> {
    return this.http.get<LineStatus[]>('/api/lines/status');
  }
}
