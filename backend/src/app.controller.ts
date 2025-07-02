import { Controller, Get, Post, Body, UseGuards, Param, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth.guard';
import { StudentRepository } from './repositories/student.repository';
import { MessageRepository } from './repositories/message.repository';
import { Request } from 'express';

type StudentSubmission = {
  name: string;
  email: string;
  degreeType: string;
  selectedDepartments: string[];
};

@Controller()
export class AppController {
  @Get('health')
  healthCheck() {
    return { 
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      service: 'agenta-backend'
    };
  }
  constructor(
    private readonly appService: AppService,
    private readonly studentRepository: StudentRepository,
    private readonly messageRepository: MessageRepository
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('students/submit')
  @UseGuards(AuthGuard)
  async submitStudent(@Body() submission: StudentSubmission) {
    try {
      const student = await this.studentRepository.create({
        name: submission.name,
        email: submission.email,
        degree_type: submission.degreeType,
        departments: submission.selectedDepartments,
        status: 'pending'
      });

      return {
        success: true,
        studentId: student.id
      };
    } catch (error) {
      console.error('Error creating student:', error);
      return {
        success: false,
        error: 'Failed to create student record'
      };
    }
  }

  @Post('students/:id/assign')
  @UseGuards(AuthGuard)
  async assignStaff(
    @Param('id') studentId: string,
    @Body() body: { staffId: string },
    @Req() req: Request
  ) {
    try {
      const student = await this.studentRepository.update(studentId, {
        assignedStaffId: body.staffId,
        status: 'assigned'
      });

      if (!student) {
        return {
          success: false,
          error: 'Student not found'
        };
      }

      return {
        success: true,
        student
      };
    } catch (error) {
      console.error('Error assigning staff:', error);
      return {
        success: false,
        error: 'Failed to assign staff'
      };
    }
  }

  @Get('students/:id/messages')
  @UseGuards(AuthGuard)
  async getMessages(@Param('id') studentId: string) {
    try {
      const messages = await this.messageRepository.findByStudentId(studentId);
      
      return {
        success: true,
        messages
      };
    } catch (error) {
      console.error('Error fetching messages:', error);
      return {
        success: false,
        error: 'Failed to fetch messages'
      };
    }
  }

  @Post('students/:id/messages')
  @UseGuards(AuthGuard)
  async sendMessage(
    @Param('id') studentId: string,
    @Body() body: { content: string, staffId?: string },
    @Req() req: Request
  ) {
    try {
      // Extract user info from JWT
      const user = req.user as any;
      const isStaff = user && user.role === 'staff';
      
      const message = await this.messageRepository.create({
        studentId,
        staffId: body.staffId || (isStaff ? user.id : undefined),
        content: body.content,
        isFromStaff: isStaff
      });
      
      return {
        success: true,
        message
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        error: 'Failed to send message'
      };
    }
  }
}
