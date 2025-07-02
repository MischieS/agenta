const bcrypt = require('bcrypt');
const { DataSource } = require('typeorm');
const { User } = require('../src/entities/user.entity');
const { Student } = require('../src/entities/student.entity');
require('dotenv').config({ path: '../.env' });

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Student],
  synchronize: false,
});

async function createDummyAccounts() {
  await AppDataSource.initialize();

  // Dummy admin user
  const admin = new User();
  admin.email = 'admin@example.com';
  admin.password = await bcrypt.hash('admin123', 10);
  admin.name = 'Admin';
  admin.surname = 'User';
  admin.role = 'admin';

  // Dummy student
  const student = new Student();
  student.email = 'student@example.com';
  student.password = await bcrypt.hash('student123', 10);
  student.name = 'Student';
  student.surname = 'User';

  await AppDataSource.manager.save(admin);
  await AppDataSource.manager.save(student);
  console.log('Dummy admin and student accounts created!');
  await AppDataSource.destroy();
}

createDummyAccounts().catch(err => {
  console.error(err);
  process.exit(1);
});
