# Resume Builder Debugging Guide

This guide provides solutions to common issues you might encounter with the Resume Builder application.

## Common Issues and Solutions

### 1. User Dashboard Access Issues

**Problem**: Users cannot access their resume dashboard after registration.

**Solution**:

- Ensure all users have the `ROLE_USER` role assigned in the database
- Run the `fix_user_roles.sql` script to automatically fix role assignments
- The `AuthController.java` has been updated to always assign the USER role to new registrations

### 2. Resume Creation/Viewing Errors

**Problem**: Getting 500 errors when trying to create or view resumes ("No static resource").

**Solution**:

- API URL formatting has been fixed in `resume.service.js`
- The issue was caused by missing slashes in the API endpoint URLs
- All API endpoints now have the correct format:
  - `API_URL + "/" + id` instead of `API_URL + id`
  - `API_URL + "/user/" + userId` instead of `API_URL + "user/" + userId`

### 3. Authentication Issues

**Problem**: "Unauthorized" errors or JWT token issues.

**Solution**:

- Check browser localStorage to ensure the JWT token is being stored correctly
- Verify that `auth-header.js` is correctly retrieving and formatting the token
- Make sure your backend security configuration allows the necessary endpoints

### 4. Database Connection Issues

**Problem**: Application cannot connect to the database.

**Solution**:

- Verify PostgreSQL is running
- Check the connection details in `application.properties`
- Ensure the database exists and has the correct tables
- Run the database setup scripts if needed

## Debugging Tools

The application includes several debugging tools:

### Backend Debugging

1. Enable debug logging in `application.properties`:

   ```
   logging.level.com.example.demo=DEBUG
   ```

2. Check Spring Boot logs for detailed error messages

### Frontend Debugging

1. Use browser developer tools (F12) to:

   - Check Network tab for API requests/responses
   - View Console for JavaScript errors
   - Inspect localStorage for authentication data

2. The application includes several debug endpoints:
   - `/api/resumes/debug/check-permissions/{userId}` - Checks user permissions
   - `/api/resumes/debug/user-roles` - Shows current user roles

## Running Test Scripts

For comprehensive testing, you can use the following cleanup script:

```powershell
.\cleanup_test_files.ps1
```

This will remove unnecessary test files that are no longer needed.
