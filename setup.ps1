# PowerShell script to set up the Resume Builder application
# This script helps you set up and verify the Resume Builder application

# Set the title for the PowerShell window
$Host.UI.RawUI.WindowTitle = "Resume Builder Setup"
$workingDir = "c:\Users\IDEAPAD\Downloads\g"
Set-Location $workingDir

# Database configuration
$dbName = "resumebuilder"
$dbUser = "postgres"

# Function to display colored messages
function Write-ColoredMessage {
    param (
        [string]$message,
        [string]$color = "White"
    )
    Write-Host $message -ForegroundColor $color
}

# Check if PostgreSQL is running
Write-ColoredMessage "Checking PostgreSQL service..." "Cyan"
try {
    $pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
    if ($pgService -and $pgService.Status -eq "Running") {
        Write-ColoredMessage "PostgreSQL service is running." "Green"
    } else {
        Write-ColoredMessage "PostgreSQL service is not running or not found. Please start it manually." "Yellow"
        Write-ColoredMessage "If PostgreSQL is installed, you can start it via Services or with:" "Yellow"
        Write-ColoredMessage "Start-Service postgresql*" "Yellow"
    }
} catch {
    Write-ColoredMessage "Could not check PostgreSQL service status. Make sure PostgreSQL is installed and running." "Yellow"
}

# Offer to run cleanup script for duplicate roles
Write-ColoredMessage "`nDo you want to clean up duplicate roles in the database? (Y/N)" "Cyan"
$cleanupRoles = Read-Host
if ($cleanupRoles -eq "Y" -or $cleanupRoles -eq "y") {
    Write-ColoredMessage "Cleaning up duplicate roles..." "Yellow"
    psql -U $dbUser -d $dbName -f cleanup_duplicate_roles.sql
    Write-ColoredMessage "Duplicate roles cleanup complete!" "Green"
}

# Offer to run SQL setup scripts
Write-ColoredMessage "`nDo you want to run the SQL setup scripts? (Y/N)" "Cyan"
$runSQL = Read-Host
if ($runSQL -eq "Y" -or $runSQL -eq "y") {
    Write-ColoredMessage "Running SQL setup scripts..." "Cyan"
    
    # Setup admin user and roles
    Write-ColoredMessage "Setting up admin user and roles..." "Yellow"
    psql -U $dbUser -d $dbName -f setup_admin.sql
    
    # Fix user roles for existing users
    Write-ColoredMessage "Fixing user roles for existing users..." "Yellow"
    psql -U $dbUser -d $dbName -f fix_user_roles.sql
    
    Write-ColoredMessage "SQL setup complete!" "Green"
    
    Write-ColoredMessage "`nAdmin credentials:" "Magenta"
    Write-ColoredMessage "Username: admin" "White"
    Write-ColoredMessage "Password: admin123" "White"
}

# Offer to start the backend server
Write-ColoredMessage "`nDo you want to start the backend server? (Y/N)" "Cyan"
$startBackend = Read-Host
if ($startBackend -eq "Y" -or $startBackend -eq "y") {
    Write-ColoredMessage "Starting Spring Boot backend..." "Cyan"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$workingDir\back'; .\mvnw spring-boot:run"
    Write-ColoredMessage "Backend server starting in new window..." "Green"
}

# Offer to start the frontend server
Write-ColoredMessage "`nDo you want to start the frontend server? (Y/N)" "Cyan"
$startFrontend = Read-Host
if ($startFrontend -eq "Y" -or $startFrontend -eq "y") {
    Write-ColoredMessage "Starting React frontend..." "Cyan"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$workingDir\front'; npm start"
    Write-ColoredMessage "Frontend server starting in new window..." "Green"
}

# Offer to run verification script
Write-ColoredMessage "`nDo you want to run the verification script to test the API endpoints? (Y/N)" "Cyan"
$runVerify = Read-Host
if ($runVerify -eq "Y" -or $runVerify -eq "y") {
    Write-ColoredMessage "Running verification script..." "Cyan"
    node verify-fixes.js
}

Write-ColoredMessage "`nSetup process complete!" "Green"
Write-ColoredMessage "You can access the application at: http://localhost:3000" "White"
