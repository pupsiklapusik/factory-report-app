import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartStore } from './services/chart-store.service';

@Component({
  selector: 'app-time-window',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './time-window.component.html',
  styleUrls: ['./time-window.component.css']
})
export class TimeWindowComponent {

  periods = ['D','W','M','6M','Y'];

  constructor(public chart: ChartStore) {}

  select(p: string) {
    this.chart.load(p, 0);
  }
}
