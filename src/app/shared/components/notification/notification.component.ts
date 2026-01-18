import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification, NotificationType } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      @for (notification of notificationService.notifications$(); track notification.id) {
        <div
          [class]="getNotificationClasses(notification.type)"
          class="rounded-xl border p-4 shadow-lg backdrop-blur-sm animate-slide-in-right"
          role="alert"
        >
          <div class="flex items-start gap-3">
            <!-- Icon -->
            <div class="flex-shrink-0 mt-0.5">
              <span class="text-xl">{{ getIcon(notification.type) }}</span>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-sm mb-1">{{ notification.title }}</h4>
              <p class="text-sm opacity-90">{{ notification.message }}</p>
            </div>

            <!-- Close button -->
            <button
              type="button"
              (click)="notificationService.remove(notification.id)"
              class="flex-shrink-0 ml-2 text-current opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Close notification"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Progress bar (optional) -->
          @if (notification.duration && notification.duration > 0) {
            <div class="mt-3 h-1 bg-black bg-opacity-20 rounded-full overflow-hidden">
              <div 
                class="h-full bg-current opacity-50 animate-progress"
                [style.animation-duration.ms]="notification.duration"
              ></div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-in-right {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes progress {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }

    .animate-slide-in-right {
      animation: slide-in-right 0.3s ease-out;
    }

    .animate-progress {
      animation: progress linear;
    }
  `]
})
export class NotificationComponent {
  notificationService = inject(NotificationService);

  getNotificationClasses(type: NotificationType): string {
    const baseClasses = 'border-l-4';
    
    const typeClasses: { [key in NotificationType]: string } = {
      'success': 'bg-green-900 bg-opacity-95 border-green-500 text-green-100',
      'error': 'bg-red-900 bg-opacity-95 border-red-500 text-red-100',
      'warning': 'bg-yellow-900 bg-opacity-95 border-yellow-500 text-yellow-100',
      'info': 'bg-blue-900 bg-opacity-95 border-blue-500 text-blue-100'
    };

    return `${baseClasses} ${typeClasses[type]}`;
  }

  getIcon(type: NotificationType): string {
    const icons: { [key in NotificationType]: string } = {
      'success': '✅',
      'error': '❌',
      'warning': '⚠️',
      'info': 'ℹ️'
    };

    return icons[type];
  }
}
