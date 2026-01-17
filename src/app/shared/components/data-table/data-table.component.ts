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
    <div class="bg-[#111111] rounded-xl border border-gray-800 overflow-hidden">
      @if (loading) {
        <div class="p-12 text-center">
          <div class="text-gray-400 text-lg">{{ loadingMessage }}</div>
        </div>
      } @else if (data.length === 0) {
        <div class="p-12 text-center">
          <div class="text-4xl mb-3">{{ emptyIcon }}</div>
          <p class="text-gray-500">{{ emptyMessage }}</p>
        </div>
      } @else {
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-[#0a0a0a] border-b border-gray-800">
              <tr>
                @for (column of columns; track column.key) {
                  <th 
                    [class]="'px-6 py-4 text-' + (column.align || 'left') + ' text-xs font-semibold text-gray-400 uppercase tracking-wider'"
                    [style.width]="column.width"
                  >
                    {{ column.label }}
                  </th>
                }
                @if (actions && actions.length > 0) {
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                }
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800">
              @for (row of data; track trackBy ? trackBy(row) : row) {
                <tr 
                  class="hover:bg-[#0a0a0a] transition-colors"
                  [class.cursor-pointer]="rowClickable"
                  (click)="onRowClick(row)"
                >
                  @for (column of columns; track column.key) {
                    <td 
                      [class]="'px-6 py-4 text-sm ' + getCellClass(column, row)"
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
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      <div class="flex gap-2">
                        @for (action of getVisibleActions(row); track action.label) {
                          <button
                            type="button"
                            (click)="onActionClick($event, action, row)"
                            [class]="getActionClass(action)"
                            class="px-4 py-2 rounded-lg text-xs font-medium transition-colors"
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
    
    const colorClass = column.type === 'number' ? 'text-gray-400' : 'text-white';
    
    return `${baseClass} ${colorClass}`;
  }

  getActionClass(action: TableAction): string {
    const colorMap: { [key: string]: string } = {
      'blue': 'bg-blue-600 hover:bg-blue-700 text-white',
      'green': 'bg-green-600 hover:bg-green-700 text-white',
      'red': 'bg-red-600 hover:bg-red-700 text-white',
      'yellow': 'bg-yellow-600 hover:bg-yellow-700 text-white',
      'gray': 'bg-gray-700 hover:bg-gray-600 text-white'
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
