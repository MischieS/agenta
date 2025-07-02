import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Student } from '../entities/student.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>
  ) {}

  async updateUserProfile(userId: string, updateData: Partial<User>) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user with new data
    Object.assign(user, updateData);
    
    // Save the updated user
    await this.userRepository.save(user);
    
    // Return the updated user without the password
    const { password, ...result } = user;
    return result;
  }

  async updateStudentProfile(studentId: string, updateData: Partial<Student>) {
    const student = await this.studentRepository.findOne({ where: { id: studentId } });
    
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Update student with new data
    Object.assign(student, updateData);
    
    // Save the updated student
    await this.studentRepository.save(student);
    
    // Return the updated student without the password
    const { password, ...result } = student;
    return result;
  }

  async getUserProfile(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Return user without the password
    const { password, ...result } = user;
    return result;
  }

  async getStudentProfile(studentId: string) {
    const student = await this.studentRepository.findOne({ where: { id: studentId } });
    
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    
    // Return student without the password
    const { password, ...result } = student;
    return result;
  }
}
