import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-grid',
  template: `
    <div class="grid-wrapper">
      <div class="grid" [style.grid-template-columns]="columns()">
        <ng-content />
      </div>
    </div>
  `,
  styleUrl: './grid.css',
})
export class Grid {
  minWidth = input('210px');
  columns = computed(() => `repeat(auto-fit, minmax(${this.minWidth()}, 1fr))`);
}