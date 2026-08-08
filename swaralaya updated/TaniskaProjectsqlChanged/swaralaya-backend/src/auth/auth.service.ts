import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  // Check admin credentials, and if valid, return a JWT token
  async login(email: string, password: string) {
    // Read admin credentials from the .env file
    const validEmail = this.config.get('ADMIN_EMAIL');
    const validPassword = this.config.get('ADMIN_PASSWORD');

    // If email or password doesn't match, reject the login
    const emailMatches = email === validEmail;
    const passwordMatches = password === validPassword;
    
    if (!emailMatches || !passwordMatches) {
      console.log('Login attempt failed — wrong email or password');
      throw new UnauthorizedException('Invalid credentials. Please check your email and password.');
    }

    console.log('Admin login successful for:', email);
    
    // Create a payload (the data to store inside the token)
    const tokenPayload = {
      sub: 'admin',        // The subject, typically the user identifier
      email: email,        // Admin email
      role: 'admin',       // The role this token gives access to
    };

    // Sign the payload to create a JWT token
    const jwtToken = this.jwtService.sign(tokenPayload);

    // Return the token and user info to the frontend
    return {
      access_token: jwtToken,
      user: { email, role: 'admin' },
    };
  }

  // Verify a JWT token and return its payload (used by guards)
  verifyToken(token: string) {
    return this.jwtService.verify(token);
  }
}
