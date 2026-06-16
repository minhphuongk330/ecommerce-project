import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../../entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createContactDto: CreateContactDto, userId: number): Promise<Contact> {
    const contact = this.contactRepository.create({
      ...createContactDto,
      userId,
      status: 'PENDING',
    });
    const savedContact = await this.contactRepository.save(contact);

    try {
      await this.notificationsService.createNotification(
        null,
        'Yêu cầu hỗ trợ mới',
        `Khách hàng vừa gửi yêu cầu hỗ trợ mới với tiêu đề: "${savedContact.subject}".`,
        'NEW_CONTACT',
        '/admin/contacts',
        true,
      );
    } catch (error) {
      console.error('Failed to create contact notification for admin:', error);
    }

    return savedContact;
  }

  async findAll(): Promise<Contact[]> {
    return this.contactRepository.find({
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByUserId(userId: number): Promise<Contact[]> {
    return this.contactRepository.find({
      where: { userId },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async resolve(id: number, adminReply: string): Promise<Contact> {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Không tìm thấy phản hồi với mã liên hệ #${id}`);
    }

    contact.status = 'RESOLVED';
    contact.adminReply = adminReply;
    contact.resolvedAt = new Date();

    const savedContact = await this.contactRepository.save(contact);

    if (savedContact.userId) {
      try {
        await this.notificationsService.createNotification(
          savedContact.userId,
          'Phản hồi yêu cầu hỗ trợ',
          `Yêu cầu hỗ trợ của bạn về "${savedContact.subject}" đã được phản hồi bởi quản trị viên.`,
          'CONTACT_REPLY',
          '/contact',
          false,
        );
      } catch (error) {
        console.error('Failed to create support reply notification for user:', error);
      }
    }

    return savedContact;
  }
}
