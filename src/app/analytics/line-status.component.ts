import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinesStore } from './services/lines-store.service';

@Component({
  selector: 'app-line-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './line-status.component.html',
  styleUrls: ['./line-status.component.css']
})
export class LineStatusComponent implements OnInit {

  constructor(public store: LinesStore) {}

  ngOnInit() {
    this.store.load();
  }

  select(line: string) {
    this.store.select(line);
  }
}
