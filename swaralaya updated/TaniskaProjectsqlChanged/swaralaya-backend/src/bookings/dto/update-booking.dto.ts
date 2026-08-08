import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BookingStatus } from '../booking.entity';
import { BookingAttendeeDto } from './create-booking.dto';

export class UpdateBookingDto {
  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string | null;

  @IsOptional()
  @IsString()
  notes?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingAttendeeDto)
  attendees?: BookingAttendeeDto[];

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
