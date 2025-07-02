import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';

@Injectable()
export class StudentRepository {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async create(data: {
    name: string;
    email: string;
    degree_type?: string;
    departments?: string[];
    status?: string;
  }): Promise<Student> {
    // Create a new student entity
    const student = this.studentRepository.create({
      name: data.name,
      email: data.email,
      degreeType: data.degree_type || 'unknown',
      departments: data.departments || [],
      status: data.status || 'pending'
    });
    
    // Save the student to the database
    return this.studentRepository.save(student);
  }

  async update(id: string, data: any): Promise<Student | null> {
    // Find student by id
    const student = await this.studentRepository.findOne({
      where: { id }
    });

    if (!student) return null;

    // Update student properties
    if (data.assigned_staff_id) {
      student.assignedStaffId = data.assigned_staff_id;
    }
    
    if (data.status) student.status = data.status;
    
    // Save updated student
    return this.studentRepository.save(student);
  }

  // Message methods have been moved to MessageRepository
}
