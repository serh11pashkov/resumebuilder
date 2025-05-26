# PostgreSQL Database Setup for Resume Builder Application

This document provides detailed instructions on setting up PostgreSQL for the Resume Builder application, including configuring it with IntelliJ IDEA.

## 1. Install PostgreSQL

### For Windows:

1. Download the PostgreSQL installer from the official website: [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the prompts
3. When asked for a password for the database superuser (postgres), enter a secure password and make note of it
4. The default port is 5432, and it's recommended to keep it unless you have a specific reason to change it
5. Complete the installation (you can install pgAdmin as part of this process)

## 2. Set Up the Database

### Using pgAdmin:

1. Launch pgAdmin (it should be installed with PostgreSQL, or you can download it separately)
2. In the left sidebar, expand the "Servers" node
3. Enter your master password if prompted
4. Right-click on "Databases" and select "Create" > "Database"
5. Name the database `resumebuilder`
6. Click "Save" to create the database

### Alternatively, using command line:

1. Open a command prompt
2. Connect to PostgreSQL using the command:
   ```
   psql -U postgres
   ```
3. Enter your PostgreSQL superuser password
4. Create the database with:
   ```
   CREATE DATABASE resumebuilder;
   ```
5. Exit the PostgreSQL console with `\q`

## 3. Configure IntelliJ IDEA with PostgreSQL

### Install Database Tools and SQL Plugin (if not already installed):

1. Open IntelliJ IDEA
2. Go to File > Settings > Plugins
3. Search for "Database Tools and SQL"
4. Install the plugin and restart IntelliJ if needed

### Connect to PostgreSQL Database:

1. In IntelliJ IDEA, click on the "Database" tab on the right side of the window
2. Click the "+" button and select "Data Source" > "PostgreSQL"
3. Configure the connection with the following details:
   - Host: localhost
   - Port: 5432
   - Database: resumebuilder
   - User: postgres
   - Password: [your-postgres-password]
4. Test the connection by clicking the "Test Connection" button
5. If successful, click "Apply" and then "OK"

### View and Manage Database Schema:

1. Once connected, you can view your database in the "Database" tool window
2. Expand the PostgreSQL connection
3. You can view tables, run SQL queries, and manage the database directly from IntelliJ

## 4. Understanding the Database Schema

Our application uses the following tables:

1. **users** - Stores user information and credentials
2. **resumes** - Stores resume information
3. **education** - Stores education entries related to resumes
4. **experience** - Stores work experience entries related to resumes
5. **skills** - Stores skills related to resumes
6. **roles** - Stores user roles for authorization

## 5. Spring Boot Database Configuration

The database connection is configured in the `application.properties` file with the following settings:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/resumebuilder
spring.datasource.username=postgres
spring.datasource.password=password
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

**Important notes about these settings:**

- `spring.jpa.hibernate.ddl-auto=update`: This setting automatically updates the database schema based on entity classes. In production, consider using "validate" instead.
- `spring.jpa.show-sql=true`: Shows SQL statements in the console for debugging purposes. You may want to turn this off in production.
- Replace the `spring.datasource.password` with your actual PostgreSQL password.

## 6. Using pgAdmin to Manage the Database

pgAdmin is a powerful management tool for PostgreSQL:

1. **Navigate Database Objects**:

   - The left panel shows a tree view of your server, databases, schemas, tables, etc.

2. **Execute SQL Queries**:

   - Right-click on your database and select "Query Tool"
   - Write and execute SQL statements

3. **View Table Data**:

   - Right-click on a table and select "View/Edit Data" > "All Rows"

4. **Manage Schema**:

   - Create, modify, or delete tables through the GUI or SQL

5. **Check Server Status**:
   - Dashboard provides information about server activity and connections

## 7. Troubleshooting Database Connection Issues

If you encounter issues connecting to PostgreSQL:

1. **Check if PostgreSQL service is running**:

   - On Windows: Open Services (services.msc) and check if "postgresql-x64-15" (or similar) is running
   - Start the service if it's stopped

2. **Verify network connectivity**:

   - Ensure nothing is blocking port 5432

3. **Check credentials**:

   - Verify that you're using the correct username and password

4. **Database existence**:

   - Confirm that the `resumebuilder` database exists

5. **Permissions issues**:
   - Ensure the user has proper permissions for the database

## 8. Database Backup and Restore

It's a good practice to regularly back up your database:

### Backup using pgAdmin:

1. Right-click on your database
2. Select "Backup..."
3. Configure backup options and click "Backup"

### Restore using pgAdmin:

1. Right-click on your database
2. Select "Restore..."
3. Configure restore options and click "Restore"

## 9. Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pgAdmin Documentation](https://www.pgadmin.org/docs/)
- [Spring Data JPA Documentation](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
