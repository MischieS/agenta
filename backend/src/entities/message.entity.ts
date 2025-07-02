import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from './student.entity';
import { User } from './user.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id' })
  studentId: string;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ name: 'staff_id', nullable: true })
  staffId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'staff_id' })
  staff: User;

  @Column()
  content: string;

  @Column({ name: 'is_from_staff' })
  isFromStaff: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
