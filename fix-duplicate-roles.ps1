# PowerShell script to fix duplicate roles issue
# This script cleans up duplicate roles in the database

$Host.UI.RawUI.WindowTitle = "Fix Duplicate Roles"
$workingDir = "c:\Users\IDEAPAD\Downloads\g"
Set-Location $workingDir

Write-Host "This script will fix the 'Query did not return a unique result: 5 results were returned' error" -ForegroundColor Cyan
Write-Host "by cleaning up duplicate roles in the database." -ForegroundColor Cyan
Write-Host ""

# Ask for PostgreSQL credentials
$dbName = "resumebuilder"
$dbUser = Read-Host "Enter PostgreSQL username (default: postgres)"
if ([string]::IsNullOrEmpty($dbUser)) {
    $dbUser = "postgres"
}

Write-Host "Running SQL cleanup script..." -ForegroundColor Yellow
psql -U $dbUser -d $dbName -f cleanup_duplicate_roles.sql

Write-Host ""
Write-Host "Cleanup complete! Now you can start the backend server again." -ForegroundColor Green
Write-Host "Run: cd back; .\mvnw spring-boot:run" -ForegroundColor White

# Ask if user wants to start backend server now
$startBackend = Read-Host "Do you want to start the backend server now? (Y/N)"
if ($startBackend -eq "Y" -or $startBackend -eq "y") {
    Write-Host "Starting backend server..." -ForegroundColor Cyan
    Set-Location "$workingDir\back"
    .\mvnw spring-boot:run
}
