import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'badge' | 'custom';
  sortable?: boolean;
  template?: TemplateRef<any>;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableAction {
  label: string;
  icon?: string;
  color?: 'blue' | 'green' | 'red' | 'gray' | 'yellow';
  action: (row: any) => void;
  show?: (row: any) => boolean;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-[#111827] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      @if (loading) {
        <div class="p-12 text-center">
          <div class="text-slate-500 dark:text-slate-400 text-sm font-medium">{{ loadingMessage }}</div>
        </div>
      } @else if (data.length === 0) {
        <div class="p-12 text-center">
          <div class="text-3xl mb-2 text-slate-400 dark:text-slate-500">{{ emptyIcon }}</div>
          <p class="text-slate-500 dark:text-slate-400 text-sm">{{ emptyMessage }}</p>
        </div>
      } @else {
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50/80 dark:bg-slate-800/70 border-b border-slate-200/90 dark:border-slate-700/80">
              <tr>
                @for (column of columns; track column.key) {
                  <th 
                    [class]="'px-6 py-3.5 text-' + (column.align || 'left') + ' text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider'"
                    [style.width]="column.width"
                  >
                    {{ column.label }}
                  </th>
                }
                @if (actions && actions.length > 0) {
                  <th class="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                }
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80">
              @for (row of data; track trackBy ? trackBy(row) : row) {
                <tr 
                  class="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                  [class.cursor-pointer]="rowClickable"
                  (click)="onRowClick(row)"
                >
                  @for (column of columns; track column.key) {
                    <td 
                      [class]="'px-6 py-3.5 text-sm ' + getCellClass(column, row)"
                      [style.width]="column.width"
                    >
                      @if (column.template) {
                        <ng-container *ngTemplateOutlet="column.template; context: { $implicit: row }"></ng-container>
                      } @else {
                        {{ getCellValue(row, column) }}
                      }
                    </td>
                  }
                  @if (actions && actions.length > 0) {
                    <td class="px-6 py-3.5 whitespace-nowrap text-sm">
                      <div class="flex gap-2">
                        @for (action of getVisibleActions(row); track action.label) {
                          <button
                            type="button"
                            (click)="onActionClick($event, action, row)"
                            [class]="getActionClass(action)"
                            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border"
                          >
                            @if (action.icon) {
                              <span class="mr-1">{{ action.icon }}</span>
                            }
                            {{ action.label }}
                          </button>
                        }
                      </div>
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `
})
export class DataTableComponent {
  @Input({ required: true }) columns!: TableColumn[];
  @Input({ required: true }) data: any[] = [];
  @Input() actions?: TableAction[];
  @Input() loading: boolean = false;
  @Input() loadingMessage: string = 'Loading...';
  @Input() emptyMessage: string = 'No data available';
  @Input() emptyIcon: string = '📭';
  @Input() rowClickable: boolean = false;
  @Input() trackBy?: (item: any) => any;
  
  @Output() rowClick = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<{ action: TableAction; row: any }>();

  getCellValue(row: any, column: TableColumn): any {
    const value = row[column.key];
    
    if (column.type === 'number' && typeof value === 'number') {
      return value.toLocaleString();
    }
    
    if (column.type === 'date' && value) {
      return new Date(value).toLocaleDateString();
    }
    
    return value ?? '-';
  }

  getCellClass(column: TableColumn, row: any): string {
    const baseClass = column.align === 'right' ? 'text-right' : 
                     column.align === 'center' ? 'text-center' : 'text-left';
    
    const colorClass = column.type === 'number' ? 'text-slate-600 dark:text-slate-400 font-mono' : 'text-slate-800 dark:text-slate-200 font-medium';
    
    return `${baseClass} ${colorClass}`;
  }

  getActionClass(action: TableAction): string {
    const colorMap: { [key: string]: string } = {
      'blue': 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 border-transparent shadow-xs',
      'green': 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60',
      'red': 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-800 dark:text-rose-300 border-rose-200/80 dark:border-rose-900/60',
      'yellow': 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60',
      'gray': 'bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-xs'
    };
    
    return colorMap[action.color || 'blue'] || colorMap['blue'];
  }

  getVisibleActions(row: any): TableAction[] {
    if (!this.actions) return [];
    return this.actions.filter(action => !action.show || action.show(row));
  }

  onRowClick(row: any): void {
    if (this.rowClickable) {
      this.rowClick.emit(row);
    }
  }

  onActionClick(event: Event, action: TableAction, row: any): void {
    event.stopPropagation();
    action.action(row);
    this.actionClick.emit({ action, row });
  }
}
