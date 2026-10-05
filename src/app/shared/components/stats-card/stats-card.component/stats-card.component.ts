import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-[#111827] rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {{ title }}
          </p>
          <p class="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-2 tabular-nums">
            {{ value }}
          </p>
        </div>
        <div 
          [ngClass]="getIconBgClasses()"
          class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-slate-700 dark:text-slate-200 border">
          <span class="text-lg">{{ icon }}</span>
        </div>
      </div>
      @if (trend) {
        <div class="border-t border-slate-100 dark:border-slate-800/80 pt-3 mt-4 flex items-center justify-between">
          <span 
            [ngClass]="getTrendClasses()"
            class="text-xs font-semibold inline-flex items-center gap-1">
            {{ trend }}
          </span>
          <span class="text-[11px] text-slate-400 dark:text-slate-500">vs. last month</span>
        </div>
      }
    </div>
  `,
})

export class StatsCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: string | number;
  @Input({ required: true }) icon!: string;
  @Input() iconBgColor: string = 'blue';
  @Input() trend: string = '';
  @Input() trendColor: string = 'gray';

  getIconBgClasses(): string {
    const map: Record<string, string> = {
      blue: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-800/60 text-blue-700 dark:text-blue-300',
      green: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300',
      purple: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300',
      yellow: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/60 text-amber-700 dark:text-amber-300',
      red: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-900/60 text-rose-700 dark:text-rose-300',
      gray: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
    };
    return map[this.iconBgColor] || map['blue'];
  }

  getTrendClasses(): string {
    const map: Record<string, string> = {
      green: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/60',
      yellow: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200/60 dark:border-amber-800/60',
      red: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200/60 dark:border-rose-900/60',
      blue: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-200/60 dark:border-blue-800/60',
      gray: 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700'
    };
    return map[this.trendColor] || map['gray'];
  }
}
