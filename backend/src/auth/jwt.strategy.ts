import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Student } from '../entities/student.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key-change-in-production',
    });
  }

  async validate(payload: any) {
    const { sub: id, isStudent } = payload;
    
    let user;
    
    if (isStudent) {
      user = await this.studentRepository.findOne({ where: { id } });
    } else {
      user = await this.userRepository.findOne({ where: { id } });
    }

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    
    // Don't include password in the returned user object
    delete user.password;
    
    return { 
      ...user, 
      isStudent
    };
  }
}
