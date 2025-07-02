import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  surname?: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  birthdate?: Date;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ default: 'pending' })
  status: string;
  
  @Column({ name: 'degree_type' })
  degreeType: string;
  
  @Column('text', { array: true })
  departments: string[];
  
  @Column({ nullable: true, name: 'assigned_staff_id' })
  assignedStaffId?: string;
  
  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigned_staff_id' })
  assignedStaff: User;

  @Column({ nullable: true, name: 'pps_st_link' })
  ppsStLink?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
