import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-[#111111] rounded-xl border border-gray-800 p-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex-1">
          <p class="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            {{ title }}
          </p>
          <p class="text-4xl font-bold text-white mt-2">{{ value }}</p>
        </div>
        <div 
          [ngClass]="'bg-' + iconBgColor + '-600'"
          class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
          <span class="text-2xl">{{ icon }}</span>
        </div>
      </div>
      <div class="border-t border-gray-800 pt-3 mt-3">
        <span 
          [ngClass]="'text-' + trendColor + '-500'"
          class="text-sm font-semibold">
          {{ trend }}
        </span>
      </div>
    </div>
  `,
  styleUrl: './stats-card.component.css',
})
export class StatsCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: string | number;
  @Input({ required: true }) icon!: string;
  @Input() iconBgColor: string = 'blue';
  @Input() trend: string = '';
  @Input() trendColor: string = 'gray';
}
