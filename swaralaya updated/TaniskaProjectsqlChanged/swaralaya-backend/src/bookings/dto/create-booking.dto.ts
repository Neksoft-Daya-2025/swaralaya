import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateBookingItemDto {
  @IsUUID()
  ticketTypeId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class BookingAttendeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}

export class CreateBookingDto {
  @IsUUID()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BookingAttendeeDto)
  attendees: BookingAttendeeDto[];

  // Retained as optional for backwards compatibility; event-level pricing is authoritative.
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBookingItemDto)
  items?: CreateBookingItemDto[];
}
