import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
  Sse,
  MessageEvent,
  Header,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../entities/customer.entity';
import { Observable } from 'rxjs';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /** Lấy thông báo của khách hàng hiện tại */
  @Get('notifications')
  @UseGuards(JwtAuthGuard)
  findAllForUser(@Request() req: { user: { id: number } }) {
    return this.notificationsService.findAllForUser(req.user.id);
  }

  /** Lấy số thông báo chưa đọc của khách hàng hiện tại */
  @Get('notifications/unread-count')
  @UseGuards(JwtAuthGuard)
  getUnreadCountForUser(@Request() req: { user: { id: number } }) {
    return this.notificationsService.getUnreadCountForUser(req.user.id);
  }

  /** Đánh dấu một thông báo của khách hàng là đã đọc */
  @Patch('notifications/:id/read')
  @UseGuards(JwtAuthGuard)
  markAsReadForUser(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { id: number } },
  ) {
    return this.notificationsService.markAsRead(id, req.user.id, false);
  }

  /** Đánh dấu tất cả thông báo của khách hàng là đã đọc */
  @Patch('notifications/read-all')
  @UseGuards(JwtAuthGuard)
  async markAllAsReadForUser(@Request() req: { user: { id: number } }) {
    await this.notificationsService.markAllAsRead(req.user.id, false);
    return { success: true };
  }

  /** Lấy thông báo của Admin */
  @Get('admin/notifications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAllForAdmin() {
    return this.notificationsService.findAllForAdmin();
  }

  /** Lấy số thông báo chưa đọc của Admin */
  @Get('admin/notifications/unread-count')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getUnreadCountForAdmin() {
    return this.notificationsService.getUnreadCountForAdmin();
  }

  /** Đánh dấu một thông báo của Admin là đã đọc */
  @Patch('admin/notifications/:id/read')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  markAsReadForAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.markAsRead(id, undefined, true);
  }

  /** Đánh dấu tất cả thông báo của Admin là đã đọc */
  @Patch('admin/notifications/read-all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async markAllAsReadForAdmin() {
    await this.notificationsService.markAllAsRead(undefined, true);
    return { success: true };
  }

  /** SSE endpoint nhận thông báo thời gian thực của khách hàng */
  @Sse('notifications/sse')
  @UseGuards(JwtAuthGuard)
  @Header('Access-Control-Allow-Origin', '*')
  notificationsSse(@Request() req: { user: { id: number } }): Observable<MessageEvent> {
    return this.notificationsService.subscribeToNotifications(req.user.id);
  }

  /** SSE endpoint nhận thông báo thời gian thực của Admin */
  @Sse('admin/notifications/sse')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Header('Access-Control-Allow-Origin', '*')
  adminNotificationsSse(): Observable<MessageEvent> {
    return this.notificationsService.subscribeToAdminNotifications();
  }
}
