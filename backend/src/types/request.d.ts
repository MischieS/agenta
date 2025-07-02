import { User } from '../entities/user.entity';
import { Student } from '../entities/student.entity';

declare module 'express' {
  interface Request {
    user?: User | Student | { id: string; email: string; isStudent?: boolean; [key: string]: any };
  }
}
