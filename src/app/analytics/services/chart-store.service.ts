import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChartApiService, ChartResponse } from './chart-api.service';
import { LinesStore } from './lines-store.service';


export interface ChartState {
  data: any | null;
  loading: boolean;
}


@Injectable({
  providedIn: 'root'
})

export class ChartStore {

  private cache = new Map<string, ChartResponse>();

private subject = new BehaviorSubject<ChartState>({
  data: null,
  loading: false
});

chart$ = this.subject.asObservable();

  period = 'D';
  offset = 0;

  constructor(
  private api: ChartApiService,
  private lines: LinesStore
) {

  this.lines.selectedLine$.subscribe(() => {
    this.load(this.period, this.offset);
  });



}


  
 private key(p: string, o: number) {
  return `${p}_${o}_${this.lines.selectedLine ?? 'ALL'}`;
}



load(period = this.period, offset = this.offset) {

  this.period = period;
  this.offset = offset;

  const key = this.key(period, offset);

  const cached = this.cache.get(key);
  if (cached) {
    this.subject.next({
  data: cached,
  loading: false
});
    return;
  }

  // ✅ ВОТ СЮДА
this.subject.next({
  data: this.subject.value.data,
  loading: true
});

  this.api.load(
      period,
      offset,
      this.lines.selectedLine ?? undefined
    )
    .subscribe(data => {

  this.cache.set(key, data);

  this.subject.next({
    data,
    loading: false
  });

  this.preload(period, offset - 1);
  this.preload(period, offset + 1);
});
}


  private preload(period: string, offset: number) {

    const key = this.key(period, offset);
    if (this.cache.has(key)) return;

    this.api.load(
  period,
  offset,
  this.lines.selectedLine ?? undefined
)
      .subscribe((data: ChartResponse) =>
        this.cache.set(key, data)
      );
  }

  next() {
    this.load(this.period, this.offset + 1);
  }

  prev() {
    this.load(this.period, this.offset - 1);
  }
}
