import { Component } from '@angular/core';
import { HealthChartComponent } from './analytics/health-chart.component';
import { LineStatusComponent } from './analytics/line-status.component';
import { TimeWindowComponent } from './analytics/time-window.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HealthChartComponent,
    LineStatusComponent,
    TimeWindowComponent
  ],
  template: `
    <app-line-status></app-line-status>
    <app-time-window></app-time-window>
    <app-health-chart></app-health-chart>
  `
})
export class App {}
