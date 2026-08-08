export const SMTP_CONFIG_KEY = 'smtp_config';

export interface SmtpConfig {
  host: string;
  port: string | number;
  username: string;
  password: string;
  encryption: string;
  from_email: string;
  from_name: string;
  admin_emails: string[];
}

export interface SmtpConfigPublic {
  configured: boolean;
  host: string;
  port: string | number;
  username: string;
  encryption: string;
  from_email: string;
  from_name: string;
  admin_emails: string[];
  has_password: boolean;
}
