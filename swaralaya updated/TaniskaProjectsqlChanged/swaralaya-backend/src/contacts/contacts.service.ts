import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    private emailService: EmailService,
  ) {}

  // Retrieve all contact inquiries from MySQL
  async findAll() {
    console.log('Fetching all contact messages...');
    const messages = await this.contactRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
    return messages;
  }

  // Create and save new contact submission from front-end form
  async create(data: Partial<Contact>) {
    console.log(`Creating contact submission from: ${data.name}`);
    
    const newContact = this.contactRepository.create(data);
    const savedContact = await this.contactRepository.save(newContact);

    // Send notification email to school admin
    try {
      const emailSubject = `📬 New Contact Message from ${data.name}`;
      const emailHtml = `
        <h2>New Contact Form Submission</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Name</strong></td><td style="padding: 8px; border: 1px solid #eee;">${data.name}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #eee;">${data.email}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Phone</strong></td><td style="padding: 8px; border: 1px solid #eee;">${data.phone || '-'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Subject</strong></td><td style="padding: 8px; border: 1px solid #eee;">${data.subject || '-'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Message</strong></td><td style="padding: 8px; border: 1px solid #eee;">${data.message}</td></tr>
        </table>
        <p><a href="${process.env.FRONTEND_URL}/admin/contacts">View in Admin Dashboard</a></p>
      `;

      await this.emailService.sendAdminNotification(emailSubject, emailHtml);
      console.log('Contact alert email sent successfully!');
    } catch (error) {
      console.log('Failed to send contact notification email:', error.message);
    }

    return savedContact;
  }

  // Mark message as read from admin dashboard
  async markRead(id: string) {
    console.log(`Marking contact ID ${id} as read...`);
    
    const result = await this.contactRepository.update(id, { isRead: true });
    
    if (result.affected === 0) {
      throw new NotFoundException('Contact record not found');
    }
    
    return { message: 'Marked as read successfully' };
  }

  // Get total count of unread contacts (for sidebar badge)
  async getUnreadCount() {
    console.log('Calculating unread contact messages...');
    const countVal = await this.contactRepository.count({ where: { isRead: false } });
    return { count: countVal };
  }
}
