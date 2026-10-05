import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeType = 'order' | 'stock' | 'general';
export type BadgeStatus = 
  // Order statuses
  | 'WAITING' | 'IN_PROGRESS' | 'RECEIVED' | 'CANCELLED'
  // Stock levels
  | 'CRITICAL' | 'LOW' | 'NORMAL' | 'HIGH'
  // General statuses
  | 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO' | 'PENDING';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span 
      [ngClass]="getBadgeClasses()"
      class="px-3 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1"
    >
      @if (icon) {
        <span>{{ icon }}</span>
      }
      {{ label || status }}
    </span>
  `
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: BadgeStatus | string;
  @Input() type: BadgeType = 'general';
  @Input() label?: string;
  @Input() icon?: string;
  @Input() customColor?: string;

  getBadgeClasses(): string {
    // If custom color is provided, use it
    if (this.customColor) {
      return this.customColor;
    }

    // Order status colors
    const orderStatusMap: { [key: string]: string } = {
      'WAITING': 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60',
      'IN_WAITING': 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60',
      'PENDING': 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60',
      'IN_PROGRESS': 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60',
      'IN_PRODUCTION': 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60',
      'IN_PREPARATION': 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60',
      'READY': 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/60',
      'IN_WAY': 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/60',
      'SCHEDULED': 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
      'RECEIVED': 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60',
      'DELIVERED': 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60',
      'FINISHED': 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60',
      'CANCELLED': 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60',
      'CANCELED': 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60',
      'FAILED': 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60',
      'BLOCKED': 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60'
    };

    // Stock level colors
    const stockLevelMap: { [key: string]: string } = {
      'CRITICAL': 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60',
      'LOW': 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60',
      'NORMAL': 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60',
      'HIGH': 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60'
    };

    // General status colors
    const generalStatusMap: { [key: string]: string } = {
      'SUCCESS': 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60',
      'WARNING': 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60',
      'ERROR': 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60',
      'INFO': 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60',
      'PENDING': 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
    };

    // Select the appropriate map based on type
    let colorMap: { [key: string]: string };
    switch (this.type) {
      case 'order':
        colorMap = orderStatusMap;
        break;
      case 'stock':
        colorMap = stockLevelMap;
        break;
      default:
        colorMap = generalStatusMap;
    }

    // Return the color class or default to neutral slate
    return colorMap[this.status] || orderStatusMap[this.status] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
  }
}
