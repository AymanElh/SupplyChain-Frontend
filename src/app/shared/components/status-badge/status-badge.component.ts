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
      'WAITING': 'bg-yellow-900 text-yellow-200',
      'IN_PROGRESS': 'bg-blue-900 text-blue-200',
      'RECEIVED': 'bg-green-900 text-green-200',
      'CANCELLED': 'bg-red-900 text-red-200'
    };

    // Stock level colors
    const stockLevelMap: { [key: string]: string } = {
      'CRITICAL': 'bg-red-900 text-red-200',
      'LOW': 'bg-yellow-900 text-yellow-200',
      'NORMAL': 'bg-green-900 text-green-200',
      'HIGH': 'bg-blue-900 text-blue-200'
    };

    // General status colors
    const generalStatusMap: { [key: string]: string } = {
      'SUCCESS': 'bg-green-900 text-green-200',
      'WARNING': 'bg-yellow-900 text-yellow-200',
      'ERROR': 'bg-red-900 text-red-200',
      'INFO': 'bg-blue-900 text-blue-200',
      'PENDING': 'bg-gray-700 text-gray-300'
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

    // Return the color class or default to gray
    return colorMap[this.status] || 'bg-gray-700 text-gray-300';
  }
}
