# Update Resume Table Schema PowerShell script
# This script updates the PostgreSQL database with the schema changes for resumes

# Database connection parameters
$dbHost = "localhost"
$dbPort = 5432
$dbName = "resumebuilder"
$dbUser = "postgres"
$dbPassword = "13579p13579"

# Path to the SQL script file
$sqlScriptFile = ".\update_resume_schema.sql"

Write-Host "Applying database schema updates for resumes..."

# Check if psql is available
try {
    $psqlVersion = & psql --version
    Write-Host "Found PostgreSQL client: $psqlVersion"
} catch {
    Write-Host "PostgreSQL client (psql) not found. Please install PostgreSQL client tools." -ForegroundColor Red
    exit 1
}

# Set environment variable for password
$env:PGPASSWORD = $dbPassword

# Execute the SQL script
Write-Host "Connecting to PostgreSQL database..."
try {
    & psql -h $dbHost -p $dbPort -d $dbName -U $dbUser -f $sqlScriptFile
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database schema updated successfully!" -ForegroundColor Green
    } else {
        Write-Host "Error updating database schema. Exit code: $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error executing SQL script: $_" -ForegroundColor Red
    exit 1
} finally {
    # Clear the password environment variable
    Remove-Item Env:\PGPASSWORD
}

Write-Host "Schema update complete!" -ForegroundColor Green
