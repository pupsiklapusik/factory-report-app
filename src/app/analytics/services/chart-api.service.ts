import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChartResponse {
  window: any;
  series: Record<string, { meter: number; faults: number }[]>;
}

@Injectable({
  providedIn: 'root'
})
export class ChartApiService {

  constructor(private http: HttpClient) {}

    load(period: string, offset: number, line?: string) {

    let url = `/api/chart?period=${period}&offset=${offset}`;

    if (line) {
        url += `&line=${line}`;
    }

    return this.http.get<ChartResponse>(url);
    }


}
