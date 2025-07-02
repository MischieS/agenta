import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.log('No token provided');
      return false;
    }

    try {
      console.log('Attempting to verify token:', token.substring(0, 15) + '...');
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'super-secret-key-change-in-production'
      });
      
      console.log('Token payload:', payload);
      
      // For testing purposes - allow a test token with sub=test-user-id
      if (payload.sub === 'test-user-id') {
        console.log('Test user authenticated');
        request.user = {
          id: payload.sub,
          email: 'test@example.com',
          isStudent: payload.isStudent || false,
          role: 'user'
        };
        return true;
      }
      
      // JWT valid - attach payload to request
      request.user = payload;
      return true;
    } catch (error) {
      console.error('JWT verification failed:', error.message);
      return false;
    }
    
    // Authentication already handled in the try/catch block
    return false;
  }
}
