import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async findByStudentId(studentId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { studentId },
      order: { createdAt: 'ASC' },
    });
  }

  async create(data: {
    studentId: string;
    staffId?: string;
    content: string;
    isFromStaff: boolean;
  }): Promise<Message> {
    const message = this.messageRepository.create({
      studentId: data.studentId,
      staffId: data.staffId,
      content: data.content,
      isFromStaff: data.isFromStaff
    });
    
    return this.messageRepository.save(message);
  }
}
