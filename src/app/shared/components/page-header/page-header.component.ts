import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{{ title }}</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ description }}</p>
      </div>
      @if (showButton) {
        @if (buttonLink) {
          <a
            [routerLink]="buttonLink"
            [ngClass]="buttonClass"
            class="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-xs"
          >
            {{ buttonText }}
          </a>
        } @else {
          <button
            (click)="buttonClick.emit()"
            [ngClass]="buttonClass"
            class="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-xs"
          >
            {{ buttonText }}
          </button>
        }
      }
    </div>
  `
})
export class PageHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input() showButton: boolean = true;
  @Input() buttonText: string = 'Add New';
  @Input() buttonLink?: string;
  @Input() buttonClass: string = 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900';
  @Output() buttonClick = new EventEmitter<void>();
}
