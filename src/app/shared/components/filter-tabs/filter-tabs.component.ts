import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FilterTab {
  label: string;
  value: string;
  count?: number;
  color?: string;
}

@Component({
  selector: 'app-filter-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-[#111111] rounded-xl border border-gray-800 mb-6 overflow-hidden">
      <div class="flex border-b border-gray-800">
        @for (tab of tabs; track tab.value) {
          <button
            (click)="onTabClick(tab.value)"
            [class]="getTabClasses(tab)"
            class="px-6 py-3 font-semibold hover:text-white hover:bg-[#0a0a0a] transition-colors"
          >
            {{ tab.label }}
            @if (tab.count !== undefined) {
              <span class="ml-1">({{ tab.count }})</span>
            }
          </button>
        }
      </div>
    </div>
  `
})
export class FilterTabsComponent {
  @Input({ required: true }) tabs!: FilterTab[];
  @Input({ required: true }) activeTab!: string;
  @Output() tabChange = new EventEmitter<string>();

  onTabClick(value: string): void {
    this.tabChange.emit(value);
  }

  getTabClasses(tab: FilterTab): string {
    const isActive = this.activeTab === tab.value;
    
    if (!isActive) {
      return 'text-gray-400';
    }

    // Active tab classes based on color
    const colorMap: { [key: string]: string } = {
      'blue': 'bg-blue-600 text-white',
      'yellow': 'bg-yellow-600 text-white',
      'red': 'bg-red-600 text-white',
      'green': 'bg-green-600 text-white',
      'purple': 'bg-purple-600 text-white',
      'gray': 'bg-gray-600 text-white'
    };

    return colorMap[tab.color || 'blue'] || 'bg-blue-600 text-white';
  }
}
