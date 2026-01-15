import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="getStatusClass()">
      {{ status }}
    </span>
  `
})
export class StatusBadgeComponent {
  @Input() status: string = '';

  getStatusClass(): string {
    const base = 'px-3 py-1 text-xs font-medium rounded-full';
    const colors: { [key: string]: string } = {
      'PENDING': 'bg-yellow-900 text-yellow-200',
      'IN_PROGRESS': 'bg-blue-900 text-blue-200',
      'COMPLETED': 'bg-green-900 text-green-200',
      'CANCELLED': 'bg-red-900 text-red-200'
    };
    return `${base} ${colors[this.status] || 'bg-gray-700 text-gray-300'}`;
  }
}
