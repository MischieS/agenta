import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Student } from '../entities/student.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async login(loginDto: LoginDto) {
    // Try to find the user in both User and Student tables
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      select: ['id', 'email', 'password', 'name', 'surname', 'role'],
    });

    const student = await this.studentRepository.findOne({
      where: { email: loginDto.email },
      select: ['id', 'email', 'password', 'name', 'surname'],
    });

    // Determine which account type to use
    const account = user || student;
    const isStudent = !!student && !user;

    if (!account) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(loginDto.password, account.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create JWT payload
    const payload = { 
      sub: account.id, 
      email: account.email,
      isStudent 
    };

    // Return user data and token
    return {
      user: {
        id: account.id,
        email: account.email,
        isStudent,
        user: isStudent ? undefined : user,
        student: isStudent ? student : undefined,
      },
      token: this.jwtService.sign(payload),
    };
  }

  // Registration method removed as requested
}
