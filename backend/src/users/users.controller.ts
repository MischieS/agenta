import { Controller, Get, Patch, Body, UseGuards, Request, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { Student } from '../entities/student.entity';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    if (req.user.isStudent) {
      return this.usersService.getStudentProfile(req.user.id);
    } else {
      return this.usersService.getUserProfile(req.user.id);
    }
  }

  @Patch('profile')
  async updateProfile(@Request() req, @Body() updateData: Partial<User>) {
    return this.usersService.updateUserProfile(req.user.id, updateData);
  }

  @Patch('student')
  async updateStudentProfile(@Request() req, @Body() updateData: Partial<Student>) {
    return this.usersService.updateStudentProfile(req.user.id, updateData);
  }
}
