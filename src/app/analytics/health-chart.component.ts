import {
  Component,
  OnInit,
  HostListener,
  DestroyRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { NgxEchartsDirective } from 'ngx-echarts';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ChartStore } from './services/chart-store.service';

@Component({
  selector: 'app-health-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective],
  templateUrl: './health-chart.component.html',
  styleUrls: ['./health-chart.component.css']
})
export class HealthChartComponent implements OnInit {

  // =========================
  // CHART
  // =========================

  option: any;

  // =========================
  // SLIDER STATE
  // =========================

  private width: number = window.innerWidth;

  translateX: number = -this.width;
  animate = false;
  loading = false;

  private dragStartX = 0;
  private dragging = false;
  private dragDelta = 0;

  private destroyRef = inject(DestroyRef);

  constructor(public store: ChartStore) {}

  // =========================
  // INIT
  // =========================

  ngOnInit(): void {



this.store.chart$
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe(state => {

    this.loading = state.loading;

    if (!state.data) return;

    this.option = this.buildOption(state.data);
  });

    this.store.load();
  }

  // =========================
  // RESIZE SAFE
  // =========================

  @HostListener('window:resize')
  onResize(): void {
    this.width = window.innerWidth;
    this.resetSlider();
  }

  // =========================
  // BUILD CHART
  // =========================

  buildOption(data: any) {

    const series = Object.keys(data.series).map(line => ({
  name: line,
  type: 'bar',

  barMaxWidth: 8,
  barGap: '20%',

  data: data.series[line].map((p:any) => [
    p.meter,
    p.faults
  ])
}));

    return {
      animation: false,
      tooltip: { trigger: 'axis' },

      xAxis: {
        type: 'value',
        name: 'Meters'
      },

      yAxis: {
        type: 'value',
        name: 'Faults'
      },

      series
    };
  }

  // =========================
  // BUTTON NAVIGATION (FIX)
  // =========================

  prev(): void {
    this.store.prev();
  }

  next(): void {
    this.store.next();
  }

  // =========================
  // SWIPE EVENTS
  // =========================

  onPointerDown(event: PointerEvent): void {
    this.dragging = true;
    this.dragStartX = event.clientX;
    this.animate = false;
  }

  onPointerMove(event: PointerEvent): void {

    if (!this.dragging) return;

    this.dragDelta = event.clientX - this.dragStartX;

    this.translateX =
      -this.width + this.dragDelta;
  }

  onPointerUp(): void {

    if (!this.dragging) return;

    this.dragging = false;

    const THRESHOLD = 120;
    this.animate = true;

    if (this.dragDelta > THRESHOLD) {

      this.translateX = 0;

      setTimeout(() => {
        this.store.prev();
        this.resetSlider();
      }, 350);

    } else if (this.dragDelta < -THRESHOLD) {

      this.translateX = -2 * this.width;

      setTimeout(() => {
        this.store.next();
        this.resetSlider();
      }, 350);

    } else {
      this.translateX = -this.width;
    }

    this.dragDelta = 0;
  }

  // =========================
  // RESET
  // =========================

  resetSlider(): void {
    this.animate = false;
    this.translateX = -this.width;
  }
}
