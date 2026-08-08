import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SaveSmtpConfigDto {
  @IsString()
  @IsNotEmpty()
  host: string;

  @IsNotEmpty()
  port: string | number;

  @IsEmail()
  username: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsString()
  @IsIn(['ssl', 'tls'])
  encryption: string;

  @IsEmail()
  from_email: string;

  @IsString()
  @IsNotEmpty()
  from_name: string;

  @IsOptional()
  admin_emails?: string | string[];
}
