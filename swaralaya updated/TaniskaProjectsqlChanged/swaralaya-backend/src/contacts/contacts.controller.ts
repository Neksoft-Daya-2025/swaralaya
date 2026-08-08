import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/contacts')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  // Public: submit contact form
  @Post()
  create(@Body() body: any) {
    return this.contactsService.create(body);
  }

  // Admin: unread count (must be before :id to avoid route conflict)
  @UseGuards(JwtAuthGuard)
  @Get('unread-count')
  getUnreadCount() {
    return this.contactsService.getUnreadCount();
  }

  // Admin: list all contacts
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.contactsService.findAll();
  }

  // Admin: mark as read
  @UseGuards(JwtAuthGuard)
  @Put(':id/read')
  markRead(@Param('id') id: string) {
    return this.contactsService.markRead(id);
  }
}
