// types/notification.ts

export interface INotification {
  id: number;
  userId: string;
  message: string | null;
  createdAt: string | null;
  type: string | null;
  link: string | null;
  isRead: boolean;
  type?: string;
}

export interface NotificationsResponse {
  ok: boolean;
  notifications: INotification[];
  total: number;
  unreadCount: number;
  filter: string;
}

export interface MarkAsReadRequest {
  notificationIds: number[];
  markAsRead?: boolean; // defaults to true
}

export interface MarkAsReadResponse {
  ok: boolean;
  message: string;
  updatedCount: number;
}
