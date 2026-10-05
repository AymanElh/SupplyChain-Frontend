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
    <div class="bg-slate-100/90 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 inline-flex flex-wrap gap-1 mb-6">
      @for (tab of tabs; track tab.value) {
        <button
          type="button"
          (click)="onTabClick(tab.value)"
          [class]="getTabClasses(tab)"
          class="px-4 py-2 text-xs font-semibold rounded-lg transition-all inline-flex items-center gap-1.5"
        >
          <span>{{ tab.label }}</span>
          @if (tab.count !== undefined) {
            <span [class]="activeTab === tab.value ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200' : 'bg-slate-200 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400'" 
                  class="px-1.5 py-0.2 rounded-full text-[10px] font-bold">
              {{ tab.count }}
            </span>
          }
        </button>
      }
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
      return 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-700/50';
    }

    return 'bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 shadow-xs border border-slate-200/80 dark:border-slate-700';
  }
}
