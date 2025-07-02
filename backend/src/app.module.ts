import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './entities/user.entity';
import { Student } from './entities/student.entity';
import { Message } from './entities/message.entity';
import { Role } from './entities/role.entity';
import { Staff } from './entities/staff.entity';
import { University } from './entities/university.entity';
import { UserDocument } from './entities/user-document.entity';
import { MessageRepository } from './repositories/message.repository';
import { StudentRepository } from './repositories/student.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      entities: [User, Student, Message, Role, Staff, University, UserDocument],
      synchronize: false, // Disabled to prevent automatic schema synchronization
    }),
    TypeOrmModule.forFeature([User, Student, Message, Role, Staff, University, UserDocument]), // Make entities available for repository injection
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, MessageRepository, StudentRepository],
})
export class AppModule {}
