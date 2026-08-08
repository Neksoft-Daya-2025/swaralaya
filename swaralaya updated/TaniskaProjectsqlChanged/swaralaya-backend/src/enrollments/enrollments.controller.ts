import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/enrollments')
export class EnrollmentsController {
  constructor(private enrollmentsService: EnrollmentsService) {}

  // Public: submit enrollment form
  @Post()
  create(@Body() body: any) {
    return this.enrollmentsService.create(body);
  }

  // Admin: stats (must be before :id to avoid route conflict)
  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getStats() {
    return this.enrollmentsService.getStats();
  }

  // Admin: list all enrollments
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.enrollmentsService.findAll();
  }

  // Admin: get single enrollment details
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentsService.findOne(id);
  }
}