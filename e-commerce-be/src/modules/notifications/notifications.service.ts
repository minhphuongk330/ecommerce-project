import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject, Observable, of, merge, interval } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Notification } from '../../entities/notification.entity';

@Injectable()
export class NotificationsService {
  private readonly notificationsSubject = new Subject<Notification>();

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  /** Tạo thông báo mới */
  async createNotification(
    userId: number | null,
    title: string,
    content: string,
    type: string,
    link?: string,
    isAdmin: boolean = false,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId,
      title,
      content,
      type,
      link,
      isAdmin,
      isRead: false,
    });
    const savedNotification = await this.notificationRepository.save(notification);
    this.notificationsSubject.next(savedNotification);
    return savedNotification;
  }

  /** Lấy danh sách thông báo của người dùng */
  async findAllForUser(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId, isAdmin: false },
      order: { createdAt: 'DESC' },
      take: 50, // Giới hạn lấy 50 thông báo gần nhất
    });
  }

  /** Lấy danh sách thông báo của Admin */
  async findAllForAdmin(): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { isAdmin: true },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  /** Lấy số thông báo chưa đọc của người dùng */
  async getUnreadCountForUser(userId: number): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, isAdmin: false, isRead: false },
    });
  }

  /** Lấy số thông báo chưa đọc của Admin */
  async getUnreadCountForAdmin(): Promise<number> {
    return this.notificationRepository.count({
      where: { isAdmin: true, isRead: false },
    });
  }

  /** Đánh dấu một thông báo là đã đọc */
  async markAsRead(id: number, userId?: number, isAdmin: boolean = false): Promise<Notification> {
    const whereClause: any = { id };
    if (userId !== undefined && !isAdmin) {
      whereClause.userId = userId;
    }
    if (isAdmin) {
      whereClause.isAdmin = true;
    }

    const notification = await this.notificationRepository.findOne({ where: whereClause });
    if (!notification) {
      throw new NotFoundException(`Không tìm thấy thông báo #${id}`);
    }

    notification.isRead = true;
    return this.notificationRepository.save(notification);
  }

  /** Đánh dấu tất cả thông báo là đã đọc */
  async markAllAsRead(userId?: number, isAdmin: boolean = false): Promise<void> {
    const updateConditions: any = { isRead: false };
    if (userId !== undefined && !isAdmin) {
      updateConditions.userId = userId;
      updateConditions.isAdmin = false;
    } else if (isAdmin) {
      updateConditions.isAdmin = true;
    }

    await this.notificationRepository.update(updateConditions, { isRead: true });
  }

  /** Đăng ký lắng nghe thông báo thời gian thực cho người dùng */
  subscribeToNotifications(userId: number): Observable<any> {
    const initial$ = of({ data: { type: 'CONNECTED', message: 'Connected to SSE' } });
    const notifications$ = this.notificationsSubject.asObservable().pipe(
      filter(notif => notif.userId === userId && !notif.isAdmin),
      map(notif => ({ data: notif })),
    );
    // Gửi ping mỗi 30 giây để giữ kết nối SSE không bị idle-timeout
    const heartbeat$ = interval(30_000).pipe(
      map(() => ({ data: { type: 'HEARTBEAT' } })),
    );
    return merge(initial$, notifications$, heartbeat$);
  }

  /** Đăng ký lắng nghe thông báo thời gian thực cho Admin */
  subscribeToAdminNotifications(): Observable<any> {
    const initial$ = of({ data: { type: 'CONNECTED', message: 'Connected to SSE' } });
    const notifications$ = this.notificationsSubject.asObservable().pipe(
      filter(notif => notif.isAdmin),
      map(notif => ({ data: notif })),
    );
    // Gửi ping mỗi 30 giây để giữ kết nối SSE không bị idle-timeout
    const heartbeat$ = interval(30_000).pipe(
      map(() => ({ data: { type: 'HEARTBEAT' } })),
    );
    return merge(initial$, notifications$, heartbeat$);
  }
}
