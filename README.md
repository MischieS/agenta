# Agenta - Next.js Frontend with NestJS Backend

This project consists of a Next.js frontend application with a NestJS backend API. The authentication system supports both regular users and students with their respective profiles.

## Project Structure

- `/` - Next.js frontend application
- `/backend-nest` - NestJS backend API

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MySQL (local or remote)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend-nest
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Check the `.env` file and update with your MySQL database credentials if necessary

4. Initialize the database:
   ```bash
   npm run init:db
   ```

5. Start the backend development server:
   ```bash
   npm run start:dev
   ```
   The backend will be available at http://localhost:3001/api

### Frontend Setup

1. From the root directory, install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - The `.env.local` file should be set up with the NestJS backend URL

3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at http://localhost:3000

### Running Both Frontend and Backend

For convenience, you can start both the frontend and backend concurrently:

```bash
npm run dev:all
```

## Features

- Authentication system with JWT
- User/Student registration and login
- Profile management for both user types
- Secure API endpoints protected with JWT auth guards

## API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/users/profile` - Get current user profile
- `PATCH /api/users/profile` - Update user profile
- `PATCH /api/users/student` - Update student profile
