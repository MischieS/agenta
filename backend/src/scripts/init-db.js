/**
 * Database initialization script for Agenta NestJS backend
 * This script creates the initial MySQL database if it doesn't exist
 */

const mysql = require('mysql2');
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

// Create a connection to MySQL server (without database specified)
const connection = mysql.createConnection({
  host: DB_HOST,
  port: parseInt(DB_PORT),
  user: DB_USERNAME,
  password: DB_PASSWORD,
});

// Function to create the database if it doesn't exist
async function initializeDatabase() {
  console.log('Initializing database...');
  
  try {
    // Create the database if it doesn't exist
    connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_DATABASE}\`;`, (err) => {
      if (err) {
        console.error('Error creating database:', err);
        connection.end();
        process.exit(1);
      }
      
      console.log(`Database '${DB_DATABASE}' created or already exists`);
      console.log('Database initialization complete!');
      console.log('You can now run the application with "npm run start:dev"');
      connection.end();
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    connection.end();
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase();
