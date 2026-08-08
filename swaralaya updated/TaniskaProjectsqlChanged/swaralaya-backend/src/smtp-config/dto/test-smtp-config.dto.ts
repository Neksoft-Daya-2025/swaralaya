import { IsEmail, IsOptional } from 'class-validator';

export class TestSmtpConfigDto {
  @IsOptional()
  @IsEmail()
  to_email?: string;
}
