# Resume Builder Application

A full-stack application for creating and managing professional resumes with Spring Boot backend, React frontend, and PostgreSQL database.

## Features

- User authentication and authorization with JWT
- Role-based access control (User and Admin roles)
- Create, read, update, and delete resumes
- Dynamic form for adding professional details with validation
- PDF generation for resumes
- Multiple resume templates/themes
- Admin dashboard for user and resume management
- Dark/light mode toggle
- Responsive UI design with Material UI
- Global exception handling

## Technology Stack

### Backend

- Java 17
- Spring Boot 3.4.5
- Spring Security with JWT authentication
- Spring Data JPA
- PostgreSQL database
- iText PDF for PDF generation
- Lombok
- JUnit and Mockito for testing

### Frontend

- React 19
- React Router for navigation
- Axios for API requests
- Material UI components
- Formik and Yup for form validation
- CSS for styling

## Getting Started

### Prerequisites

- Java 17 or higher
- Node.js and npm
- PostgreSQL database

### Database Setup

1. Install PostgreSQL if you haven't already
2. Create a database named `resumebuilder`
3. Run the `fix_user_roles.sql` script to ensure proper role assignments for all users
4. See the [`DATABASE_SETUP.md`](DATABASE_SETUP.md) file for detailed instructions
5. Update the database connection settings in `back/src/main/resources/application.properties` if needed

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd back
   ```
2. Build the application:
   ```
   ./mvnw clean install
   ```
3. Run the backend server:
   ```
   ./mvnw spring-boot:run
   ```
   The backend will be available at http://localhost:8080

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd front
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Run the frontend development server:
   ```
   npm start
   ```
   The frontend will be available at http://localhost:3000

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login and get JWT token

### Resumes

- `GET /api/resumes` - Get all resumes (admin only)
- `GET /api/resumes/{id}` - Get resume by ID
- `GET /api/resumes/user/{userId}` - Get resumes by user ID
- `POST /api/resumes` - Create a new resume
- `PUT /api/resumes/{id}` - Update an existing resume
- `DELETE /api/resumes/{id}` - Delete a resume
- `GET /api/resumes/{id}/pdf` - Get resume as PDF

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/{id}` - Get user by ID
- `DELETE /api/users/{id}` - Delete a user (admin only)

## Database Schema

### Users Table

- id (PK)
- username
- email
- password
- created_at
- updated_at

### Roles Table

- id (PK)
- name (ROLE_USER, ROLE_ADMIN)

### User_Roles Table

- user_id (FK)
- role_id (FK)

### Resumes Table

- id (PK)
- title
- personal_info
- summary
- user_id (FK)
- created_at
- updated_at

### Education Table

- id (PK)
- resume_id (FK)
- institution
- degree
- field_of_study
- start_date
- end_date
- description
- created_at

## Fixed Issues

### User Role Assignment

- Fixed user registration to always assign ROLE_USER to new users in `AuthController.java`
- Created SQL script (`fix_user_roles.sql`) to ensure all existing users have the ROLE_USER role

### API URL Formatting

- Fixed missing slashes in API endpoint URLs in `resume.service.js`
- Corrected URL format for all resume operations (get, create, update, delete, PDF export)

### Admin Login

- Fixed admin login by resetting the admin user password
- Created scripts to recreate the admin user if needed
- Admin credentials are now: username: `admin`, password: `admin123`

### Verifying Fixes

To verify that all fixes have been applied correctly:

1. Run the backend server:

   ```
   cd back
   ./mvnw spring-boot:run
   ```

2. Run the frontend server:

   ```
   cd front
   npm start
   ```

3. Run the verification script:

   ```
   node verify-fixes.js
   ```

   This script will test all API endpoints to ensure they're working correctly.

4. Clean up unnecessary test files (optional):
   ```
   powershell -ExecutionPolicy Bypass -File cleanup_test_files.ps1
   ```

## Default Users

- updated_at

### Experience Table

- id (PK)
- resume_id (FK)
- company
- position
- location
- start_date
- end_date
- is_current
- description
- created_at
- updated_at

### Skills Table

- id (PK)
- resume_id (FK)
- name
- proficiency_level
- created_at
- updated_at

## License

This project is licensed under the MIT License.
