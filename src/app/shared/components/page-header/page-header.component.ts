import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">{{ title }}</h1>
        <p class="text-sm text-gray-400">{{ description }}</p>
      </div>
      @if (showButton) {
        @if (buttonLink) {
          <a
            [routerLink]="buttonLink"
            [ngClass]="buttonClass"
            class="px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {{ buttonText }}
          </a>
        } @else {
          <button
            (click)="buttonClick.emit()"
            [ngClass]="buttonClass"
            class="px-6 py-3 rounded-lg font-medium transition-colors"
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
  @Input() buttonClass: string = 'bg-blue-600 hover:bg-blue-700 text-white';
  @Output() buttonClick = new EventEmitter<void>();
}
