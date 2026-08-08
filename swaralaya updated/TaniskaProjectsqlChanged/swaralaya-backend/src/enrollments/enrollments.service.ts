import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    private emailService: EmailService,
  ) {}

  // Get all enrollment forms from the database, sorted newest first
  async findAll() {
    console.log('Retrieving all enrollments from database...');
    const list = await this.enrollmentRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
    return list;
  }

  // Find one specific enrollment request by its database ID
  async findOne(id: string) {
    console.log(`Searching for enrollment ID: ${id}`);
    const foundEnrollment = await this.enrollmentRepository.findOne({ where: { id } });
    
    // If not found, throw error
    if (!foundEnrollment) {
      throw new NotFoundException('Enrollment not found in our database');
    }
    return foundEnrollment;
  }

  // Save new enrollment request when user submits public form
  // Automatically accepts the enrollment and sends confirmation email
  async create(data: Partial<Enrollment>) {
    console.log('Creating new enrollment request...');
    
    // Set status to accepted immediately (no admin review needed)
    const enrollmentData = {
      ...data,
      status: 'accepted',
    };
    
    const newEnrollment = this.enrollmentRepository.create(enrollmentData);
    const savedEnrollment = await this.enrollmentRepository.save(newEnrollment);

    // Send acceptance email to the student immediately
    try {
      const studentCourse = data.course || 'your chosen course';
      await this.emailService.sendEnrollmentAccepted(
        data.email,
        data.fullName,
        studentCourse,
      );
      console.log(`✅ Enrollment acceptance email sent to: ${data.email}`);
    } catch (error) {
      console.log('Failed to send confirmation email to student:', (error as Error).message);
    }

    // Admin can view enrollment details in the admin panel
    return savedEnrollment;
  }

  // Get total statistics counts for dashboard
  async getStats() {
    console.log('Calculating enrollment counts...');
    
    const totalCount = await this.enrollmentRepository.count();
    const acceptedCount = await this.enrollmentRepository.count({ where: { status: 'accepted' } });
    
    return { 
      total: totalCount, 
      pending: 0, 
      accepted: acceptedCount, 
      rejected: 0 
    };
  }
}