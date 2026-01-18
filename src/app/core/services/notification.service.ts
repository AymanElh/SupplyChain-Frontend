import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);
  private notificationId = 0;

  // Expose notifications as readonly signal
  readonly notifications$ = this.notifications.asReadonly();

  /**
   * Show a success notification
   */
  success(title: string, message: string, duration: number = 5000): void {
    this.show('success', title, message, duration);
  }

  /**
   * Show an error notification
   */
  error(title: string, message: string, duration: number = 7000): void {
    this.show('error', title, message, duration);
  }

  /**
   * Show a warning notification
   */
  warning(title: string, message: string, duration: number = 6000): void {
    this.show('warning', title, message, duration);
  }

  /**
   * Show an info notification
   */
  info(title: string, message: string, duration: number = 5000): void {
    this.show('info', title, message, duration);
  }

  /**
   * Show a notification
   */
  private show(type: NotificationType, title: string, message: string, duration: number): void {
    const notification: Notification = {
      id: `notification-${++this.notificationId}`,
      type,
      title,
      message,
      duration,
      timestamp: new Date()
    };

    // Add notification to the list
    this.notifications.update(notifications => [...notifications, notification]);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification.id);
      }, duration);
    }
  }

  /**
   * Remove a notification by ID
   */
  remove(id: string): void {
    this.notifications.update(notifications => 
      notifications.filter(n => n.id !== id)
    );
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notifications.set([]);
  }
}
