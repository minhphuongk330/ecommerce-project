import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ResolveContactDto } from './dto/resolve-contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../entities/customer.entity';

@Controller()
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post('contacts')
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createContactDto: CreateContactDto,
    @Request() req: { user: { id: number; email: string } },
  ) {
    return this.contactsService.create(createContactDto, req.user.id);
  }

  @Get('contacts/my-history')
  @UseGuards(JwtAuthGuard)
  findMyHistory(@Request() req: { user: { id: number; email: string } }) {
    return this.contactsService.findByUserId(req.user.id);
  }

  @Get('admin/contacts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.contactsService.findAll();
  }

  @Patch('admin/contacts/:id/resolve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  resolve(
    @Param('id', ParseIntPipe) id: number,
    @Body() resolveContactDto: ResolveContactDto,
  ) {
    return this.contactsService.resolve(id, resolveContactDto.adminReply);
  }
}
