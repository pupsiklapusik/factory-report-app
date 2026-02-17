import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LinesApiService, LineStatus } from './lines-api.service';
import { timer, switchMap } from 'rxjs';


export interface ChartState {
  data: any | null;
  loading: boolean;
}

@Injectable({ providedIn: 'root' })
export class LinesStore {

  private linesSubject = new BehaviorSubject<LineStatus[]>([]);
  lines$ = this.linesSubject.asObservable();

  private selectedSubject = new BehaviorSubject<string | null>(null);
  selectedLine$ = this.selectedSubject.asObservable();

  get selectedLine() {
    return this.selectedSubject.value;
  }


private started = false;

  constructor(private api: LinesApiService) {}

load() {

  if (this.started) return;
  this.started = true;    

  // первый запрос сразу
  this.fetchOnce();

  // автообновление каждые 10 секунд
  timer(10000, 10000)
    .pipe(
      switchMap(() => this.api.load())
    )
    .subscribe(lines => {

      this.linesSubject.next(lines);

      // если выбранная линия исчезла — выбрать новую
      if (
        this.selectedLine &&
        !lines.find(l => l.line === this.selectedLine)
      ) {
        this.selectedSubject.next(lines[0]?.line ?? null);
      }
    });
}

private fetchOnce() {

  this.api.load().subscribe(lines => {

    this.linesSubject.next(lines);

    if (!this.selectedLine && lines.length) {
      this.selectedSubject.next(lines[0].line);
    }
  });
}


  select(line: string) {
    this.selectedSubject.next(line);
  }
}
