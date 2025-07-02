/**
 * Database seeding script for Agenta NestJS backend
 * This script seeds the database with initial test users and students
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_USERNAME = 'root',
  DB_PASSWORD = '',
  DB_DATABASE = 'agenta',
} = process.env;

async function seedDatabase() {
  console.log('Starting database seeding...');
  
  try {
    // Create a connection to the database
    const connection = await mysql.createConnection({
      host: DB_HOST,
      port: parseInt(DB_PORT),
      user: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_DATABASE,
    });

    console.log('Connected to database successfully');

    // Check if tables exist
    const [userTableResult] = await connection.query(`
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_schema = ? AND table_name = 'user'`, 
      [DB_DATABASE]
    );
    
    const [studentTableResult] = await connection.query(`
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_schema = ? AND table_name = 'student'`, 
      [DB_DATABASE]
    );

    if (userTableResult[0].count === 0) {
      // Create user table if it doesn't exist
      await connection.query(`
        CREATE TABLE user (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(100),
          surname VARCHAR(100),
          email VARCHAR(100) UNIQUE,
          password VARCHAR(255),
          role VARCHAR(50) DEFAULT 'user',
          pps_st_link VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('Created "user" table');
    }

    if (studentTableResult[0].count === 0) {
      // Create student table if it doesn't exist
      await connection.query(`
        CREATE TABLE student (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(100),
          surname VARCHAR(100),
          email VARCHAR(100) UNIQUE,
          password VARCHAR(255),
          phone VARCHAR(50),
          birthdate VARCHAR(50),
          country VARCHAR(100),
          address TEXT,
          pps_st_link VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('Created "student" table');
    }

    // Hash passwords for our test users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);
    const studentPassword = await bcrypt.hash('student123', 10);

    // Check if test users already exist
    const [existingAdmin] = await connection.query('SELECT * FROM user WHERE email = ?', ['admin@example.com']);
    
    if (existingAdmin.length === 0) {
      // Insert admin user
      await connection.query(`
        INSERT INTO user (id, name, surname, email, password, role, pps_st_link)
        VALUES (UUID(), 'Admin', 'User', 'admin@example.com', ?, 'admin', 'pps_admin_link')
      `, [adminPassword]);
      console.log('Created admin user: admin@example.com (password: admin123)');
    } else {
      console.log('Admin user already exists');
    }

    // Check if regular user exists
    const [existingUser] = await connection.query('SELECT * FROM user WHERE email = ?', ['user@example.com']);
    
    if (existingUser.length === 0) {
      // Insert regular user
      await connection.query(`
        INSERT INTO user (id, name, surname, email, password, role, pps_st_link)
        VALUES (UUID(), 'Regular', 'User', 'user@example.com', ?, 'user', 'pps_user_link')
      `, [userPassword]);
      console.log('Created regular user: user@example.com (password: user123)');
    } else {
      console.log('Regular user already exists');
    }

    // Check if student user exists
    const [existingStudent] = await connection.query('SELECT * FROM student WHERE email = ?', ['student@example.com']);
    
    if (existingStudent.length === 0) {
      // Insert student user
      await connection.query(`
        INSERT INTO student (id, name, surname, email, password, phone, birthdate, country, address, pps_st_link)
        VALUES (UUID(), 'Student', 'User', 'student@example.com', ?, '+1234567890', '1995-01-01', 'United States', '123 Student Street', 'pps_student_link')
      `, [studentPassword]);
      console.log('Created student user: student@example.com (password: student123)');
    } else {
      console.log('Student user already exists');
    }

    console.log('Database seeding complete!');
    console.log('\nYou can now log in with any of these test accounts:');
    console.log('- Admin: admin@example.com / admin123');
    console.log('- User: user@example.com / user123');
    console.log('- Student: student@example.com / student123');
    
    await connection.end();
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();
