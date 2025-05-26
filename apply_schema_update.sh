#!/bin/bash
# Script to apply the resume database schema update

echo "Applying database schema updates for resumes..."

# Determine your database connection parameters
# Reading from application.properties
DB_HOST="localhost"
DB_PORT=5432
DB_NAME="resumebuilder"
DB_USER="postgres"
DB_PASSWORD="13579p13579"

# Apply the SQL script update
echo "Connecting to PostgreSQL database..."
psql -h $DB_HOST -p $DB_PORT -d $DB_NAME -U $DB_USER -f update_resume_schema.sql

if [ $? -eq 0 ]; then
    echo "Database schema updated successfully!"
else
    echo "Error updating database schema. Please check the error message above."
    exit 1
fi

echo "Schema update complete!"
